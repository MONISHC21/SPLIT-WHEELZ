import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Send, MessageSquare, Vote, AlertTriangle, Car, Users,
  MoreVertical, Settings, ChevronDown,
} from 'lucide-react'
import { ownershipApi, disputeApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/ui/avatar'
import { formatRelativeTime, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ChatMessage } from '@/types'

export default function CoOwnersPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'owners' | 'votes' | 'disputes'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ['co-owner-chat', vehicleId],
    queryFn: async () => {
      const { data } = await ownershipApi.getChat(vehicleId!)
      return data.data as { roomId: string; messages: ChatMessage[] }
    },
    refetchInterval: 5000,
    enabled: !!vehicleId,
  })

  const { data: ownershipData } = useQuery({
    queryKey: ['ownership', vehicleId],
    queryFn: async () => {
      const { data } = await ownershipApi.getDetails(vehicleId!)
      return data.data
    },
    enabled: !!vehicleId,
  })

  const sendMessage = useMutation({
    mutationFn: (text: string) => ownershipApi.sendMessage(vehicleId!, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['co-owner-chat', vehicleId] })
      setMessage('')
    },
    onError: () => toast.error('Failed to send message'),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatData?.messages])

  const handleSend = () => {
    if (!message.trim()) return
    sendMessage.mutate(message.trim())
  }

  const messages = chatData?.messages || []

  return (
    <div className="p-6 lg:p-8 space-y-6 h-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy">Co-Owners</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Car className="w-4 h-4" />
              {ownershipData?.vehicle?.make} {ownershipData?.vehicle?.model}
            </p>
          </div>
          <Badge variant="success" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {ownershipData?.ownerships?.filter((o: { status: string }) => o.status === 'ACTIVE').length || 0} Active
          </Badge>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {[
            { id: 'chat', label: 'Group Chat', icon: MessageSquare },
            { id: 'owners', label: 'Owners', icon: Users },
            { id: 'votes', label: 'Votes', icon: Vote },
            { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="border-b border-slate-100 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  {ownershipData?.vehicle?.make} {ownershipData?.vehicle?.model} Group
                </CardTitle>
                <span className="text-xs text-slate-500">Auto-refreshes every 5s</span>
              </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !messages.length ? (
                <div className="text-center text-slate-400 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.userId === user?.id
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <UserAvatar
                        src={msg.user?.avatar}
                        name={msg.user?.name || 'User'}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div className={`max-w-xs lg:max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        {!isMe && (
                          <span className="text-xs text-slate-500 font-medium">{msg.user?.name}</span>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-tr-sm'
                            : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  loading={sendMessage.isPending}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Owners Tab */}
      {activeTab === 'owners' && (
        <div className="space-y-4">
          {ownershipData?.ownerships?.map((ownership: {
            id: string
            user: { id: string; name: string; avatar: string | null; email: string; kycVerified: boolean }
            slotNumber: number
            ownershipShare: number
            weeklyHours: number
            status: string
            isAdmin: boolean
            usageThisMonth: number
            pendingCharges: number
          }) => (
            <Card key={ownership.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <UserAvatar src={ownership.user.avatar} name={ownership.user.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-navy">{ownership.user.name}</h3>
                      {ownership.isAdmin && <Badge variant="navy" className="text-xs">Admin</Badge>}
                      {ownership.user.kycVerified && <Badge variant="success" className="text-xs">✓ KYC</Badge>}
                      {ownership.user.id === user?.id && <Badge variant="info" className="text-xs">You</Badge>}
                    </div>
                    <p className="text-slate-500 text-sm">{ownership.user.email}</p>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span>Slot {ownership.slotNumber}</span>
                      <span>{ownership.ownershipShare}% share</span>
                      <span>{ownership.weeklyHours}h/week</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={ownership.status === 'ACTIVE' ? 'success' : 'warning'}>
                      {ownership.status}
                    </Badge>
                    {ownership.pendingCharges > 0 && (
                      <p className="text-red-500 text-xs mt-1">
                        ₹{ownership.pendingCharges} due
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Votes Tab */}
      {activeTab === 'votes' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Vote className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No active votes. Create one for group decisions.</p>
              <Button size="sm">
                Create Vote
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No open disputes. Things are going well!</p>
              <Button variant="outline" size="sm">
                File a Dispute
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
