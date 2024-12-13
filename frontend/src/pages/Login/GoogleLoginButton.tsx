const GoogleLoginButton: React.FC = () => {
	// const handleClick = async () => {
	// 	try {
	// 		const response = await fetch(
	// 			`${process.env.REACT_APP_BACKEND_URL}/api/auth/google/login`,
	// 			{
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 			}
	// 		)
	// 		const data = await response.json()
	// 		console.log(data)
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
	// }

	return (
		<a
			className="flex justify-start items-center gap-5 p-4 border border-gray-500 w-full rounded-full hover:bg-gray-100 duration-300 ease-out transition-all"
			href={`${process.env.REACT_APP_BACKEND_URL}/api/auth/google/login`}
		>
			<img src="/assets/images/login/google-logo.svg" alt="Google icon" />
			Google Login
		</a>
	)
}

export default GoogleLoginButton
