import "./VotingOption.css"

import postSendVote from "../api/post-send-vote"

function VotingOption(props) {
    const audienceId = window.localStorage.getItem("audienceId", null)
    const sessionId = window.localStorage.getItem("sessionId", null)
    const option = props.option
    const slideId = props.slideId
    const selected = props.selected
    const directSetVote = props.directSetVote

    const handleVote = (event) => {
        event.preventDefault()
        if (audienceId && sessionId) {
            directSetVote({ option_id: option.destination })
            postSendVote(audienceId, option.destination, slideId, sessionId)
            // .then((response) => {
            //     directSetVote(response)
            // })
        }
    }

    return (
        <button className={'voting-option ' + selected} type="button" onClick={handleVote} >
            {option.name}
        </button >
    )
};

export default VotingOption