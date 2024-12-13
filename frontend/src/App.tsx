import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Callback from "./pages/Callback"

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<div className="w-screen h-screen flex justify-center items-center text-[200px]">
								<h1>You are logged in</h1>
							</div>
						}
					/>
					<Route path="/callback" element={<Callback />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Routes>
			</Router>
		</div>
	)
}

export default App
