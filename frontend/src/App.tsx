import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Callback from "./pages/Callback"
import Signup from "./pages/Signup"

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/callback' element={<Callback />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
