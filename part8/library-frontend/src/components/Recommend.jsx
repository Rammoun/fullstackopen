import { useQuery } from '@apollo/client/react'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommend = (props) => {
  const { data: userData, loading: userLoading }  = useQuery(ME)
  const favoriteGenre = userData?.me?.favoriteGenre
  const { data: booksData, loading: booksLoading } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre 
  })

  if (!props.show) {
    return null
  }

  if (userLoading || booksLoading) {
    return <div>loading...</div>
  }

  const books = booksData?.allBooks || []

  // const recommendedBooks = books.filter(book => 
  //   book.genres.includes(favoriteGenre)
  // )

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>

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
    </div>
  )
}

export default Recommend