import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PRODUCT_NAME } from "../../global-variables"
import EmailBox from "./EmailBox"
import LoadingIndicator from "../../shared-components/LoadingIndicator"
import PasswordBox from "./PasswordBox"
import { validPassword } from "./utilities"
import { useAuthContext } from "../../contexts/AuthContext"

const Signup: React.FC = () => {
	const { dispatch } = useAuthContext()
	const [currentPage, setCurrentPage] = useState<"email" | "password">("email")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
	const navigate = useNavigate()

	useEffect(() => {
		document.title = `Sign Up - ${PRODUCT_NAME}`
	}, [])

	const saveToBrowserStorage = (user: Object) => {
		localStorage.setItem("user", JSON.stringify(user))
		dispatch({ type: "LOGIN", payload: user })
	}

	const handleEmailSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		try {
			setError("")
			setLoading(true)
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/auth/email/check-email`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				}
			)
			if (!response.ok) {
				const errorData = await response.json()
				setError(errorData.message)
				return
			}

			setCurrentPage("password")
		} catch (error) {
			setError("Error whilst signing up. Please try again later.")
		} finally {
			setLoading(false)
		}
	}

	const handlePasswordSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()
		setError("")
		if (password !== confirmPassword) {
			setError("Passwords don't match")
			return
		}

		if (!validPassword(password)) {
			setError(
				"Password must be a minimum of eight characters, containing at least one uppercase letter, one lowercase letter and one number"
			)
			return
		}

		try {
			setLoading(true)
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/auth/email/sign-up`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			)

			if (!response.ok) {
				const errorData = await response.json()
				setError(errorData.message)
				return
			}

			const data = await response.json()
			saveToBrowserStorage(data.user)
			navigate("/")
		} catch (error) {
			setError("Error whilst signing up. Please try again later.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="relative w-screen h-screen">
			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
					<LoadingIndicator />
				</div>
			)}

			{/* Disable interactivity when loading */}
			<div
				className={`flex items-start justify-center pt-[20vh] w-full h-full ${
					loading ? "pointer-events-none" : ""
				}`}
			>
				<form
					className="w-[340px] z-10 flex flex-col items-center gap-3"
					onSubmit={
						currentPage === "email" ? handleEmailSubmit : handlePasswordSubmit
					}
				>
					<h3 className="text-[32px] leading-[43px] font-medium">
						Create an account
					</h3>
					{currentPage === "email" && (
						<EmailBox setEmail={setEmail} email={email} />
					)}
					{currentPage === "password" && (
						<>
							<h6>{email}</h6>
							<PasswordBox
								password={password}
								confirmPassword={confirmPassword}
								setPassword={setPassword}
								setConfirmPassword={setConfirmPassword}
							/>
						</>
					)}

					<span className="text-[14px] text-red-600 min-h-[20px]">{error}</span>

					{/* Login link */}
					<span className="w-fit mx-auto text-[16px] leading-[24px]">
						Already have an account?{" "}
						<a href="/login" className="text-blue-600">
							Login
						</a>
					</span>

					<button
						type="submit"
						className={`w-full p-3 rounded-full border duration-300 ease-out transition-all bg-black ${
							email.trim().length === 0 ? "opacity-60" : "opacity-100"
						} text-white border-black`}
						disabled={email.trim().length === 0}
					>
						Continue
					</button>
				</form>
			</div>
		</section>
	)
}

export default Signup
