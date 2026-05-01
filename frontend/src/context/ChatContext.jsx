import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api/services'

const ChatContext = createContext()

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const pollingIntervalRef = useRef(null)

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) {
      setConversations([])
      return
    }
    try {
      setLoading(true)
      const response = await api.get('/chat/conversations')
      setConversations(response.data.data || [])
      setError(null)
    } catch (err) {
      if (err.response?.status === 401) {
        setConversations([]);
        return;
      }
      setError(err.response?.data?.message || 'Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch specific conversation messages
  const fetchConversation = useCallback(async (conversationId) => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) return
    try {
      setLoading(true)
      const response = await api.get(`/chat/conversations/${conversationId}`)
      setCurrentConversation(response.data.data.conversation)
      setMessages(response.data.data.messages || [])
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch conversation')
      console.error('Error fetching conversation:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Send message
  const sendMessage = useCallback(async (conversationId, content, imageUrl = null) => {
    try {
      const response = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        { content, image_url: imageUrl }
      )
      
      // Add message to local state
      setMessages(prev => [...prev, {
        id: response.data.data.id,
        sender_id: response.data.data.sender_id,
        content: response.data.data.content,
        image_url: response.data.data.image_url,
        created_at: response.data.data.created_at,
        read_at: null
      }])
      
      // Refresh conversations
      await fetchConversations()
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message')
      console.error('Error sending message:', err)
      throw err
    }
  }, [fetchConversations])

  // Start new conversation
  const startConversation = useCallback(async (recipientId, subject = null) => {
    try {
      const response = await api.post(
        '/chat/start',
        { recipient_id: recipientId, subject }
      )
      await fetchConversations()
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start conversation')
      console.error('Error starting conversation:', err)
      throw err
    }
  }, [fetchConversations])

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      await api.post(`/chat/conversations/${conversationId}/read`)
      // Update local state
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
      ))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }, [])

  // Get unread count
  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) {
      setUnreadCount(0)
      return
    }
    try {
      const response = await api.get('/chat/unread-count')
      setUnreadCount(response.data.data.unread_count || 0)
    } catch (err) {
      if (err.response?.status === 401) return;
    }
  }, [])

  // Start polling for new messages
  useEffect(() => {
    if (!currentConversation) return

    // Initial fetch
    fetchConversation(currentConversation.id)

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchConversation(currentConversation.id)
    }, 3000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [currentConversation?.id, fetchConversation])

  // Start polling for conversations every 5 seconds
  useEffect(() => {
    fetchConversations()
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchConversations()
      fetchUnreadCount()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchConversations, fetchUnreadCount])

  const value = {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    startConversation,
    markAsRead,
    setCurrentConversation,
    setMessages,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
