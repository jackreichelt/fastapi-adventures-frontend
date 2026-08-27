import { useEffect, useState } from "react"

import getVotes from "../api/get-votes"

export default function useGetVotes(sessionId, slideId) {
    const [votes, setVotes] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState()

    // Use the functional form of setVotes so the tally is always derived from
    // the latest state. The pubsub group-message handler in SlidePage is
    // registered once, so it holds a closure over the first render and would
    // otherwise read a permanently stale `votes`.
    const updateVotes = (voteMessage) => {
        const destination = voteMessage.split(" ").at(-1)
        if (voteMessage.includes("removed")) {
            setVotes(current => ({
                ...current,
                [destination]: Math.max((current[destination] ?? 0) - 1, 0)
            }))
        } else if (voteMessage.includes("added")) {
            setVotes(current => ({
                ...current,
                [destination]: (current[destination] ?? 0) + 1
            }))
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
