import React, { useState } from "react"
import { Heart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("https://18.219.56.224/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        navigate("/Dashboard")
      } else {
        alert(data.error || "Invalid email or password")
      }
    } catch (error) {
      alert("Error connecting to server")
    }
  };

  const handleAdminLogin = () => {
    if (selectedCenter === "Alcosta Senior Center" && adminPassword === "a3344156") {
      setShowAdminModal(false)
      navigate("/AdminDashboard")
    } else {
      alert("Invalid admin credentials")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex overflow-hidden">
        <div className="w-1/2 bg-gradient-to-br from-blue-600 to-[#7286D3] p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-[#FFF2F2] rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#7286D3]" />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">Side With Seniors</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
            <p className="text-white text-lg">
              Sign in to continue to your dashboard and explore new opportunities.
            </p>
          </div>
          <div className="mt-12 text-white text-sm opacity-70">
            &copy; {new Date().getFullYear()} Side With Seniors. All rights reserved.
          </div>
        </div>

        <div className="w-1/2 p-12 flex flex-col justify-center bg-[#FFF2F2]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#7286D3]">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-[#7286D3]">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-[#8EA7E9] rounded focus:outline-none focus:ring-2 focus:ring-[#7286D3] bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#7286D3]">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-[#8EA7E9] rounded focus:outline-none focus:ring-2 focus:ring-[#7286D3] bg-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#7286D3] text-white rounded hover:bg-[#8EA7E9] transition-colors font-semibold"
            >
              Sign In
            </button>
            <div className="text-center mt-4 text-[#7286D3] text-sm">
              Don't have an account?{" "}
              <Link to="/Register" className="font-semibold underline hover:text-[#8EA7E9]">
                Sign up today!
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-sm underline text-[#7286D3] hover:text-[#8EA7E9]"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-96 animate-fadeInUp">
            <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Center</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={selectedCenter}
                onChange={e => setSelectedCenter(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Alcosta Senior Center">Alcosta Senior Center</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
