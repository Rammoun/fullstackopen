const Login = (props) => {
  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={props.username} onChange={props.usernameChangeHandler} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" value={props.password} onChange={props.passwordChangeHandler} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login