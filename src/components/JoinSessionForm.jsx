import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "./JoinSessionForm.css"

import getJoinSession from "../api/get-join-session.js"

function JoinSessionForm() {
    const navigate = useNavigate()

    const [sessionId, setSessionId] = useState()
    const audienceId = window.localStorage.getItem("audienceId", null)

    const handleChange = (event) => {
        const { value } = event.target
        setSessionId(value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (sessionId) {
            getJoinSession(sessionId, audienceId)
                .then((response) => {
                    console.log('Joining session', response)
                    window.localStorage.setItem("sessionId", response.id)
                    window.localStorage.setItem("audienceId", response.audience_id)
                    navigate(`/vote/${response.current_slide_id}`)
                })
        }
    }

    return (
        <form id="join-session-form">
            <h1>Audience</h1>
            <div>
                <div className="input-div">
                    <label htmlFor="sessionId">Session ID:</label>
                    <input
                        type="text"
                        id="sessionId"
                        placeholder="Enter session ID"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>
                    Join Session
                </button>
            </div>
        </form>
    )
}

export default JoinSessionForm