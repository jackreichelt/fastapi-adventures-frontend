import { WebPubSubClient } from "@azure/web-pubsub-client"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ReadyState } from 'react-use-websocket'

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
    const { slideId } = useParams()
    const sessionId = window.localStorage.getItem("sessionId", null)

    const { slide, slideLoading, slideError, pollOptions } = useGetSlide(slideId)
    const { votes, votesLoading, votesError, updateVotes } = useGetVotes(sessionId, slideId)

    const [client, setClient] = useState()

    const [debug, setDebug] = useState(false)

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
            console.log('message received', chunks)
            if (chunks[0] === "Vote") {
                updateVotes(e.message.data)
            }
        })

        client.start().then(() => {
            setClient(client)
        }).catch(e => {
            console.log('Error starting pubsub client', e)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
    }[0] // TODO: Make this work again for pubsub

    if (slideError || votesError) {
        return (<p>{slideError.message || votesError.message}</p>)
    }

    if (slideLoading || votesLoading || !slide || !votes) {
        return (<p>loading...</p>)
    }

    let slideContents = null
    if (slide.contents.length === 0) {
        if (slide.image === '') {
            slideContents = (
                <TitleContent slide={slide} />
            )
        } else {
            slideContents = (
                <ImageContent slide={slide} />
            )
        }
    } else {
        if (slide.image === '') {
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