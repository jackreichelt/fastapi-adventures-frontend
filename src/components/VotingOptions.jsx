import "./VotingOptions.css"

import VotingOption from "./VotingOption"

function VotingOptions(props) {
    const options = props.options
    const selectedOption = props.selectedOption
    const directSetVote = props.directSetVote
    const voteFunction = props.voteFunction

    return (
        <div id="voting-options">
            {options.map((option, key) => {
                return <VotingOption
                    key={key}
                    option={option}
                    selected={option.destination === selectedOption}
                    directSetVote={directSetVote}
                    voteFunction={voteFunction}
                />
            })}
        </div>
    )
};

export default VotingOptions