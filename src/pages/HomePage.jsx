import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import "./theme.css"

import "./HomePage.css"

import HostSessionForm from "../components/HostSessionForm"
import JoinSessionForm from "../components/JoinSessionForm"

import getJoinSession from "../api/get-join-session.js"

function HomePage() {
    const navigate = useNavigate()

    const audienceId = window.localStorage.getItem("audienceId", null)

    const paramsString = window.location.search
    const searchParams = new URLSearchParams(paramsString)
    const autoJoinSessionId = searchParams.get('session')

    useEffect(() => {
        if (autoJoinSessionId) {
            console.log('Attempting to auto join session', autoJoinSessionId)
            getJoinSession(autoJoinSessionId, audienceId)
                .then((response) => {
                    searchParams.delete('session')
                    console.log('Auto joining session', response)
                    window.localStorage.setItem("sessionId", response.id)
                    window.localStorage.setItem("audienceId", response.audience_id)
                    navigate(`/vote/${response.current_slide_id}`)
                    window.location.search = searchParams.toString()
                })
        }
    }, [])

    return (
        <div id="">
            <JoinSessionForm />

            <HostSessionForm />
        </div>
    )
};

export default HomePage