import {useState} from 'react'
import { Link } from 'react-router-dom'
import Comment from './Comment'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from '@mui/material'

const Blog = ({blog, handleLike, handleComment, handleDelete, user, className}) => {
  const isSingleView = className.includes('single')
  const [visible, setVisible] = useState(isSingleView)

  const showWhenVisible = {display: visible ? '' : 'none'}
  const showRemoveButton = blog.user && user && blog.user.username === user.username

  return (
    <div className='blog'>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow className="blog-details" style={showWhenVisible}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3}>{blog.url}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ width: 70 }}>Likes: </TableCell>
                    <TableCell style={{ width: 70 }}>{blog.likes}</TableCell>
                    <TableCell><Button variant="contained" color="primary" onClick={handleLike}>Like</Button></TableCell>
                    </TableRow>
                  <TableRow>
                    <TableCell>added by: </TableCell>
                    <TableCell colSpan={2}>{blog.user && blog.user.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}><Comment blog={blog} addComment={handleComment} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {showRemoveButton && (
                        <Button variant="contained" color="error" onClick={handleDelete}>Remove</Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default Blog