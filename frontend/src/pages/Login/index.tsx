import React from "react"
import GoogleLoginButton from "../../shared-components/auth/GoogleLoginButton"
import EmailLoginForm from "../../shared-components/auth/EmailLoginForm"
import OrDivider from "../../shared-components/auth/OrDivider"

const Login: React.FC = () => {
  return (
    <section className='flex items-start justify-center pt-[20vh] h-screen w-screen'>
      <div className='flex flex-col items-center w-[340px] z-10'>
        <h3 className='text-[32px] leading-[43px] font-medium mb-9'>
          Welcome back
        </h3>
        <EmailLoginForm />
        <OrDivider />
        <GoogleLoginButton />
      </div>
    </section>
  )
}

export default Login
