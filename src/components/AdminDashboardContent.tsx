import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function AdminDashboardContent() {
  const [showModal, setShowModal] = useState(false)
  const [showSignups, setShowSignups] = useState(false)
  const [opportunitiesList, setOpportunitiesList] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [time, setTime] = useState("")
  const [slots, setSlots] = useState<number | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Number(slots) < 2 || Number(slots) > 5) {
      alert("Number of participants must be between 2 and 5")
      return
    }

    try {
      const response = await fetch("https://18.219.56.224/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, location, time, slots })
      })
      const data = await response.json()
      if (data.success) {
        alert("Opportunity created!")
        setShowModal(false)
        setTitle("")
        setDescription("")
        setCategory("")
        setLocation("")
        setTime("")
        setSlots("")
      } else {
        alert(data.error || "Failed to create opportunity")
      }
    } catch (error) {
      alert("Error connecting to server")
    }
  }

  const handleViewSignups = async () => {
    try {
      const response = await fetch("https://18.219.56.224/api/opportunities")
      const data = await response.json()
      if (data.success) {
        setOpportunitiesList(data.opportunities)
        setShowSignups(true)
      } else {
        alert("Failed to fetch opportunities")
      }
    } catch (error) {
      alert("Error connecting to server")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <h2 className="text-5xl font-extrabold text-gray-800 text-center">
          Make An Impact,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Together
          </span>
        </h2>

        <div className="flex justify-center space-x-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Create New Opportunity
          </button>
          <button
            onClick={handleViewSignups}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-700 transition"
          >
            View Signups
          </button>
        </div>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Volunteering Opportunity</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} required />
                    <input type="text" placeholder="Category (e.g. Singing, Dancing, Gardening)" value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" placeholder="Time (e.g. 10:00 AM - 12:00 PM)" value={time} onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    <input type="number" placeholder="Number of Participants Needed (2-5)" value={slots} onChange={e => setSlots(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" min={2} max={5} required />
                    <div className="flex justify-end space-x-3 mt-4">
                      <button type="button" onClick={() => setShowModal(false)}
                        className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
                      <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Create</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}

          {showSignups && (
            <>
              <motion.div className="fixed inset-0 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowSignups(false)} />
              <motion.div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto p-4"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                <div className="bg-white w-full max-w-3xl p-8 rounded-3xl shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Opportunities & Signups</h3>
                  <div className="space-y-4">
                    {opportunitiesList.map(op => (
                      <div key={op._id} className="border rounded-xl p-4">
                        <h4 className="font-bold text-lg">{op.title}</h4>
                        <p className="text-gray-600 mb-1">Category: {op.category}</p>
                        <p className="text-gray-600 mb-1">Location: {op.location}</p>
                        <p className="text-gray-600 mb-1">Time: {op.time}</p>
                        <p className="text-gray-600 font-semibold">Participants:</p>
                        <ul className="list-disc list-inside text-gray-700">
                          {op.participants.length > 0 ? op.participants.map((p: any, i: number) => <li key={i}>{p}</li>) : <li>No signups yet</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={() => setShowSignups(false)}
                      className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition">Close</button>
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

export default AdminDashboardContent
