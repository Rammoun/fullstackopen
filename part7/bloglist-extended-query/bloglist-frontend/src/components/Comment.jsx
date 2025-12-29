import {useState} from 'react'
import {TextField,Button} from '@mui/material'
const Comment = ({blog, addComment}) =>{
  const [comment, setComment] = useState('')

  const commentChangeHandler=(event)=>{
    setComment(event.target.value)
  }

  const submitComment=(event)=>{
    event.preventDefault()
    addComment(blog,comment)
    setComment('')
  }

  return(
    <div>
      <h3>Comments</h3>
      <form onSubmit={submitComment}>
        <TextField size="small" label="Comment" variant="outlined" value={comment} onChange={commentChangeHandler} />
        <Button variant="contained" color="success" type="submit">Add Comment</Button>
      </form>
      <ul>
        {blog.comments && blog.comments.map((comment,index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}
export default Comment