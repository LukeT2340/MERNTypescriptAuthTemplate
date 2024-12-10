import { FormikProps } from "formik"
import { useState } from "react"

const EmailBox: React.FC<{
  formik: FormikProps<{ email: string; password: string }>
}> = ({ formik }) => {
  const [emailFocused, setEmailFocused] = useState<boolean>(false)

  return (
    <>
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
    </>
  )
}
export default EmailBox
