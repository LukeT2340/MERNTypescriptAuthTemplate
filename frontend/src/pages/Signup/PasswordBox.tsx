import { useState } from "react"

interface Props {
  password: string
  setPassword: (arg0: string) => void
  confirmPassword: string
  setConfirmPassword: (arg0: string) => void
}

const PasswordBox: React.FC<Props> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
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
            password.length > 0 || passwordFocused
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => {
            setPasswordFocused(false)
          }}
          onFocus={() => setPasswordFocused(true)}
        />
      </div>
      <div
        className={`relative p-4 border w-full rounded-full ${
          confirmPasswordFocused ? "border-blue-500" : "border-gray-200"
        } `}
      >
        <label
          htmlFor='password'
          className={`absolute pointer-events-none left-4 transition-all duration-200 bg-white p-1 ${
            confirmPassword.length > 0 || confirmPasswordFocused
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
          className='w-full bg-white border-none outline-none'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={(e) => {
            setConfirmPasswordFocused(false)
          }}
          onFocus={() => setConfirmPasswordFocused(true)}
        />
      </div>
    </>
  )
}
export default PasswordBox
