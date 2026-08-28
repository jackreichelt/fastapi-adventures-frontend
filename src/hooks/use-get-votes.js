import { useEffect, useState } from "react"

import getVotes from "../api/get-votes"

export default function useGetVotes(sessionId, slideId) {
    const [votes, setVotes] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()

    const updateVotes = (voteMessage) => {
        const destination = voteMessage.split(" ").at(-1)
        if (voteMessage.includes("removed")) {
            setVotes(current => {
                const newVotes = { ...current }
                newVotes[destination] = Math.max(current[destination] - 1 || 0, 0)
                return newVotes
            })
        } else if (voteMessage.includes("added")) {
            setVotes(current => {
                const newVotes = { ...current }
                newVotes[destination] = current[destination] + 1 || 1
                return newVotes
            })
        }
    }

    useEffect(() => {
        getVotes(sessionId, slideId)
            .then(votes => {
                const votesTally = {}
                votes.map(vote => votesTally[vote.option_id] = (votesTally[vote.option_id] || 0) + 1)
                setVotes(votesTally)
                setIsLoading(false)
            })
            .catch(error => {
                setError(error)
                setIsLoading(false)
            })
    }, [sessionId, slideId])

    return { votes, isLoading, error, updateVotes }
}
