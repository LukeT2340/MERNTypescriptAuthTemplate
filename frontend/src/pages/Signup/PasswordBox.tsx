import { FormikProps } from "formik"
import { useState } from "react"

const PasswordBox: React.FC<{
  formik: FormikProps<{ email: string; password: string }>
}> = ({ formik }) => {
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] =
    useState<boolean>(false)

  return (
    <>
      {/* password Field */}
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
          onChange={() => formik.handleChange}
          onBlur={(e) => {
            formik.handleBlur(e)
            setPasswordFocused(false)
          }}
          onFocus={() => setPasswordFocused(true)}
        />
      </div>
      <div
        className={`relative p-4 border w-full rounded-full ${
          passwordFocused ? "border-blue-500" : "border-gray-200"
        } `}
      >
        <label
          htmlFor='password'
          className={`absolute pointer-events-none left-4 transition-all duration-200 bg-white p-1 ${
            formik.values.password.length > 0 || confirmPasswordFocused
              ? "-top-3 text-xs"
              : "top-1/2 -translate-y-1/2"
          } ${confirmPasswordFocused ? "text-blue-500" : "text-gray-400"}`}
        >
          Confirm password
        </label>
        <input
          id='confirm-password'
          name='confirmPassword'
          type='password'
          className='w-full border-none outline-none bg-white'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={(e) => {
            formik.handleBlur(e)
            setConfirmPasswordFocused(false)
          }}
          onFocus={() => setConfirmPasswordFocused(true)}
        />
      </div>
    </>
  )
}
export default PasswordBox
