import {useState} from 'react'

const NewBlog=({ createBlog })=>{
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const titleChangeHandler=(event)=>{
    setTitle(event.target.value)
  }

  const authorChangeHandler=(event)=>{
    setAuthor(event.target.value)
  }

  const urlChangeHandler=(event)=>{
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }
  

  return(
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Title:
            <input type="text" placeholder="write title here" value={title} onChange={titleChangeHandler} />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input placeholder="write author here" type="text" value={author} onChange={authorChangeHandler} />
          </label>
        </div>
        <div>
          <label>
            Url:
            <input placeholder="write url here" type="text" value={url} onChange={urlChangeHandler} />
          </label>
        </div>
        <button type="submit" name="create">Create</button>
      </form>
    </div>
  )
}

export default NewBlog