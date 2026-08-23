import "./VotingOption.css"


function VotingOption(props) {
    const option = props.option
    const selected = props.selected
    const directSetVote = props.directSetVote
    const voteFunction = props.voteFunction

    const handleVote = (event) => {
        event.preventDefault()
        if (voteFunction) {
            directSetVote({ option_id: option.destination })
            voteFunction(option.destination)
        }
    }

    return (
        <button className={'voting-option ' + selected} type="button" onClick={handleVote} >
            {option.name}
        </button >
    )
};

export default VotingOption