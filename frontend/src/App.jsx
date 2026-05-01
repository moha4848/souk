import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useClientAuth } from './context/ClientAuthContext'
import { useAdminAuth } from './context/AdminAuthContext'
import Layout from './components/Layout'

// Feature Modules (Clean Architecture)
import { 
  LoginPage, RegisterPage, Dashboard, Products, ProductForm, 
  Orders, OrderDetail, Analytics, Profile, Onboarding, 
  AIStoreCreator, ProductsGen, CustomizationBuilder, SellerDashboard 
} from './features/vendor'

import { 
  Landing, GlobalFeed, ChatPage, NotificationsCenter, 
  StoreFront, StoreProduct, StoreCart, StoreCheckout, StoreOrderConfirm,
  ClientLogin, ClientRegister, ClientDashboard 
} from './features/client'

import { 
  AdminLanding, TeamLogin, AdminDashboard, ModerationQueue, 
  FinanceReview, RbacManagement, AuditLogs, DeliveryFleet 
} from './features/admin'

import { Spinner, C, ResponsiveStyle } from './components/UI'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center',
      alignItems:'center', background:C.bg }}>
      <Spinner />
    </div>
  )
  
  if (!user) return <Navigate to="/login" replace />

  // SaaS Flow Guard: If vendor is not yet fully active, redirect to onboarding 
  // (unless they are already on onboarding page)
  const isFullySetup = user.role === 'superadmin' || (user.status === 'approved' && user.project_type && user.vendor?.active_subscription)
  
  if (!isFullySetup && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <Layout>{children}</Layout>
}

function PrivateClientRoute({ children }) {
  const { client, loading } = useClientAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center',
      alignItems:'center', background:C.bg }}>
      <Spinner />
    </div>
  )
  return client ? children : <Navigate to="/client/login" replace />
}

function PrivateAdminRoute({ children }) {
  const { admin, loading } = useAdminAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center',
      alignItems:'center', background:C.bg }}>
      <Spinner />
    </div>
  )
  return admin ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center',
      alignItems:'center', background:C.bg }}>
      <Spinner />
    </div>
  )

  return (
    <>
      <ResponsiveStyle />
      <Routes>
      <Route path="/"         element={<Landing />} />
      <Route path="/explore"  element={<GlobalFeed />} />

      {/* Storefront Routes */}
      <Route path="/store/:slug"                     element={<StoreFront />} />
      <Route path="/store/:slug/product/:id"         element={<StoreProduct />} />
      <Route path="/store/:slug/cart"                element={<StoreCart />} />
      <Route path="/store/:slug/checkout"            element={<StoreCheckout />} />
      <Route path="/store/:slug/order/:orderNumber"  element={<StoreOrderConfirm />} />

      {/* Client Buyer Routes */}
      <Route path="/client/login"      element={<ClientLogin />} />
      <Route path="/client/register"   element={<ClientRegister />} />
      <Route path="/client/dashboard"  element={<PrivateClientRoute><ClientDashboard/></PrivateClientRoute>} />

      {/* Chat & Notifications Routes (Common for seller & client) */}
      <Route path="/chat"  element={<PrivateRoute><ChatPage/></PrivateRoute>} />
      <Route path="/notifications"  element={<PrivateRoute><NotificationsCenter/></PrivateRoute>} />

      {/* Seller Routes */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard"/> : <LoginPage/>} />
      <Route path="/register" element={user ? <Navigate to="/dashboard"/> : <RegisterPage/>} />
      
      {/* AI Onboarding */}
      <Route path="/seller/ai-store" element={<AIStoreCreator />} />

      {/* Admin Routes */}
      <Route path="/admin"              element={<AdminLanding />} />
      <Route path="/admin/login"        element={<TeamLogin />} />
      <Route path="/admin/dashboard"    element={<PrivateAdminRoute><AdminDashboard/></PrivateAdminRoute>} />
      <Route path="/admin/moderation"   element={<PrivateAdminRoute><ModerationQueue/></PrivateAdminRoute>} />
      <Route path="/admin/finance"      element={<PrivateAdminRoute><FinanceReview/></PrivateAdminRoute>} />
      <Route path="/admin/rbac"         element={<PrivateAdminRoute><RbacManagement/></PrivateAdminRoute>} />
      <Route path="/admin/logs"         element={<PrivateAdminRoute><AuditLogs/></PrivateAdminRoute>} />
      <Route path="/admin/delivery"     element={<PrivateAdminRoute><DeliveryFleet/></PrivateAdminRoute>} />

      <Route path="/dashboard"     element={<PrivateRoute><SellerDashboard/></PrivateRoute>} />
      <Route path="/products"      element={<PrivateRoute><Products/></PrivateRoute>} />
      <Route path="/products/new"  element={<PrivateRoute><ProductForm/></PrivateRoute>} />
      <Route path="/products/ai"   element={<PrivateRoute><ProductsGen/></PrivateRoute>} />
      <Route path="/products/:id"  element={<PrivateRoute><ProductForm/></PrivateRoute>} />
      <Route path="/orders"        element={<PrivateRoute><Orders/></PrivateRoute>} />
      <Route path="/orders/:id"    element={<PrivateRoute><OrderDetail/></PrivateRoute>} />
      <Route path="/analytics"     element={<PrivateRoute><Analytics/></PrivateRoute>} />
      <Route path="/customize"     element={<PrivateRoute><CustomizationBuilder/></PrivateRoute>} />
      <Route path="/profile"       element={<PrivateRoute><Profile/></PrivateRoute>} />
      <Route path="/onboarding"    element={user ? <Onboarding /> : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

