import { useNavigate } from "react-router-dom"

import "./PollBar.css"

function PollBar(props) {
    const navigate = useNavigate()

    const option = props.option
    const votes = props.votes
    const totalVotes = props.totalVotes
    const changeSlide = props.changeSlide
    const votesFraction = votes / totalVotes * 100

    const goToSlide = () => {
        changeSlide(option.destination)
        navigate(`/slide/${option.destination}`)
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