import React, { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import { Bell, Trash2, CheckCheck, AlertCircle, ShoppingBag, Heart, MessageSquare, Star, Truck, DollarSign } from 'lucide-react'
import '../../styles/NotificationsCenter.css'

export default function NotificationsCenter() {
  const {
    notifications,
    unreadNotifications,
    loading,
    stats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
  } = useNotifications()

  const [filterType, setFilterType] = useState('all')
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  const filteredNotifications = notifications.filter(notif => {
    if (filterType !== 'all' && notif.type !== filterType) return false
    if (showOnlyUnread && notif.is_read) return false
    return true
  })

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20 }
    switch (type) {
      case 'order':
        return <ShoppingBag {...iconProps} />
      case 'message':
        return <MessageSquare {...iconProps} />
      case 'follow':
        return <Heart {...iconProps} />
      case 'like':
        return <Heart {...iconProps} />
      case 'promotion':
        return <Star {...iconProps} />
      case 'delivery':
        return <Truck {...iconProps} />
      case 'payment':
        return <DollarSign {...iconProps} />
      case 'store_verified':
        return <CheckCheck {...iconProps} />
      default:
        return <AlertCircle {...iconProps} />
    }
  }

  const getNotificationColor = (type) => {
    const colors = {
      order: '#10b981',
      message: '#8b5cf6',
      follow: '#ef4444',
      like: '#f43f5e',
      promotion: '#f59e0b',
      delivery: '#10b981',
      payment: '#06b6d4',
      store_verified: '#6366f1',
    }
    return colors[type] || '#6b7280'
  }

  return (
    <div className="notifications-center">
      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          {unreadNotifications.length > 0 && (
            <p className="unread-count">{unreadNotifications.length} unread</p>
          )}
        </div>
        <div className="header-actions">
          {unreadNotifications.length > 0 && (
            <button onClick={markAllAsRead} className="btn-mark-all">
              Mark all as read
            </button>
          )}
          <button onClick={deleteReadNotifications} className="btn-delete-read">
            Clear read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterType === 'order' ? 'active' : ''}`}
            onClick={() => setFilterType('order')}
          >
            Orders {stats.order?.count > 0 && `(${stats.order.count})`}
          </button>
          <button
            className={`filter-btn ${filterType === 'message' ? 'active' : ''}`}
            onClick={() => setFilterType('message')}
          >
            Messages {stats.message?.count > 0 && `(${stats.message.count})`}
          </button>
          <button
            className={`filter-btn ${filterType === 'promotion' ? 'active' : ''}`}
            onClick={() => setFilterType('promotion')}
          >
            Promotions {stats.promotion?.count > 0 && `(${stats.promotion.count})`}
          </button>
          <button
            className={`filter-btn ${filterType === 'delivery' ? 'active' : ''}`}
            onClick={() => setFilterType('delivery')}
          >
            Delivery {stats.delivery?.count > 0 && `(${stats.delivery.count})`}
          </button>
        </div>

        <div className="filter-toggle">
          <label>
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={(e) => setShowOnlyUnread(e.target.checked)}
            />
            Unread only
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {loading ? (
          <div className="loading-state">
            <Bell size={32} className="loading-icon" />
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={40} />
            <h3>No notifications</h3>
            <p>
              {showOnlyUnread
                ? 'You have read all your notifications!'
                : 'You are all caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
            >
              <div
                className="notification-icon"
                style={{ backgroundColor: getNotificationColor(notification.type) + '20' }}
              >
                <div style={{ color: getNotificationColor(notification.type) }}>
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <small className="notification-time">
                  {formatTimeAgo(notification.created_at)}
                </small>
              </div>

              <div className="notification-actions">
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="btn-mark-read"
                    title="Mark as read"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="btn-delete"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {Object.keys(stats).length > 0 && (
        <div className="stats-summary">
          <h4>Summary</h4>
          <div className="stats-grid">
            {Object.entries(stats).map(([type, data]) => (
              <div key={type} className="stat-card">
                <small>{type}</small>
                <strong>{data.count}</strong>
                {data.unread > 0 && <span className="unread">{data.unread} unread</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago'
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago'
  return date.toLocaleDateString()
}

