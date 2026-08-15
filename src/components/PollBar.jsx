import { useNavigate } from "react-router-dom"

import "./PollBar.css"

function PollBar(props) {
    const navigate = useNavigate()

    const option = props.option
    const votes = props.votes
    const totalVotes = props.totalVotes
    const votesFraction = votes / totalVotes * 100

    const goToSlide = () => {
        navigate(`/slide/${option}`)
    }

    return (
        <div className="pollBar">
            <div className="filledPoll" style={{ 'width': `${votesFraction}%` }} onClick={goToSlide}>
                <p>
                    {option.name} - {votes}
                </p>
            </div>
        </div >
    )
};

export default PollBar