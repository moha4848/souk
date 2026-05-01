import { Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import GlobalFeed from './GlobalFeed'
import StoreFront from './StoreFront'
import StoreProduct from './StoreProduct'
import StoreCart from './StoreCart'
import StoreCheckout from './StoreCheckout'
import SmartCheckoutFlow from './SmartCheckoutFlow'
import StoreOrderConfirm from './StoreOrderConfirm'
import ClientDashboard from './ClientDashboard'
import ChatPage from './ChatPage'
import NotificationsCenter from './NotificationsCenter'

export default function ClientApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/explore" element={<GlobalFeed />} />
      <Route path="/store/:slug" element={<StoreFront />} />
      <Route path="/store/:slug/product/:id" element={<StoreProduct />} />
      <Route path="/store/:slug/cart" element={<StoreCart />} />
      <Route path="/store/:slug/checkout" element={<StoreCheckout />} />
      <Route path="/store/:slug/checkout-smart" element={<SmartCheckoutFlow />} />
      <Route path="/store/:slug/order/:orderNumber" element={<StoreOrderConfirm />} />
      <Route path="/dashboard" element={<ClientDashboard />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/notifications" element={<NotificationsCenter />} />
    </Routes>
  )
}
