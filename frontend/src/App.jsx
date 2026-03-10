import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";


function App() {
  return (
    <div
      className="bg-[url(./src/assets/bgImage.svg)] h-screen bg-cover bg-center bg-no-repeat
    flex items-center justify-center
    "
    >

      <Routes>
     
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home - protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Profile - protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
