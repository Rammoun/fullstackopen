import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { BOOKS_BY_GENRE, ALL_BOOKS_BASIC } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const genresResult = useQuery(ALL_BOOKS_BASIC)
  const booksResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    fetchPolicy: 'cache-and-network' 
  })

  if (!props.show) {
    return null
  }

  if (genresResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }
  
  const allGenresBooks = genresResult.data.allBooks

  let genres = []
  allGenresBooks.forEach((book) => {
    book.genres.forEach((g) => {
      if (!genres.includes(g)) {
        genres.push(g)
      }
    })
  })
  
  const books = booksResult.data.allBooks

  // const filteredBooks = genre === null 
  //   ? books 
  //   : books.filter(book => book.genres.includes(genre))

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g,index) => ( 
          <button key={index} type="button" onClick={() => setGenre(g)} >{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books

