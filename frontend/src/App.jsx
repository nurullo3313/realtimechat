import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {
  

  return (
    <div className="bg-[url(./src/assets/bgImage.svg)] h-screen bg-cover bg-center bg-no-repeat
    flex items-center justify-center
    ">

    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/profile" element={<Profile/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/register" element={<Register/>}/>

    </Routes>
    </div>
  )
}

export default App
