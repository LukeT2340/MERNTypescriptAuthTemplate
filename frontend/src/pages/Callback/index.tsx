import { useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext"

const Callback: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()

  // Extract all query parameters dynamically
  const searchParams = new URLSearchParams(location.search)
  const user: Record<string, string | null> = {}

  // Populate the user object with all query parameters
  searchParams.forEach((value, key) => {
    user[key] = value
  })

  console.log(user)

  if (user._id && user.token) {
    localStorage.setItem("user", JSON.stringify(user))

    dispatch({ type: "LOGIN", payload: user })
    navigate("/")
  }

  return null
}

export default Callback
