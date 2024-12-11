import { useEffect, useState } from "react"
import { PRODUCT_NAME } from "../../global-variables"
import EmailBox from "./EmailBox"
import LoadingIndicator from "../../shared-components/LoadingIndicator"

const Signup: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<"email" | "password">("email")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		document.title = `Sign Up - ${PRODUCT_NAME}`
	}, [])

	const handleSubmit = async (e: { preventDefault: () => void }) => {
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
				setError(
					errorData.message || "An error occurred. Please try again later."
				)
			}

			const data = await response.json()
		} catch (error) {
			setError("Error whilst signing up. Please try again later.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="h-screen w-screen relative">
			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
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
					onSubmit={handleSubmit}
				>
					<h3 className="text-[32px] leading-[43px] font-medium mb-3">
						Create an account
					</h3>

					{currentPage === "email" && (
						<EmailBox setEmail={setEmail} email={email} />
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
