import {useDispatch} from 'react-redux'
import {appendAnecdote} from '../reducers/anecdoteReducer'
import {setNotification} from '../reducers/notificationReducer'

import anecdotes from '../services/anecdotes'

const AnecdoteForm=()=>{  
  const dispatch = useDispatch()
  const addAnecdote=async (event)=>{
    event.preventDefault()
    const content=event.target.content.value
    event.target.content.value=''
    // const newAnecdote= await anecdotes.createNew(content)
    // dispatch(appendAnecdote(newAnecdote.content))
    dispatch(appendAnecdote(content))
    dispatch(setNotification(`New anecdote created: '${content}'`,5))
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm