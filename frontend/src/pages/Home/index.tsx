const Home: React.FC = () => {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center text-[100px]'>
      <h1>You are logged in</h1>
      <a href={`${process.env.REACT_APP_BACKEND_URL}/api/auth/secure/test`}>
        Test button
      </a>
    </div>
  )
}

export default Home