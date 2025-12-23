import {useDispatch} from 'react-redux'
import {filterReducer} from '../reducers/anecdoteFilterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()

  const handleFilterChange=(event)=>{
    console.log(event.target.value)
    dispatch(filterReducer(event.target.value))
  }

  const style = {
    marginBottom: 10
  }

    return(
        <div style={style}>Filter: <input onChange={handleFilterChange} /></div>
    )
}

export default AnecdoteFilter;