import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/services'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) {
      setNotifications([])
      return
    }
    try {
      setLoading(true)
      const response = await api.get('/notifications')
      setNotifications(response.data.data.data || [])
      setError(null)
    } catch (err) {
      if (err.response?.status === 401) {
        setNotifications([]);
        return;
      }
      setError(err.response?.data?.message || 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch unread notifications only
  const fetchUnreadNotifications = useCallback(async () => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) {
      setUnreadNotifications([])
      return
    }
    try {
      const response = await api.get('/notifications/unread')
      setUnreadNotifications(response.data.data || [])
    } catch (err) {
      if (err.response?.status === 401) return;
    }
  }, [])

  // Fetch notification stats
  const fetchNotificationStats = useCallback(async () => {
    const token = localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token')
    if (!token) {
      setStats({})
      return
    }
    try {
      const response = await api.get('/notifications/stats')
      setStats(response.data.data || {})
    } catch (err) {
      if (err.response?.status === 401) return;
    }
  }, [])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`)
      // Update local state
      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ))
      setUnreadNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/notifications/mark-all-read')
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      setUnreadNotifications([])
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      setUnreadNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  // Delete all read notifications
  const deleteReadNotifications = useCallback(async () => {
    try {
      await api.delete('/notifications/read')
      // Update local state
      setNotifications(prev => prev.filter(notif => !notif.is_read))
    } catch (err) {
      console.error('Error deleting read notifications:', err)
    }
  }, [])

  // Fetch all data on mount and set up polling
  useEffect(() => {
    fetchNotifications()
    fetchUnreadNotifications()
    fetchNotificationStats()

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchUnreadNotifications()
      fetchNotificationStats()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchNotifications, fetchUnreadNotifications, fetchNotificationStats])

  const value = {
    notifications,
    unreadNotifications,
    unreadCount: unreadNotifications.length,
    loading,
    error,
    stats,
    fetchNotifications,
    fetchUnreadNotifications,
    fetchNotificationStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
