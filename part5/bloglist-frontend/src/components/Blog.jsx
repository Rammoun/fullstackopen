import {useState} from 'react'

const Blog = ({blog, handleLike, handleDelete, user}) => {
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('Show')

  const showWhenVisible = {display: visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
    setLabel(visible ? 'Show' : 'Hide')
  }

  const showRemoveButton = blog.user && user && blog.user.username === user.username
  return (
    <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{label}</button>
      <div className="blog-details" style={showWhenVisible}>
        {blog.url}<br/>
        Likes: {blog.likes}<button onClick={handleLike}>Like</button><br/>
        {blog.user && blog.user.name}<br/>
        {showRemoveButton && (
          <button className='remBtn'  onClick={handleDelete}>Remove</button>
        )}
      </div>
    </div>
  )
}
export default Blog