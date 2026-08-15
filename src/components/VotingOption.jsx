import { useState } from 'react'

import "./VotingOption.css"

import postSendVote from "../api/post-send-vote"

function VotingOption(props) {
    const audienceId = window.localStorage.getItem("audienceId", null)
    const sessionId = window.localStorage.getItem("sessionId", null)
    const option = props.option
    const slideId = props.slideId
    const [selected, setSelected] = useState(props.selected)
    const directSetVote = props.directSetVote

    const handleVote = (event) => {
        event.preventDefault()
        if (audienceId && sessionId) {
            postSendVote(audienceId, option.destination, slideId, sessionId)
                .then((response) => {
                    directSetVote(response)
                    setSelected(true)
                    console.log(response)
                })
        }
        console.log(option.name, option.destination)
    }

    return (
        <button className={'voting-option' + (selected && 'selected')} type="button" onClick={handleVote} >
            {option.name}
        </button >
    )
};

export default VotingOption