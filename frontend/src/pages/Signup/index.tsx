import { useEffect, useState } from "react"
import { PRODUCT_NAME } from "../../global-variables"
import EmailBox from "./EmailBox"
import { useFormik } from "formik"
import * as Yup from "yup"
import PasswordBox from "./PasswordBox"

const Signup: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"email" | "password">("email")

  useEffect(() => {
    document.title = `Sign Up - ${PRODUCT_NAME}`
  }, [])

  const nextSlide = () => {
    setCurrentPage("password")
  }

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
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must include: uppercase, lowercase, number, and special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {},
  })

  return (
    <section className='flex items-start justify-center pt-[20vh] h-screen w-screen'>
      <form
        onSubmit={formik.handleSubmit}
        className='w-[340px] z-10 flex flex-col items-center gap-3'
      >
        <h3 className='text-[32px] leading-[43px] font-medium mb-3'>
          Create an account
        </h3>
        {currentPage === "email" && <EmailBox formik={formik} />}
        {currentPage === "password" && <PasswordBox formik={formik} />}

        {/* Continue Button */}
        <button
          onClick={() => nextSlide()}
          className={`w-full p-3 rounded-full border duration-300 ease-out transition-all bg-black text-white border-black ${
            formik.values.email.length === 0
              ? "opacity-80 cursor-not-allowed"
              : " hover:opacity-80"
          }`}
          disabled={formik.values.email.length === 0}
        >
          Continue
        </button>
        {/* Login link */}
        <span className='w-fit mx-auto text-[16px] leading-[24px]'>
          Already have an account?{" "}
          <a href='/login' className='text-blue-600'>
            Login
          </a>
        </span>
      </form>
    </section>
  )
}

export default Signup
