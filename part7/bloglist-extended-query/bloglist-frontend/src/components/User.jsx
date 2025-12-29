import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import usersService from '../services/usersService'

const User = () => {
  const { username } = useParams()
  const result=useQuery({
    queryKey: ['user', username],
    queryFn:()=>usersService.getOne(username)
  })

  if ( result.isLoading ) return <div>loading data...</div>
  const user = result.data

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  )

}

export default User