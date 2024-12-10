import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Callback from "./pages/Callback"

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/callback' element={<Callback />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
