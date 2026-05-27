import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const PublicRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <>Loading...</>
  }

  //if user is present then navigate to dashboard otherwise take him to login
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default PublicRoute
