const LogoutForm = ({ handleLogout, user }) => (
  <form onSubmit={handleLogout}>
    {user.name} logged in
    <button type="submit">logout</button>
  </form>
)

export default LogoutForm