import { WebPubSubClient } from "@azure/web-pubsub-client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useWebSocket, { ReadyState } from 'react-use-websocket'

import "./theme.css"

import "./VotingPage.css"

import ConnectionIndicator from "../components/ConnectionIndicator"
import VotingOptions from "../components/VotingOptions"
import useSlide from "../hooks/use-get-slide"
import useGetVote from "../hooks/use-get-vote"

function VotingPage() {
    const navigate = useNavigate()

    const audienceId = window.localStorage.getItem("audienceId", null)
    const sessionId = window.localStorage.getItem("sessionId", null)
    const { slideId } = useParams()
    const { slide, isLoading: isSlideLoading, error: slideError, pollOptions } = useSlide(slideId)
    const { vote, isLoading: isVoteLoading, error: voteError, directSetVote } = useGetVote(audienceId, slideId, sessionId)

    const socketUrl = `${import.meta.env.VITE_API_URL}/ws/v1/audience`
    const { lastMessage, readyState } = useWebSocket(socketUrl)
    const [_, setMessages] = useState([])

    const [client, setClient] = useState()

    useEffect(() => {
        const client = new WebPubSubClient({
            getClientAccessUrl: async () => {
                let value = await (await fetch(`${import.meta.env.VITE_API_URL}/api/v1/connections/negotiate?audience_id=${audienceId}`)).json()
                return value.url
            },
        }, {
            autoReconnect: false,
        })

        client.on("group-message", m => {
            console.log("Message received:", m)
        })

        client.start().then(() => {
            setClient(client)
            // client.sendToGroup("presenter", "0", "text").catch(e => {
            //     console.log("Error sending to group", e, e.errorDetail)
            // })
            // client.sendEvent("test", `{ "audience_id": "${audienceId}", "option": "${0}" }`, "text").then((e) => {
            //     console.log("sent event", e)
            // }).catch(e => {
            //     console.log("Error sending message", e)
            // })
        }).catch(e => {
            console.log('Error starting pubsub client', e)
        })
    }, [])

    useEffect(() => {
        if (lastMessage !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessages((prevMessages) => prevMessages.concat(lastMessage.data))
            let chunks = lastMessage.data.split(': ')
            if (chunks[0] === "Slide changed") {
                navigate(`/vote/${chunks[1]}`)
            }
        }
    }, [lastMessage, navigate])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
    }[readyState]


    if (isSlideLoading || isVoteLoading) {
        return (<p>loading...</p>)
    }

    if (slideError) {
        return (<p>{slideError.message}</p>)
    }
    if (voteError) {
        return (<p>{voteError.message}</p>)
    }

    return (
        <div className="voting-page">
            <ConnectionIndicator status={connectionStatus} />
            <h1 id="voting-title">Voting:</h1>
            <h2 id="slide-title">{slide.title}</h2>
            {/* <div>
                <ul>
                    {messages && messages.map((message, key) => {
                        return (
                            <li key={key}>
                                {message}
                            </li>
                        )
                    })}
                </ul>
            </div> */}
            <VotingOptions
                options={pollOptions}
                slideId={slideId}
                selectedOption={vote?.option_id}
                directSetVote={directSetVote}
                voteFunction={(optionId) => {
                    client.sendEvent("vote", `{ "audience_id": "${audienceId}", "option_id": "${optionId}", "slide_id": "${slideId}", "session_id": "${sessionId}" }`, "text").then((e) => {
                        console.log("sent event", e)
                    }).catch(e => {
                        console.log("Error sending message", e)
                    })
                }} />
        </div>
    )
}

export default VotingPage