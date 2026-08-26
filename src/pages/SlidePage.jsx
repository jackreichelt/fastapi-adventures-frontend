import { WebPubSubClient } from "@azure/web-pubsub-client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ReadyState } from "react-use-websocket"

import "./theme.css"

import "./SlidePage.css"

import ConnectionIndicator from "../components/ConnectionIndicator"
import PollOptions from "../components/PollOptions"
import TitleContent from "./TitleContent"

import useGetSlide from "../hooks/use-get-slide"
import useGetVotes from "../hooks/use-get-votes"
import ComboContent from "./ComboContent"
import ImageContent from "./ImageContent"
import TextContent from "./TextContent"

function SlidePage() {
    const navigate = useNavigate()
    const { slideId } = useParams()
    const sessionId = window.localStorage.getItem("sessionId", null)

    const { slide, slideLoading, slideError, pollOptions } = useGetSlide(slideId)
    const { votes, votesLoading, votesError, updateVotes } = useGetVotes(sessionId, slideId)

    const [client, setClient] = useState()
    const [quitPresses, setQuitPresses] = useState(0)
    const [secretPresses, setSecretPresses] = useState(0)

    const [debug, setDebug] = useState(false)
    const [fallbackMode, setFallbackMode] = useState(false)

    const toggleDebug = () => {
        setDebug(!debug)
    }

    useEffect(() => {
        const client = new WebPubSubClient({
            getClientAccessUrl: async () => {
                let value = await (await fetch(`${import.meta.env.VITE_API_URL}/api/v1/connections/negotiate?audience_id=presenter&mode=presenter`)).json()
                return value.url
            },
        }, {
            autoReconnect: false,
        })

        client.on("group-message", e => {
            const chunks = e.message.data.split(" ")
            if (chunks[0] === "Vote") {
                updateVotes(e.message.data)
            }
        })

        client.start().then(() => {
            setClient(client)
        }).catch(e => {
            setFallbackMode(true)
            console.log("Error starting pubsub client", e)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const goToTopVotedSlide = () => {
            let highestVotedSlideId = null
            if (Object.keys(votes).length) {
                highestVotedSlideId = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b)
            }

            if (pollOptions.length === 1) {
                highestVotedSlideId = pollOptions[0].destination
            }

            if (highestVotedSlideId) {
                client.sendEvent(
                    "change-slide",
                    JSON.stringify({
                        slide_id: highestVotedSlideId,
                        session_id: sessionId
                    }),
                    "text").catch(e => {
                        console.log("Error sending message", e)
                    })

                navigate(`/slide/${highestVotedSlideId}`)
            }
        }

        const handleKeyUp = (e) => {
            if (e.key === " " || e.key === "Enter") {
                goToTopVotedSlide()
            } else if (e.key === "q") {
                if (quitPresses >= 2) {
                    // Jump to end slide
                    client.sendEvent(
                        "change-slide",
                        JSON.stringify({
                            slide_id: 28,
                            session_id: sessionId
                        }),
                        "text").catch(e => {
                            console.log("Error sending message", e)
                        })

                    navigate("/slide/28")
                }
                setQuitPresses(current => current + 1)
            } else if (e.key === "s") {
                if (secretPresses >= 2) {
                    // Jump to secret slide
                    client.sendEvent(
                        "change-slide",
                        JSON.stringify({
                            slide_id: 23,
                            session_id: sessionId
                        }),
                        "text").catch(e => {
                            console.log("Error sending message", e)
                        })

                    navigate("/slide/23")
                }
                setSecretPresses(current => current + 1)
            } else if (e.key === "a" && client) {
                // Announce the current slide to catch the audience up
                // TODO: Make this only send once
                client.sendEvent(
                    "change-slide",
                    JSON.stringify({
                        slide_id: slideId,
                        session_id: sessionId
                    }),
                    "text").catch(e => {
                        console.log("Error sending message", e)
                    })
            }
        }

        document.addEventListener("keyup", handleKeyUp)
    }, [client, navigate, pollOptions, quitPresses, secretPresses, sessionId, slideId, votes])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
        false: 'open',
        true: 'closed'
    }[fallbackMode]

    if (slideError || votesError) {
        return (<p>{slideError.message || votesError.message}</p>)
    }

    if (slideLoading || votesLoading || !slide || !votes) {
        return (<p>loading...</p>)
    }

    let slideContents = null
    if (slide.contents.length === 0) {
        if (slide.image === "") {
            slideContents = (
                <TitleContent slide={slide} />
            )
        } else {
            slideContents = (
                <ImageContent slide={slide} />
            )
        }
    } else {
        if (slide.image === "") {
            slideContents = (
                <TextContent slide={slide} />
            )
        } else {
            slideContents = (
                <ComboContent slide={slide} />
            )
        }
    }

    // TODO: Add different components depending on the contents and image of the slide
    return (
        <div className="slide">
            <ConnectionIndicator status={connectionStatus} onClick={toggleDebug} />
            {slideContents}
            {/* <DebugOutput display={debug} messages={messages} /> */}
            {/* {debug && (<div>
                <p>Debug messages:</p>
                <p>Session ID: {sessionId}</p>
                <ul>
                    {messages && messages.map((message, key) => {
                        return (
                            <li key={key}>
                                {message}
                            </li>
                        )
                    })}
                </ul>
            </div>)} */}
            <PollOptions
                options={pollOptions}
                votesTally={votes}
                changeSlide={(slideId) => {
                    client.sendEvent(
                        "change-slide",
                        JSON.stringify({
                            slide_id: slideId,
                            session_id: sessionId
                        }),
                        "text").catch(e => {
                            console.log("Error sending message", e)
                        })
                }} />
        </div>
    )
}

export default SlidePage