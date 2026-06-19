import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, MessageCircle, CheckCircle2, XCircle, AlertTriangle,
  ThumbsUp, ThumbsDown, Send, Shield, Star, TrendingUp,
  Car, Calendar, Flag, ChevronRight
} from 'lucide-react'
import { formatDate, getInitials, generateColorFromString } from '@/lib/utils'
import toast from 'react-hot-toast'

const coOwners = [
  {
    id: '1',
    name: 'Rahul Sharma',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200',
    vehicle: 'Hyundai Creta',
    percentage: 25,
    trustScore: 94,
    ownershipScore: 820,
    totalBookings: 18,
    joinedAt: '2026-01-15',
    status: 'ACTIVE',
    lastSeen: '2 hours ago',
  },
  {
    id: '2',
    name: 'Priya Menon',
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?w=200',
    vehicle: 'Hyundai Creta',
    percentage: 25,
    trustScore: 88,
    ownershipScore: 760,
    totalBookings: 14,
    joinedAt: '2026-01-20',
    status: 'ACTIVE',
    lastSeen: '1 day ago',
  },
  {
    id: '3',
    name: 'Arjun Patel',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200',
    vehicle: 'Hyundai Creta',
    percentage: 25,
    trustScore: 91,
    ownershipScore: 790,
    totalBookings: 22,
    joinedAt: '2026-02-01',
    status: 'ACTIVE',
    lastSeen: '5 hours ago',
  },
  {
    id: '4',
    name: 'Kavitha Nair',
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?w=200',
    vehicle: 'Toyota Camry',
    percentage: 33,
    trustScore: 97,
    ownershipScore: 910,
    totalBookings: 28,
    joinedAt: '2026-03-10',
    status: 'ACTIVE',
    lastSeen: 'Just now',
  },
]

const chatMessages = [
  { id: '1', authorId: '1', authorName: 'Rahul Sharma', text: "Hey everyone! Anyone up for servicing the Creta this weekend?", timestamp: '2026-06-19T10:30:00', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200' },
  { id: '2', authorId: '2', authorName: 'Priya Menon', text: "Sure! I'm free Sunday afternoon. What time suits everyone?", timestamp: '2026-06-19T10:35:00', avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?w=200' },
  { id: '3', authorId: '3', authorName: 'Arjun Patel', text: "Sunday 2 PM works for me 👍 Let's book the Concorde service center.", timestamp: '2026-06-19T10:42:00', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=200' },
  { id: 'me', authorId: 'me', authorName: 'You', text: "Count me in! I'll create the service booking now.", timestamp: '2026-06-19T10:50:00', avatar: null },
]

const votes = [
  {
    id: '1',
    title: 'Annual Insurance Renewal - Hyundai Creta',
    description: 'Renew comprehensive insurance with HDFC Ergo for ₹18,000/year (₹4,500 per owner)',
    deadline: '2026-06-25',
    status: 'OPEN',
    votes: { yes: 2, no: 0, total: 4 },
    myVote: null as 'YES' | 'NO' | null,
  },
  {
    id: '2',
    title: 'New Tyre Replacement - All 4 Tyres',
    description: 'Replace all 4 tyres with MRF ZV3. Total cost ₹24,000 (₹6,000 per owner)',
    deadline: '2026-06-28',
    status: 'OPEN',
    votes: { yes: 3, no: 1, total: 4 },
    myVote: 'YES' as 'YES' | 'NO' | null,
  },
]

const disputes = [
  {
    id: '1',
    title: 'Booking Conflict on June 22',
    type: 'BOOKING_CONFLICT',
    raisedBy: 'Rahul Sharma',
    status: 'UNDER_REVIEW',
    date: '2026-06-17',
    description: 'Two owners accidentally booked the same slot.',
  },
]

export default function CoOwnersPage() {
  const [activeTab, setActiveTab] = useState<'owners' | 'chat' | 'votes' | 'disputes'>('owners')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chatMessages)
  const [activeVotes, setActiveVotes] = useState(votes)
  const [selectedOwner, setSelectedOwner] = useState<typeof coOwners[0] | null>(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [disputeText, setDisputeText] = useState('')

  const sendMessage = () => {
    if (!message.trim()) return
    const newMsg = {
      id: Date.now().toString(),
      authorId: 'me',
      authorName: 'You',
      text: message.trim(),
      timestamp: new Date().toISOString(),
      avatar: null,
    }
    setMessages((prev) => [...prev, newMsg])
    setMessage('')
  }

  const handleVote = (voteId: string, choice: 'YES' | 'NO') => {
    setActiveVotes((prev) =>
      prev.map((v) => {
        if (v.id !== voteId) return v
        const newVotes = { ...v.votes }
        if (v.myVote === choice) return v
        if (v.myVote === 'YES') newVotes.yes--
        if (v.myVote === 'NO') newVotes.no--
        if (choice === 'YES') newVotes.yes++
        else newVotes.no++
        return { ...v, votes: newVotes, myVote: choice }
      })
    )
    toast.success(`Vote recorded: ${choice}`)
  }

  const getVehicleOwners = (vehicle: string) => coOwners.filter((o) => o.vehicle === vehicle)
  const uniqueVehicles = [...new Set(coOwners.map((o) => o.vehicle))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-900">Co-Owners</h2>
        <p className="text-slate-500 text-sm mt-0.5">Collaborate with your vehicle co-owners</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {(['owners', 'chat', 'votes', 'disputes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-all whitespace-nowrap px-4 ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'owners' && <Users className="w-4 h-4 inline mr-1.5" />}
              {tab === 'chat' && <MessageCircle className="w-4 h-4 inline mr-1.5" />}
              {tab === 'votes' && <ThumbsUp className="w-4 h-4 inline mr-1.5" />}
              {tab === 'disputes' && <AlertTriangle className="w-4 h-4 inline mr-1.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'owners' && (
            <motion.div
              key="owners"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              {uniqueVehicles.map((vehicle) => (
                <div key={vehicle} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Car className="w-5 h-5 text-blue-600" />
                    <h3 className="font-display font-semibold text-slate-900">{vehicle}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getVehicleOwners(vehicle).map((owner) => (
                      <motion.button
                        key={owner.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedOwner(owner)}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 text-left transition-all w-full"
                      >
                        <div className="relative">
                          {owner.avatar ? (
                            <img
                              src={owner.avatar}
                              alt={owner.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ background: generateColorFromString(owner.name) }}
                            >
                              {getInitials(owner.name)}
                            </div>
                          )}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            owner.status === 'ACTIVE' ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm">{owner.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {owner.percentage}% · {owner.totalBookings} bookings
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-green-700">
                              <Shield className="w-3 h-3" />
                              {owner.trustScore}%
                            </span>
                            <span className="flex items-center gap-1 text-xs text-blue-700">
                              <Star className="w-3 h-3" />
                              {owner.ownershipScore}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
              style={{ height: 520 }}
            >
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {coOwners.slice(0, 3).map((o) => (
                      <img key={o.id} src={o.avatar} alt="" className="w-7 h-7 rounded-full ring-2 ring-white object-cover" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Hyundai Creta - Co-Owners</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">4 members</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.authorId === 'me'
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && (
                        msg.avatar ? (
                          <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: generateColorFromString(msg.authorName) }}
                          >
                            {getInitials(msg.authorName)}
                          </div>
                        )
                      )}
                      <div className={`max-w-sm ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        {!isMe && (
                          <span className="text-xs text-slate-500 font-medium ml-1">{msg.authorName}</span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-slate-800 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-slate-400 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="input-field flex-1 text-sm py-2.5"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'votes' && (
            <motion.div
              key="votes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-4"
            >
              <p className="text-sm text-slate-500">Vote on important decisions with your co-owners.</p>
              {activeVotes.map((vote) => {
                const yesPercent = (vote.votes.yes / vote.votes.total) * 100
                const noPercent = (vote.votes.no / vote.votes.total) * 100
                return (
                  <div key={vote.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{vote.title}</h4>
                        <p className="text-slate-500 text-xs mt-1">{vote.description}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                        Open
                      </span>
                    </div>

                    {/* Vote progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>👍 Yes: {vote.votes.yes}/{vote.votes.total}</span>
                        <span>👎 No: {vote.votes.no}/{vote.votes.total}</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                        <div
                          className="bg-green-500 transition-all duration-500"
                          style={{ width: `${yesPercent}%` }}
                        />
                        <div
                          className="bg-red-400 transition-all duration-500"
                          style={{ width: `${noPercent}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Deadline: {formatDate(vote.deadline)}</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(vote.id, 'YES')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          vote.myVote === 'YES'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-slate-700 hover:border-green-400 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Approve ({vote.votes.yes})
                      </button>
                      <button
                        onClick={() => handleVote(vote.id, 'NO')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          vote.myVote === 'NO'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-slate-700 hover:border-red-400 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        Reject ({vote.votes.no})
                      </button>
                    </div>
                  </div>
                )
              })}

              {activeVotes.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-slate-500">No pending votes</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div
              key="disputes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">Raise and track disputes with co-owners.</p>
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Raise Dispute
                </button>
              </div>

              <div className="space-y-3">
                {disputes.map((d) => (
                  <div key={d.id} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{d.title}</h4>
                        <p className="text-slate-500 text-xs mt-1">{d.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span>By {d.raisedBy}</span>
                          <span>·</span>
                          <span>{formatDate(d.date)}</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                        {d.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {disputes.length === 0 && (
                  <div className="text-center py-12">
                    <XCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-slate-500">No active disputes</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Owner Detail Modal */}
      <AnimatePresence>
        {selectedOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOwner(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <img
                  src={selectedOwner.avatar}
                  alt={selectedOwner.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 mx-auto mb-3"
                />
                <h3 className="font-display font-bold text-xl text-slate-900">{selectedOwner.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{selectedOwner.vehicle} · {selectedOwner.percentage}% owner</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-slate-400">Last seen: {selectedOwner.lastSeen}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Shield, label: 'Trust Score', value: `${selectedOwner.trustScore}%`, color: 'text-green-600' },
                  { icon: TrendingUp, label: 'Ownership Score', value: selectedOwner.ownershipScore.toString(), color: 'text-blue-600' },
                  { icon: Calendar, label: 'Total Bookings', value: selectedOwner.totalBookings.toString(), color: 'text-purple-600' },
                  { icon: Car, label: 'Since', value: formatDate(selectedOwner.joinedAt, 'MMM yyyy'), color: 'text-slate-600' },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                    <div className={`font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedOwner(null)} className="flex-1 btn-secondary text-sm">
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedOwner(null)
                    setActiveTab('chat')
                  }}
                  className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raise Dispute Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDisputeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">Raise a Dispute</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Dispute Type</label>
                  <select className="input-field">
                    <option>Booking Conflict</option>
                    <option>Damage Report</option>
                    <option>Payment Dispute</option>
                    <option>Maintenance Disagreement</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                  <input placeholder="Brief description of the dispute" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    value={disputeText}
                    onChange={(e) => setDisputeText(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDisputeModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
                <button
                  onClick={() => {
                    setShowDisputeModal(false)
                    toast.success('Dispute raised! The team will review it within 24 hours.')
                  }}
                  className="flex-1 btn-primary text-sm"
                >
                  Submit Dispute
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
