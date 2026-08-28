import { useNavigate } from "react-router-dom"

import "./PollBar.css"

function PollBar(props) {
    const navigate = useNavigate()

    const option = props.option
    const votes = props.votes
    const totalVotes = props.totalVotes
    const changeSlide = props.changeSlide
    let votesFraction = totalVotes === 0 ? 0 : votes / totalVotes * 100

    const goToSlide = () => {
        changeSlide(option.destination)
        navigate(`/slide/${option.destination}`)
    }

    if (totalVotes === -1) {
        return (
            <div className="pollBar" onClick={goToSlide}>
                <div className="filledPoll" style={{ 'width': '100%' }}>
                    <p>
                        {option.name}
                    </p>
                </div>
            </div >
        )
    }

    return (
        <div className="pollBar" onClick={goToSlide}>
            <div className="filledPoll" style={{ 'width': `${votesFraction}%` }}>
                <p>
                    {option.name} - {votes}
                </p>
            </div>
        </div >
    )
};

export default PollBar