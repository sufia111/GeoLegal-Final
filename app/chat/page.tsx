'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Scale, Plus, ChevronLeft, ChevronRight, Trash2, Bookmark,
  BookmarkCheck, SendHorizonal, LogOut, MessageSquare, ChevronDown,
  Mic, MicOff, Globe, Radio, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

// ── Types ──────────────────────────────────────────────────────────────────

interface Chat {
  id: number
  title: string
  created_at: string
  updated_at: string
}

interface Message {
  id: number
  chat_id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
  source?: 'voice' | 'text'  // client-only tag for rendering
}

type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error'

// ── Indian languages ───────────────────────────────────────────────────────

const INDIAN_LANGUAGES = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'hi',       label: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish' },
  { code: 'bn',       label: 'বাংলা' },
  { code: 'benglish', label: 'Benglish' },
  { code: 'te',       label: 'తెలుగు' },
  { code: 'mr',       label: 'मराठी' },
  { code: 'ta',       label: 'தமிழ்' },
  { code: 'tanglish', label: 'Tanglish' },
  { code: 'gu',       label: 'ગુજરાતી' },
  { code: 'ur',       label: 'اردو' },
  { code: 'kn',       label: 'ಕನ್ನಡ' },
  { code: 'or',       label: 'ଓଡ଼ିଆ' },
  { code: 'ml',       label: 'മലയാളം' },
  { code: 'manglish', label: 'Manglish' },
  { code: 'pa',       label: 'ਪੰਜਾਬੀ' },
  { code: 'punglish', label: 'Punglish' },
  { code: 'as',       label: 'অসমীয়া' },
  { code: 'mai',      label: 'मैथिली' },
  { code: 'ks',       label: 'कॉशुर' },
  { code: 'ne',       label: 'नेपाली' },
  { code: 'sd',       label: 'سنڌي' },
  { code: 'kok',      label: 'कोंकणी' },
  { code: 'doi',      label: 'डोगरी' },
  { code: 'mni',      label: 'মৈতৈলোন্' },
  { code: 'brx',      label: 'बड़ो' },
  { code: 'sa',       label: 'संस्कृतम्' },
  { code: 'en',       label: 'English' },
]

const LANG_HINTS: Record<string, string> = {
  hi:       '[Respond in Hindi / हिन्दी में जवाब दें]',
  hinglish: '[Respond in Hinglish — mix Hindi and English naturally]',
  bn:       '[Respond in Bengali / বাংলায় উত্তর দিন]',
  benglish: '[Respond in Benglish — mix Bengali and English naturally]',
  te:       '[Respond in Telugu / తెలుగులో సమాధానం ఇవ్వండి]',
  mr:       '[Respond in Marathi / मराठीत उत्तर द्या]',
  ta:       '[Respond in Tamil / தமிழில் பதிலளிக்கவும்]',
  tanglish: '[Respond in Tanglish — mix Tamil and English naturally]',
  gu:       '[Respond in Gujarati / ગુજરાતીમાં જવાબ આપો]',
  ur:       '[Respond in Urdu / اردو میں جواب دیں]',
  kn:       '[Respond in Kannada / ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ]',
  or:       '[Respond in Odia / ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅ]',
  ml:       '[Respond in Malayalam / മലയാളത്തിൽ മറുപടി നൽകുക]',
  manglish: '[Respond in Manglish — mix Malayalam and English naturally]',
  pa:       '[Respond in Punjabi / ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ]',
  punglish: '[Respond in Punglish — mix Punjabi and English naturally]',
  as:       '[Respond in Assamese / অসমীয়াত উত্তৰ দিয়ক]',
  mai:      '[Respond in Maithili / मैथिली में जवाब दें]',
  ks:       '[Respond in Kashmiri]',
  ne:       '[Respond in Nepali / नेपालीमा जवाफ दिनुहोस्]',
  sd:       '[Respond in Sindhi]',
  kok:      '[Respond in Konkani]',
  doi:      '[Respond in Dogri]',
  mni:      '[Respond in Manipuri]',
  brx:      '[Respond in Bodo]',
  sa:       '[Respond in Sanskrit]',
  en:       '[Respond in English]',
  auto:     '',
}

// ── Indian states & UTs ────────────────────────────────────────────────────

const INDIAN_STATES = [
  { code: 'all',  label: 'All India (Central Law)' },
  // States
  { code: 'AP',   label: 'Andhra Pradesh' },
  { code: 'AR',   label: 'Arunachal Pradesh' },
  { code: 'AS',   label: 'Assam' },
  { code: 'BR',   label: 'Bihar' },
  { code: 'CG',   label: 'Chhattisgarh' },
  { code: 'GA',   label: 'Goa' },
  { code: 'GJ',   label: 'Gujarat' },
  { code: 'HR',   label: 'Haryana' },
  { code: 'HP',   label: 'Himachal Pradesh' },
  { code: 'JH',   label: 'Jharkhand' },
  { code: 'KA',   label: 'Karnataka' },
  { code: 'KL',   label: 'Kerala' },
  { code: 'MP',   label: 'Madhya Pradesh' },
  { code: 'MH',   label: 'Maharashtra' },
  { code: 'MN',   label: 'Manipur' },
  { code: 'ML',   label: 'Meghalaya' },
  { code: 'MZ',   label: 'Mizoram' },
  { code: 'NL',   label: 'Nagaland' },
  { code: 'OD',   label: 'Odisha' },
  { code: 'PB',   label: 'Punjab' },
  { code: 'RJ',   label: 'Rajasthan' },
  { code: 'SK',   label: 'Sikkim' },
  { code: 'TN',   label: 'Tamil Nadu' },
  { code: 'TS',   label: 'Telangana' },
  { code: 'TR',   label: 'Tripura' },
  { code: 'UP',   label: 'Uttar Pradesh' },
  { code: 'UK',   label: 'Uttarakhand' },
  { code: 'WB',   label: 'West Bengal' },
  // Union Territories
  { code: 'AN',   label: 'Andaman & Nicobar Islands' },
  { code: 'CH',   label: 'Chandigarh' },
  { code: 'DN',   label: 'Dadra & Nagar Haveli and D&D' },
  { code: 'DL',   label: 'Delhi (NCT)' },
  { code: 'JK',   label: 'Jammu & Kashmir' },
  { code: 'LA',   label: 'Ladakh' },
  { code: 'LD',   label: 'Lakshadweep' },
  { code: 'PY',   label: 'Puducherry' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function genTempId() {
  return -(Date.now() + Math.random() * 1000)
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user, token, isLoading, logout } = useAuth()
  const router = useRouter()

  // UI
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const [chats, setChats]               = useState<Chat[]>([])
  const [savedChats, setSavedChats]     = useState<Chat[]>([])
  const [savedOpen, setSavedOpen]       = useState(false)
  const [currentChat, setCurrentChat]   = useState<Chat | null>(null)
  const [messages, setMessages]         = useState<Message[]>([])
  const [input, setInput]               = useState('')
  const [sending, setSending]           = useState(false)
  const [loadingChat, setLoadingChat]   = useState(false)
  const [savedChatIds, setSavedChatIds] = useState<Set<number>>(new Set())
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming]   = useState(false)
  const [langPickerOpen, setLangPickerOpen]   = useState(false)
  const [selectedLang, setSelectedLang]       = useState('auto')
  const [statePickerOpen, setStatePickerOpen] = useState(false)
  const [selectedState, setSelectedState]     = useState('all')

  // Voice
  const [voiceState, setVoiceState]     = useState<VoiceState>('idle')
  const [voiceMuted, setVoiceMuted]     = useState(false)
  const [voiceActive, setVoiceActive]   = useState(false)

  // Refs — stable across re-renders, safe to use inside callbacks
  const messagesEndRef    = useRef<HTMLDivElement>(null)
  const textareaRef       = useRef<HTMLTextAreaElement>(null)
  const pcRef             = useRef<RTCPeerConnection | null>(null)
  const dcRef             = useRef<RTCDataChannel | null>(null)
  const audioElRef        = useRef<HTMLAudioElement | null>(null)
  const localStreamRef    = useRef<MediaStream | null>(null)
  // Stable mutable refs so voice callbacks always see latest values
  const currentChatRef    = useRef<Chat | null>(null)
  const tokenRef          = useRef<string | null>(null)
  const sendingRef        = useRef(false)
  // Accumulate voice AI transcript across deltas
  const voiceAiDraftRef   = useRef('')
  const voiceAiTempId     = useRef<number>(0)

  // Keep refs in sync
  useEffect(() => { currentChatRef.current = currentChat }, [currentChat])
  useEffect(() => { tokenRef.current = token },             [token])
  useEffect(() => { sendingRef.current = sending },         [sending])

  // ── Auth redirect ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoading && !user) router.replace('/')
  }, [isLoading, user, router])

  // ── Helpers ────────────────────────────────────────────────────────────

  const authHeaders = useCallback(
    () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }),
    [token]
  )

  const authHeadersFromRef = useCallback(
    () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${tokenRef.current}` }),
    []
  )

  // ── Load sidebar data ──────────────────────────────────────────────────

  const loadChats = useCallback(async () => {
    if (!token) return
    const [chatsRes, savedRes] = await Promise.all([
      fetch('/api/chats',       { headers: authHeaders() }),
      fetch('/api/saved-chats', { headers: authHeaders() }),
    ])
    if (chatsRes.ok) {
      const data = await chatsRes.json()
      setChats(data.chats)
    }
    if (savedRes.ok) {
      const data = await savedRes.json()
      setSavedChats(data.savedChats)
      setSavedChatIds(new Set(data.savedChats.map((s: Chat) => s.id)))
    }
  }, [token, authHeaders])

  useEffect(() => { if (token) loadChats() }, [token, loadChats])

  // ── Scroll to bottom ───────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  // ── Textarea auto-resize ───────────────────────────────────────────────

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  // ── Cleanup voice on unmount ───────────────────────────────────────────

  useEffect(() => () => { stopVoiceCore() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save chat when switching away ────────────────────────────────

  const autoSaveChatIfNeeded = useCallback(
    async (chat: Chat) => {
      setSavedChatIds((prev) => {
        if (prev.has(chat.id)) return prev
        // fire-and-forget
        fetch('/api/saved-chats', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ chatId: chat.id }),
        }).then(async (res) => {
          if (res.ok) {
            setSavedChats((p) => {
              if (p.find((c) => c.id === chat.id)) return p
              return [chat, ...p]
            })
          }
        })
        return new Set([...prev, chat.id])
      })
    },
    [authHeaders]
  )

  // ── Create or ensure a current chat, return its id ────────────────────

  const ensureChat = useCallback(async (): Promise<number | null> => {
    if (currentChatRef.current) return currentChatRef.current.id
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: authHeadersFromRef(),
      body: JSON.stringify({ title: 'New Chat' }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const newChat: Chat = data.chat
    setChats((prev) => [newChat, ...prev])
    setCurrentChat(newChat)
    return newChat.id
  }, [authHeadersFromRef])

  // ── Select chat ────────────────────────────────────────────────────────

  const selectChat = async (chat: Chat) => {
    // Auto-save the currently open chat before switching
    if (currentChat && messages.length > 0) {
      autoSaveChatIfNeeded(currentChat)
    }
    setCurrentChat(chat)
    setLoadingChat(true)
    setStreamingText('')
    try {
      const res = await fetch(`/api/chats/${chat.id}`, { headers: authHeaders() })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
      }
    } finally {
      setLoadingChat(false)
    }
  }

  const createNewChat = async () => {
    // Auto-save current chat before opening new one
    if (currentChat && messages.length > 0) {
      autoSaveChatIfNeeded(currentChat)
    }
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title: 'New Chat' }),
    })
    if (res.ok) {
      const data = await res.json()
      setChats((prev) => [data.chat, ...prev])
      setCurrentChat(data.chat)
      setMessages([])
      setStreamingText('')
    }
  }

  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    await fetch(`/api/chats/${chatId}`, { method: 'DELETE', headers: authHeaders() })
    setChats((prev) => prev.filter((c) => c.id !== chatId))
    setSavedChats((prev) => prev.filter((c) => c.id !== chatId))
    setSavedChatIds((prev) => { const next = new Set(prev); next.delete(chatId); return next })
    if (currentChat?.id === chatId) {
      setCurrentChat(null)
      setMessages([])
      setStreamingText('')
    }
    toast.success('Chat deleted')
  }

  const manualSaveChat = async () => {
    if (!currentChat) return
    if (savedChatIds.has(currentChat.id)) { toast.info('Already saved'); return }
    const res = await fetch('/api/saved-chats', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ chatId: currentChat.id }),
    })
    if (res.ok) {
      setSavedChatIds((prev) => new Set([...prev, currentChat.id]))
      setSavedChats((prev) => [currentChat, ...prev])
      toast.success('Chat saved')
    }
  }

  // ── Core streaming function (used for both text and voice) ────────────

  const streamToChat = useCallback(
    async (chatId: number, message: string, displayMessage: string, source: 'text' | 'voice' = 'text') => {
      if (sendingRef.current) return
      sendingRef.current = true
      setSending(true)
      setStreamingText('')
      setIsStreaming(true)

      const tempId = genTempId()
      const tempUserMsg: Message = {
        id: tempId,
        chat_id: chatId,
        role: 'user',
        content: displayMessage,
        created_at: new Date().toISOString(),
        source,
      }
      setMessages((prev) => [...prev, tempUserMsg])

      try {
        const res = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: authHeadersFromRef(),
          body: JSON.stringify({ chatId, message }),
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          toast.error((err as { error?: string }).error || 'Failed to get response')
          setMessages((prev) => prev.filter((m) => m.id !== tempId))
          return
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let realUserMsg: Message | null = null
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw) continue
            try {
              const event = JSON.parse(raw)
              if (event.type === 'user_message') {
                realUserMsg = { ...event.message, source }
              } else if (event.type === 'delta') {
                accumulated += event.text
                setStreamingText(accumulated)
              } else if (event.type === 'done') {
                const assistantMsg: Message = { ...event.assistantMessage, source }
                setMessages((prev) => {
                  const filtered = prev.filter((m) => m.id !== tempId)
                  const withUser = realUserMsg ? [...filtered, realUserMsg] : filtered
                  return [...withUser, assistantMsg]
                })
                setStreamingText('')
                const newTitle = displayMessage.slice(0, 80)
                setChats((prev) =>
                  prev.map((c) => c.id === chatId ? { ...c, title: newTitle, updated_at: new Date().toISOString() } : c)
                )
                setCurrentChat((prev) => prev && prev.id === chatId ? { ...prev, title: newTitle } : prev)
                // Update ref too
                if (currentChatRef.current?.id === chatId) {
                  currentChatRef.current = { ...currentChatRef.current, title: newTitle }
                }
              } else if (event.type === 'error') {
                toast.error('Streaming error')
              }
            } catch { /* skip malformed */ }
          }
        }
      } catch {
        toast.error('Network error')
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
      } finally {
        sendingRef.current = false
        setSending(false)
        setIsStreaming(false)
      }
    },
    [authHeadersFromRef]
  )

  // ── Send text message ──────────────────────────────────────────────────

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    const chatId = await ensureChat()
    if (!chatId) { toast.error('Could not create chat'); return }
    const langHint  = LANG_HINTS[selectedLang] || ''
    const stateInfo = INDIAN_STATES.find((s) => s.code === selectedState)
    const stateHint = selectedState !== 'all' && stateInfo
      ? `[Apply ${stateInfo.label} state-specific legislation and local laws where relevant]`
      : ''
    const hints     = [langHint, stateHint].filter(Boolean).join('\n')
    const fullMessage = hints ? `${input.trim()}\n\n${hints}` : input.trim()
    setInput('')
    await streamToChat(chatId, fullMessage, input.trim(), 'text')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Voice / Realtime WebRTC ────────────────────────────────────────────

  function stopVoiceCore() {
    dcRef.current?.close()
    pcRef.current?.close()
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    if (audioElRef.current) audioElRef.current.srcObject = null
    dcRef.current = null
    pcRef.current = null
    localStreamRef.current = null
    voiceAiDraftRef.current = ''
    voiceAiTempId.current = 0
  }

  const stopVoice = useCallback(() => {
    stopVoiceCore()
    setVoiceActive(false)
    setVoiceState('idle')
  }, [])

  // Process events from the Realtime data channel
  // Uses refs for currentChat and streamToChat so it's always up to date
  const handleRealtimeEvent = useCallback(
    async (event: Record<string, unknown>) => {
      const type = event.type as string

      // User started speaking
      if (type === 'input_audio_buffer.speech_started') {
        setVoiceState('listening')
      }

      // User finished speaking
      if (type === 'input_audio_buffer.speech_stopped') {
        setVoiceState('speaking')
      }

      // User's speech was transcribed — show it as a user bubble
      if (type === 'conversation.item.input_audio_transcription.completed') {
        const transcript = ((event.transcript as string) ?? '').trim()
        if (!transcript) return

        // Ensure there's a chat to save into
        const chatId = await ensureChat()
        if (!chatId) return

        // Save voice transcript via streaming (text + AI response)
        const langHint  = LANG_HINTS[selectedLang] || ''
        const stateInfo = INDIAN_STATES.find((s) => s.code === selectedState)
        const stateHint = selectedState !== 'all' && stateInfo
          ? `[Apply ${stateInfo.label} state-specific legislation and local laws where relevant]`
          : ''
        const hints = [langHint, stateHint].filter(Boolean).join('\n')
        const fullMsg = hints ? `${transcript}\n\n${hints}` : transcript
        streamToChat(chatId, fullMsg, transcript, 'voice')
      }

      // AI is speaking — accumulate transcript deltas into a live bubble
      if (type === 'response.audio_transcript.delta') {
        const delta = (event.delta as string) ?? ''
        setVoiceState('speaking')

        if (!voiceAiTempId.current) {
          const tid = genTempId()
          voiceAiTempId.current = tid
          voiceAiDraftRef.current = delta
          setMessages((prev) => [
            ...prev,
            {
              id: tid,
              chat_id: currentChatRef.current?.id ?? 0,
              role: 'assistant',
              content: delta,
              created_at: new Date().toISOString(),
              source: 'voice',
            },
          ])
        } else {
          voiceAiDraftRef.current += delta
          const draft = voiceAiDraftRef.current
          const tid = voiceAiTempId.current
          setMessages((prev) =>
            prev.map((m) => m.id === tid ? { ...m, content: draft } : m)
          )
        }
      }

      // AI finished speaking — persist voice AI response to DB
      if (type === 'response.audio_transcript.done') {
        const finalText = (event.transcript as string) ?? voiceAiDraftRef.current
        const tid = voiceAiTempId.current
        const chatId = currentChatRef.current?.id
        setVoiceState('listening')

        if (finalText.trim() && chatId) {
          // Save to DB
          const res = await fetch(`/api/chats/${chatId}/messages`, {
            method: 'POST',
            headers: authHeadersFromRef(),
            body: JSON.stringify({ role: 'assistant', content: finalText.trim() }),
          })
          if (res.ok) {
            const data = await res.json()
            // Replace temp bubble with the real DB record
            setMessages((prev) =>
              prev.map((m) => m.id === tid ? { ...data.message, source: 'voice' } : m)
            )
          }
        }
        voiceAiDraftRef.current = ''
        voiceAiTempId.current = 0
      }

      if (type === 'response.done') {
        setVoiceState('listening')
      }

      if (type === 'error') {
        console.error('Realtime error:', event)
        setVoiceState('error')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ensureChat, streamToChat, authHeadersFromRef, selectedLang, selectedState]
  )

  const startVoice = useCallback(async () => {
    if (voiceActive) { stopVoice(); return }
    setVoiceState('connecting')

    try {
      // Get ephemeral token (server-side, API key never exposed)
      const sessionRes = await fetch('/api/realtime/session', {
        method: 'POST',
        headers: authHeaders(),
      })
      if (!sessionRes.ok) throw new Error('Failed to get session token')
      const sessionData = await sessionRes.json()
      const ephemeralKey = sessionData.client_secret?.value
      if (!ephemeralKey) throw new Error('No ephemeral key in session')

      // Mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream

      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // Playback element for AI audio
      if (!audioElRef.current) {
        audioElRef.current = new Audio()
        audioElRef.current.autoplay = true
      }
      pc.ontrack = (e) => {
        if (audioElRef.current) audioElRef.current.srcObject = e.streams[0]
      }

      stream.getAudioTracks().forEach((track) => pc.addTrack(track, stream))

      // Data channel for text events (transcripts, etc.)
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.onopen = () => {
        setVoiceState('listening')
        setVoiceActive(true)
        toast.success('Voice connected — speak now')
      }
      dc.onmessage = (e) => {
        try { handleRealtimeEvent(JSON.parse(e.data)) } catch { /* skip */ }
      }
      dc.onerror  = () => { setVoiceState('error'); toast.error('Voice connection error') }
      dc.onclose  = () => { setVoiceActive(false); setVoiceState('idle') }

      // WebRTC handshake with OpenAI Realtime
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const sdpRes = await fetch(
        'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${ephemeralKey}`, 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        }
      )
      if (!sdpRes.ok) throw new Error('SDP exchange failed')
      await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() })
    } catch (err) {
      console.error('Voice error:', err)
      setVoiceState('error')
      toast.error(`Voice failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      stopVoiceCore()
      setVoiceActive(false)
      setVoiceState('idle')
    }
  }, [voiceActive, authHeaders, stopVoice, handleRealtimeEvent])

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = voiceMuted })
    setVoiceMuted(!voiceMuted)
  }

  // ── Loading / auth guards ──────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <Scale className="w-8 h-8 text-amber-800 animate-pulse" />
          <p className="text-stone-500 text-sm">Loading GeoLegal…</p>
        </div>
      </div>
    )
  }
  if (!user) return null

  const selectedLangLabel = INDIAN_LANGUAGES.find((l) => l.code === selectedLang)?.label ?? 'Auto'

  const voiceBtnClass =
    voiceActive
      ? voiceState === 'listening'
        ? 'bg-green-100 text-green-600 ring-2 ring-green-300 ring-offset-1 hover:bg-green-200'
        : voiceState === 'speaking'
        ? 'bg-blue-100 text-blue-600 animate-pulse hover:bg-blue-200'
        : voiceState === 'connecting'
        ? 'bg-yellow-100 text-yellow-600 animate-pulse'
        : 'bg-red-100 text-red-500 hover:bg-red-200'
      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'

  // ── JSX ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`flex-shrink-0 flex flex-col bg-white border-r border-stone-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-800" strokeWidth={1.5} />
            <span className="font-bold text-stone-900 text-base">GeoLegal</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3 py-3">
          <Button onClick={createNewChat} className="w-full bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {chats.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">No chats yet.</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                  currentChat?.id === chat.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span className="text-sm text-stone-700 truncate">{chat.title || 'New Chat'}</span>
                </div>
                <button onClick={(e) => deleteChat(chat.id, e)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 hover:text-red-500 text-stone-400 transition-all flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}

          {/* Saved chats section */}
          <div className="pt-3">
            <button onClick={() => setSavedOpen(!savedOpen)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hover:text-stone-600 transition-colors">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Saved Chats
              <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${savedOpen ? 'rotate-180' : ''}`} />
            </button>
            {savedOpen && (
              <div className="space-y-0.5 mt-1">
                {savedChats.length === 0 ? (
                  <p className="text-xs text-stone-400 px-3 py-2">No saved chats.</p>
                ) : (
                  savedChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                        currentChat?.id === chat.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-stone-100'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span className="text-sm text-stone-700 truncate">{chat.title || 'Saved Chat'}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* User row */}
        <div className="border-t border-stone-100 px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-stone-700 font-medium truncate">{user.name}</span>
          </div>
          <button onClick={() => { logout(); router.push('/') }} className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-stone-400 transition-colors flex-shrink-0" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-white flex-shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-stone-800 truncate">
              {currentChat ? currentChat.title : 'GeoLegal AI Assistant'}
            </h1>
            <p className="text-xs text-stone-400">Indian Law · IPC · Constitutional Rights</p>
          </div>

          {/* Voice status pill */}
          {voiceActive && (
            <span className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              voiceState === 'listening' ? 'bg-green-100 text-green-700' :
              voiceState === 'speaking'  ? 'bg-blue-100 text-blue-700 animate-pulse' :
              voiceState === 'connecting'? 'bg-yellow-100 text-yellow-700 animate-pulse' :
              'bg-red-100 text-red-600'
            }`}>
              <Radio className="w-3 h-3" />
              {voiceState === 'listening'  ? 'Listening' :
               voiceState === 'speaking'   ? 'AI Speaking' :
               voiceState === 'connecting' ? 'Connecting…' : 'Error'}
            </span>
          )}

          {/* State picker */}
          <div className="relative">
            <button
              onClick={() => { setStatePickerOpen(!statePickerOpen); setLangPickerOpen(false) }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedState !== 'all'
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              title="Select state for local legislation"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[90px] truncate">
                {INDIAN_STATES.find((s) => s.code === selectedState)?.label ?? 'All India'}
              </span>
            </button>
            {statePickerOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-stone-200 rounded-xl shadow-lg w-56 max-h-72 overflow-y-auto">
                <div className="px-3 py-2 border-b border-stone-100 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  State / Union Territory
                </div>
                {INDIAN_STATES.map((state, i) => (
                  <button
                    key={state.code}
                    onClick={() => { setSelectedState(state.code); setStatePickerOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      selectedState === state.code ? 'bg-blue-50 text-blue-800 font-medium' : 'text-stone-700'
                    } ${i === 0 ? 'border-b border-stone-100' : ''}`}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => { setLangPickerOpen(!langPickerOpen); setStatePickerOpen(false) }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[80px] truncate">{selectedLangLabel}</span>
            </button>
            {langPickerOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-stone-200 rounded-xl shadow-lg w-48 max-h-72 overflow-y-auto">
                {INDIAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.code); setLangPickerOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors ${
                      selectedLang === lang.code ? 'bg-amber-50 text-amber-800 font-medium' : 'text-stone-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          {currentChat && (
            <button
              onClick={manualSaveChat}
              className={`p-2 rounded-lg transition-colors ${
                savedChatIds.has(currentChat.id) ? 'text-amber-700 bg-amber-50' : 'text-stone-400 hover:text-amber-700 hover:bg-amber-50'
              }`}
              title={savedChatIds.has(currentChat.id) ? 'Saved' : 'Save chat'}
            >
              {savedChatIds.has(currentChat.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </header>

        {/* ── Messages ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

          {/* Empty state */}
          {!currentChat && messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-4">
                <Scale className="w-12 h-12 text-amber-800/40" strokeWidth={1} />
                <div className="absolute inset-0 blur-xl bg-amber-700/10 rounded-full" />
              </div>
              <h2 className="text-xl font-semibold text-stone-700 mb-2">Ask any legal question</h2>
              <p className="text-sm text-stone-400 max-w-sm">
                GeoLegal speaks Hindi, Bengali, Hinglish, Punjabi, Tamil, Telugu, Gujarati and 22+ Indian languages.
                Use text or voice — all conversations are saved.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {[
                  'बिना वारंट गिरफ्तारी पर मेरे क्या अधिकार हैं?',
                  'IPC Section 420 simple terms mein explain karo',
                  'FIR file karne ka process kya hai?',
                  'Article 21 — constitutional rights kya hain?',
                ].map((q) => (
                  <button key={q} onClick={() => setInput(q)} className="text-left text-sm text-stone-600 bg-white border border-stone-200 rounded-xl px-4 py-3 hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loadingChat && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-stone-400">
                <Scale className="w-4 h-4 animate-pulse text-amber-800" />
                <span className="text-sm">Loading conversation…</span>
              </div>
            </div>
          )}

          {/* All messages (text + voice) in one unified thread */}
          {!loadingChat && messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center text-white flex-shrink-0 mb-0.5">
                  <Scale className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white rounded-br-sm'
                  : 'bg-white border border-stone-200 text-stone-800 shadow-sm rounded-bl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {/* Voice badge */}
                {msg.source === 'voice' && (
                  <div className={`mt-1.5 flex items-center gap-1 text-[10px] opacity-60 ${msg.role === 'user' ? 'text-amber-100' : 'text-stone-400'}`}>
                    <Mic className="w-2.5 h-2.5" /> voice
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center text-white flex-shrink-0 mb-0.5 text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {/* Live streaming bubble (text mode) */}
          {isStreaming && streamingText && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center text-white flex-shrink-0 mb-0.5">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div className="max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white border border-stone-200 text-stone-800 shadow-sm rounded-bl-sm">
                <div className="whitespace-pre-wrap">{streamingText}</div>
                <span className="inline-block w-0.5 h-4 bg-amber-700 ml-0.5 animate-pulse align-middle" />
              </div>
            </div>
          )}

          {/* Thinking dots (sent but no tokens yet) */}
          {sending && !streamingText && !isStreaming && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center text-white flex-shrink-0 mb-0.5">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white border border-stone-200 shadow-sm rounded-bl-sm">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input bar ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 bg-white border-t border-stone-200 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-amber-800/30 focus-within:bg-white transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  voiceActive
                    ? '🎙 Voice active — speak freely or type…'
                    : 'Ask in any language · हिंदी · বাংলা · Hinglish · ਪੰਜਾਬੀ · தமிழ்…'
                }
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm text-stone-800 placeholder-stone-400 min-h-[24px] max-h-40 leading-relaxed"
                disabled={sending}
              />

              {/* Mute (only in voice mode) */}
              {voiceActive && (
                <button
                  onClick={toggleMute}
                  className={`flex-shrink-0 p-2 rounded-xl transition-all ${voiceMuted ? 'bg-red-100 text-red-500' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}
                  title={voiceMuted ? 'Unmute mic' : 'Mute mic'}
                >
                  <MicOff className="w-4 h-4" />
                </button>
              )}

              {/* Voice toggle */}
              <button
                onClick={startVoice}
                disabled={voiceState === 'connecting'}
                className={`flex-shrink-0 p-2 rounded-xl transition-all disabled:opacity-40 ${voiceBtnClass}`}
                title={voiceActive ? 'Stop voice' : 'Start voice chat'}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-amber-700 to-blue-800 text-white hover:from-amber-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-stone-400 mt-2">
              GPT-4o · Web search · 22 Indian languages · Real-time voice · All sessions auto-saved
              {selectedState !== 'all' && (
                <> · <span className="text-blue-500 font-medium">
                  {INDIAN_STATES.find((s) => s.code === selectedState)?.label} laws active
                </span></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
