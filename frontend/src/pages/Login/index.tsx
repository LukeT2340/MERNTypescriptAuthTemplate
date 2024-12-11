import React, { useEffect, useState } from "react"
import GoogleLoginButton from "../../shared-components/auth/GoogleLoginButton"
import EmailLoginForm from "../../shared-components/auth/EmailLoginForm"
import OrDivider from "../../shared-components/auth/OrDivider"
import { PRODUCT_NAME } from "../../global-variables"
import LoadingIndicator from "../../shared-components/LoadingIndicator"

const Login: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		document.title = `Login - ${PRODUCT_NAME}`
	}, [])

	return (
		<section className="flex items-start justify-center pt-[20vh] h-screen w-screen relative">
			{loading && (
				<div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
					<LoadingIndicator />
				</div>
			)}
			<div className="flex flex-col items-center w-[340px] z-10">
				<h3 className="text-[32px] leading-[43px] font-medium mb-3">
					Welcome back
				</h3>
				<EmailLoginForm setLoading={setLoading} />
				<OrDivider />
				<GoogleLoginButton />
			</div>
		</section>
	)
}

export default Login
