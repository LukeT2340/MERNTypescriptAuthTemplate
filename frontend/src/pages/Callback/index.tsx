import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../contexts/AuthContext"
import { useLocation } from "react-router-dom"

const Callback: React.FC = () => {
	const { dispatch } = useAuthContext()
	const navigate = useNavigate()
	const location = useLocation()

	const saveToBrowserStorage = (user: Object) => {
		localStorage.setItem("user", JSON.stringify(user))
		dispatch({ type: "LOGIN", payload: user })
	}

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const user = queryParams.get("user")

		if (user) {
			const parsedUser = JSON.parse(decodeURIComponent(user))
			console.log("Authenticated User:", parsedUser)
			saveToBrowserStorage(parsedUser)
			navigate("/")
		}
	}, [])

	return <>Loading...</>
}

export default Callback
