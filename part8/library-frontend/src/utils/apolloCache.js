import { BOOKS_BY_GENRE } from '../queries'

export const addBookToCache= (cache, addedBook) => {
  cache.updateQuery({ query: BOOKS_BY_GENRE, variables: { genre: null } }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === addedBook.id,
    )

    if (bookExists) {
      return { allBooks }
    }
      
    return {
      allBooks: allBooks.concat(addedBook),
    }
    
  })
}