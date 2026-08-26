import "./VotingOptions.css"

import VotingOption from "./VotingOption"

function VotingOptions(props) {
    const options = props.options
    const selectedOption = props.selectedOption
    const directSetVote = props.directSetVote
    const voteFunction = props.voteFunction

    if (options.length === 1) {
        return (
            <div>
                No options from this slide.
            </div>
        )
    }

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