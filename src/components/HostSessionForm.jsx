import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./HostSessionForm.css"

import getResumeSession from "../api/get-resume-session"
import postStartSession from "../api/post-start-session"
import useGetSlideDecks from "../hooks/use-get-slide-decks"

function HostSessionForm() {
    const [sessionId, setSessionId] = useState(window.localStorage.getItem("sessionId"))
    const { decks, decksLoading, decksError } = useGetSlideDecks()
    const navigate = useNavigate()

    const handleStartSession = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target.form)
        const first_slide_id = formData.get("first_slide_id")
        postStartSession(first_slide_id)
            .then((response) => {
                window.localStorage.setItem("sessionId", response.id)
                setSessionId(response.id)
                navigate(`/slide/${response.current_slide_id}`)
            })
    }

    const handleResumeSession = (event) => {
        event.preventDefault()

        getResumeSession(sessionId)
            .then((response) => {
                window.localStorage.setItem("sessionId", response.id)
                navigate(`/slide/${response.current_slide_id}`)
            })
    }


    if (decksError) {
        return (<p>{decksError.message}</p>)
    }

    if (decksLoading || decks.length === 0) {
        return (<p>Loading hosting options...</p>)
    }

    return (
        <form id="host-session-form">
            <h1>Hosting</h1>
            <div>
                <button type="button" onClick={handleStartSession}>
                    Start New Session
                </button>
                <select name="first_slide_id">
                    {decks.map((deck, key) => {
                        return (
                            <option key={key} value={deck.first_slide_id}>{deck.title}</option>
                        )
                    })}
                </select>
                <button type="button" onClick={handleResumeSession} disabled={sessionId === null}>
                    Resume Session
                </button>
            </div>
        </form>

    )
}

export default HostSessionForm