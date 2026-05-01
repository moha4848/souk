import React, { useState, useEffect } from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { Send, MessageCircle, Search, User, Clock, X } from 'lucide-react'
import '../../styles/ChatPage.css'

export default function ChatPage() {
  const { user } = useAuth()
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    startConversation,
    markAsRead,
    setCurrentConversation,
  } = useChat()

  const [messageInput, setMessageInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [newRecipientId, setNewRecipientId] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const filteredConversations = conversations.filter(conv =>
    (conv.store?.name || '').toLowerCase().includes(searchInput.toLowerCase()) ||
    (conv.client?.name || '').toLowerCase().includes(searchInput.toLowerCase())
  )

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation)
    fetchConversation(conversation.id)
    markAsRead(conversation.id)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !currentConversation) return

    setSendingMessage(true)
    try {
      await sendMessage(currentConversation.id, messageInput)
      setMessageInput('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleStartConversation = async (e) => {
    e.preventDefault()
    if (!newRecipientId) return

    try {
      const conversation = await startConversation(parseInt(newRecipientId))
      setCurrentConversation(conversation)
      fetchConversation(conversation.id)
      setNewRecipientId('')
      setShowNewConversation(false)
    } catch (err) {
      console.error('Error starting conversation:', err)
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Conversations List Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-header">
            <h2>Messages</h2>
            <button
              onClick={() => setShowNewConversation(!showNewConversation)}
              className="btn-new-chat"
              title="New Conversation"
            >
              +
            </button>
          </div>

          {showNewConversation && (
            <div className="new-conversation-form">
              <form onSubmit={handleStartConversation}>
                <input
                  type="number"
                  placeholder="Recipient ID"
                  value={newRecipientId}
                  onChange={(e) => setNewRecipientId(e.target.value)}
                  required
                />
                <button type="submit">Start Chat</button>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="chat-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Conversations List */}
          <div className="conversations-list">
            {loading ? (
              <div className="loading">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="empty-state">
                <MessageCircle size={32} />
                <p>No conversations yet</p>
                <small>Start a new conversation to begin chatting</small>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    currentConversation?.id === conversation.id ? 'active' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    <User size={24} />
                  </div>
                  <div className="conversation-info">
                    <h3 className="conversation-name">
                      {user?.id === conversation.store?.id
                        ? conversation.client?.name
                        : conversation.store?.name}
                    </h3>
                    <p className="conversation-preview">{conversation.last_message}</p>
                  </div>
                  <div className="conversation-meta">
                    {conversation.unread_count > 0 && (
                      <span className="unread-badge">{conversation.unread_count}</span>
                    )}
                    <small className="time-ago">{formatTimeAgo(conversation.last_message_at)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-messages-header">
                <div>
                  <h3>
                    {user?.id === currentConversation.store?.id
                      ? currentConversation.client?.name
                      : currentConversation.store?.name}
                  </h3>
                  <p className="chat-status">Online</p>
                </div>
                <button
                  onClick={() => setCurrentConversation(null)}
                  className="btn-close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <MessageCircle size={40} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.sender_id === user?.id ? 'sent' : 'received'
                      }`}
                    >
                      {message.image_url && (
                        <img src={message.image_url} alt="Message" className="message-image" />
                      )}
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <small className="message-time">
                          {formatTime(message.created_at)}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={sendingMessage}
                  className="message-input"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sendingMessage}
                  className="btn-send"
                >
                  {sendingMessage ? '...' : <Send size={20} />}
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <MessageCircle size={48} />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-toast">
          <p>{error}</p>
          <button onClick={() => {}} className="btn-close-toast">×</button>
        </div>
      )}
    </div>
  )
}

function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatTimeAgo(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  return Math.floor(diff / 86400) + 'd ago'
}
