import {useSelector,useDispatch} from 'react-redux'
import {voteForAnecdote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

const AnecdoteList=()=>{
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes); console.log(anecdotes)
  const filter = useSelector(state => state.filter); console.log(filter)
  const filteredAnecdotes = anecdotes.filter(an => an.content.toLowerCase().includes(filter.toLowerCase()));
  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes);

  const vote = id => {
    console.log('vote', id)
    const anecdote = anecdotes.find(an => an.id === id)
    dispatch(voteForAnecdote(id))
    dispatch(setNotification(`You voted for '${anecdote.content}'`,5))
  }

  return(
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList