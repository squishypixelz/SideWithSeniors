import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Signup {
  email: string
}

interface Opportunity {
  _id: string
  title: string
  description: string
  category: string
  location: string
  time: string
  slots: number
  signups?: Signup[]
}

function DashboardContent() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [emailInput, setEmailInput] = useState("")

  useEffect(() => {
    fetch("https://18.219.56.224/api/opportunities")
      .then(res => res.json())
      .then(data => setOpportunities(data.opportunities || []))
      .catch(err => console.error(err))
  }, [])

  const handleSignup = async (id: string, email: string) => {
    try {
      const response = await fetch(`https://18.219.56.224/api/opportunities/${id}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (data.success) {
        alert("Signed up successfully!")
        // refresh opportunities to show updated signups
        setOpportunities(opps =>
          opps.map(op => op._id === id ? { ...op, signups: [...(op.signups || []), { email }] } : op)
        )
        setSelectedOpportunity(null)
      } else alert(data.error || "Failed to sign up")
    } catch (error) {
      alert("Error connecting to server")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-10">
          Explore Volunteering Opportunities
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map(op => (
            <motion.div
              key={op._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition min-h-[250px]"
              onClick={() => setSelectedOpportunity(op)}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{op.title}</h2>
              <p className="text-gray-700 mb-2">Category: {op.category}</p>
              <p className="text-gray-700 mb-2">Location: {op.location}</p>
              <p className="text-gray-700">Time: {op.time}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedOpportunity && (
            <>
              <motion.div
                className="fixed inset-0 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOpportunity(null)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedOpportunity.title}</h3>
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Description:</span> {selectedOpportunity.description}</p>
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Category:</span> {selectedOpportunity.category}</p>
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Location:</span> {selectedOpportunity.location}</p>
                  <p className="text-gray-700 mb-2"><span className="font-semibold">Time:</span> {selectedOpportunity.time}</p>
                  <p className="text-gray-700 mb-4"><span className="font-semibold">Participants Needed:</span> {selectedOpportunity.slots}</p>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Your Email:</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  {selectedOpportunity.signups && selectedOpportunity.signups.length > 0 && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-1">Signed Up Users:</p>
                      {selectedOpportunity.signups.map((s, i) => (
                        <p key={i} className="text-gray-600 text-sm">{s.email}</p>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setSelectedOpportunity(null)}
                      className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleSignup(selectedOpportunity._id, emailInput)}
                      className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DashboardContent
