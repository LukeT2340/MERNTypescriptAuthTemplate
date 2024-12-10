import React, { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

const EmailLoginForm: React.FC = () => {
  const [emailFocused, setEmailFocused] = useState<boolean>(false)
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false)

  // Formik logic
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted", values)
    },
  })

  const isPasswordLabelActive =
    passwordFocused || formik.values.password.length > 0

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='w-full flex flex-col items-stretch gap-4'
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
          className='w-full border-none outline-none bg-white'
          value={formik.values.email}
          onChange={formik.handleChange}
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
          className='w-full border-none outline-none bg-white'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={(e) => {
            formik.handleBlur(e)
            setPasswordFocused(false)
          }}
          onFocus={() => setPasswordFocused(true)}
        />
      </div>

      {/* Submit Button */}
      <button
        type='submit'
        className={`w-full p-3 rounded-full border duration-300 ease-out transition-all bg-black text-white border-black ${
          formik.values.email.length === 0 ||
          formik.values.password.length === 0
            ? "opacity-80 cursor-not-allowed"
            : " hover:opacity-80"
        }`}
        disabled={
          formik.values.email.length === 0 ||
          formik.values.password.length === 0
        }
      >
        Login
      </button>

      {/* Sign up link */}
      <span className='w-fit mx-auto text-[16px] leading-[24px]'>
        Don't have an account?{" "}
        <a href='/sign-up' className='text-blue-600'>
          Sign up
        </a>
      </span>
    </form>
  )
}

export default EmailLoginForm
