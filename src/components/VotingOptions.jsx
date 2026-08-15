import "./VotingOptions.css"

import VotingOption from "./VotingOption"

function VotingOptions(props) {
    const options = props.options
    const slideId = props.slideId
    const selectedOption = props.selectedOption

    return (
        <div id="voting-options">
            {options.map((option, key) => {
                return <VotingOption key={key} option={option} slideId={slideId} selected={option === selectedOption} />
            })}
        </div>
    )
};

export default VotingOptions