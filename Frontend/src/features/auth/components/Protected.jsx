import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <>Loading...</>
  }

  // If user is present then take him to dashboard
  return user ? children : <Navigate to="/" replace />
}

export default Protected
