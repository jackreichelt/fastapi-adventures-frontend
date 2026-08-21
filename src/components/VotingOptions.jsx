import "./VotingOptions.css"

import VotingOption from "./VotingOption"

function VotingOptions(props) {
    const options = props.options
    const slideId = props.slideId
    const selectedOption = props.selectedOption
    const directSetVote = props.directSetVote

    return (
        <div id="voting-options">
            {options.map((option, key) => {
                return <VotingOption
                    key={key}
                    option={option}
                    slideId={slideId}
                    selected={option.destination === selectedOption}
                    directSetVote={directSetVote}
                />
            })}
        </div>
    )
};

export default VotingOptions