import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuthContext } from "../../contexts/AuthContext"

interface Props {
  setLoading: (arg0: boolean) => void
}

const EmailLoginForm: React.FC<Props> = ({ setLoading }) => {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()

  const [emailFocused, setEmailFocused] = useState<boolean>(false)
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const saveToBrowserStorage = (user: Object) => {
    localStorage.setItem("user", JSON.stringify(user))
    dispatch({ type: "LOGIN", payload: user })
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string(),
      password: Yup.string(),
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/email/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
            credentials: "include",
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          setError(
            errorData.message ||
              "An error occured when logging in. Please try again later"
          )
          return
        }

        const data = await response.json()
        saveToBrowserStorage(data.user)
        navigate("/")
      } catch (error) {
        setError("Error whilst logging in. Please try again later.")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='flex flex-col items-stretch w-full gap-4'
    >
      {/* Email Field */}
      <div
        className={`relative p-4 border w-full rounded-full ${
          emailFocused ? "border-blue-500" : "border-gray-200"
        } `}
      >
        <label
          htmlFor='email'
          className={`absolute pointer-events-none left-4 transition-all duration-200 bg-white p-1 ${
            formik.values.email.length > 0 || emailFocused
              ? "-top-3 text-xs"
              : "top-1/2 -translate-y-1/2"
          } ${emailFocused ? "text-blue-500" : "text-gray-400"}`}
        >
          Email Address
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className='w-full bg-white border-none outline-none'
          value={formik.values.email}
          onChange={(e) => {
            formik.handleChange(e)
            setError(null)
          }}
          onBlur={(e) => {
            formik.handleBlur(e)
            setEmailFocused(false)
          }}
          onFocus={() => setEmailFocused(true)}
        />
      </div>

      {/* Password Field */}
      <div
        className={`relative p-4 border w-full rounded-full ${
          passwordFocused ? "border-blue-500" : "border-gray-200"
        } `}
      >
        <label
          htmlFor='password'
          className={`absolute pointer-events-none left-4 transition-all duration-200 bg-white p-1 ${
            formik.values.password.length > 0 || passwordFocused
              ? "-top-3 text-xs"
              : "top-1/2 -translate-y-1/2"
          } ${passwordFocused ? "text-blue-500" : "text-gray-400"}`}
        >
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          className='w-full bg-white border-none outline-none'
          value={formik.values.password}
          onChange={(e) => {
            formik.handleChange(e)
            setError(null)
          }}
          onBlur={(e) => {
            formik.handleBlur(e)
            setPasswordFocused(false)
          }}
          onFocus={() => setPasswordFocused(true)}
        />
      </div>
      <span className='text-[14px] text-red-600 min-h-[20px] w-fit mx-auto'>
        {error}
      </span>

      {/* Submit Button */}
      <button
        type='submit'
        className={`w-full p-3 rounded-full border duration-300 ease-out transition-all bg-black text-white border-black ${
          formik.values.email.length === 0 || formik.values.password.length < 8
            ? "opacity-80 cursor-not-allowed"
            : " hover:opacity-80"
        }`}
        disabled={
          formik.values.email.length === 0 || formik.values.password.length < 8
        }
      >
        Login
      </button>

      {/* Sign up link */}
      <span className='w-fit mx-auto text-[16px] leading-[24px]'>
        Don't have an account?{" "}
        <a href='/signup' className='text-blue-600'>
          Sign up
        </a>
      </span>
    </form>
  )
}

export default EmailLoginForm
