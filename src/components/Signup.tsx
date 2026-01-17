import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Registering...");

    try {
      const res = await fetch("https://18.219.56.224/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Registration successful!");
      } else {
        setMessage(data.error || "Server error");
      }
    } catch {
      setMessage("Network error, try again.");
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
            <h2 className="text-3xl font-bold text-white mb-4">Join Us!</h2>
            <p className="text-white text-lg">
              Create an account to get started with Side With Seniors and explore opportunities.
            </p>
          </div>
          <div className="mt-12 text-white text-sm opacity-70">
            &copy; {new Date().getFullYear()} Side With Seniors. All rights reserved.
          </div>
        </div>

        <div className="w-1/2 p-12 flex flex-col justify-center bg-[#FFF2F2]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#7286D3]">Register</h2>
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
              <div className="mt-2 text-xs text-[#7286D3]">
                {password.length < 8
                  ? "Password must be at least 8 characters."
                  : !/[A-Z]/.test(password)
                  ? "Password must include at least one uppercase letter."
                  : !/\d/.test(password)
                  ? "Password must include at least one number."
                  : "Password meets requirements!"}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#7286D3] text-white rounded hover:bg-[#8EA7E9] transition-colors font-semibold"
            >
              Register
            </button>
            <div className="text-center mt-4 text-[#7286D3] text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold underline cursor-pointer hover:text-[#8EA7E9]"
              >
                Log in here
              </Link>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-sm text-[#7286D3]">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Signup;
