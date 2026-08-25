import { useNavigate } from "react-router-dom"

import "./PollBar.css"

function PollBar(props) {
    const navigate = useNavigate()

    const option = props.option
    const votes = props.votes
    const totalVotes = props.totalVotes
    const changeSlide = props.changeSlide
    const votesFraction = totalVotes === 0 ? 0 : votes / totalVotes * 100

    const goToSlide = () => {
        console.log('changing slide', option.destination)
        changeSlide(option.destination)
        navigate(`/slide/${option.destination}`)
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