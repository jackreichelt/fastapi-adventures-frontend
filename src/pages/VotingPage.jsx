import { WebPubSubClient } from "@azure/web-pubsub-client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ReadyState } from 'react-use-websocket'

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

    const [client, setClient] = useState()
    const [fallbackMode, setFallbackMode] = useState(false)

    useEffect(() => {
        const client = new WebPubSubClient({
            getClientAccessUrl: async () => {
                let value = await (await fetch(`${import.meta.env.VITE_API_URL}/api/v1/connections/negotiate?audience_id=${audienceId}`)).json()
                return value.url
            },
        }, {
            autoReconnect: false,
        })

        client.on("group-message", e => {
            const chunks = e.message.data.split(": ")
            if (chunks[0] === "New slide") {
                navigate(`/vote/${chunks[1]}`)
            }
        })

        client.start().then(() => {
            setClient(client)
        }).catch(e => {
            console.log('Error starting pubsub client', e)
            setFallbackMode(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'open',
        [ReadyState.CLOSING]: 'closing',
        [ReadyState.CLOSED]: 'closed',
        [ReadyState.UNINSTANTIATED]: 'uninstantiated',
        false: 'open',
        true: 'closed'
    }[fallbackMode]

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
            <VotingOptions
                options={pollOptions}
                selectedOption={vote?.option_id}
                directSetVote={directSetVote}
                voteFunction={(optionId) => {
                    client.sendEvent(
                        "vote",
                        JSON.stringify({
                            audience_id: audienceId,
                            option_id: optionId,
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

export default VotingPage