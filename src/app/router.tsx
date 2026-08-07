import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { MarketplaceLayout } from '@/layouts/MarketplaceLayout'
import { NotFoundPage, ServerErrorPage } from '@/pages/system/SystemPages'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { RoleGuard } from '@/components/auth/RoleGuard'

const HomePage = lazy(() => import('@/pages/Home'))
const ProductsPage = lazy(() => import('@/pages/Products'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetail'))
const CartPage = lazy(() => import('@/pages/Cart'))
const CheckoutPage = lazy(() => import('@/pages/Checkout'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const OrdersPage = lazy(() => import('@/pages/Orders'))
const RolesPage = lazy(() => import('@/pages/Roles'))
const B2BPortalPage = lazy(() => import('@/pages/B2BPortal'))
const TransportDashboardPage = lazy(() => import('@/pages/TransportDashboard'))
const InventoryDashboardPage = lazy(() => import('@/pages/InventoryDashboard'))
const SupplierDashboardPage = lazy(() => import('@/pages/SupplierDashboard'))
const AccountingDashboardPage = lazy(() => import('@/pages/AccountingDashboard'))

const AdminDashboard = lazy(() => import('@/admin/Dashboard'))
const AdminProducts = lazy(() => import('@/admin/Products'))
const AdminOrders = lazy(() => import('@/admin/Orders'))
const AdminUsers = lazy(() => import('@/admin/Users'))
const AdminRoles = lazy(() => import('@/admin/Roles'))
const AdminSettings = lazy(() => import('@/admin/Settings'))
const AdminOperations = lazy(() => import('@/admin/Operations'))
const AdminCatalog = lazy(() => import('@/admin/Catalog'))
const PlatformAdmin = lazy(() => import('@/admin/Platform'))
const ManualOrder = lazy(() => import('@/admin/ManualOrder'))
const Fulfillment = lazy(() => import('@/admin/Fulfillment'))
const Returns = lazy(() => import('@/admin/Returns'))
const Payments = lazy(() => import('@/admin/Payments'))
const Pricing = lazy(() => import('@/admin/Pricing'))

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'))
const AcceptInvitePage = lazy(() => import('@/pages/auth/AcceptInvitePage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketplaceLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'roles/:slug', element: <RolesPage /> },
      { path: 'b2b', element: <B2BPortalPage /> },
      { path: 'employee', element: <RoleGuard roles={['Manager', 'Employee']}><InventoryDashboardPage /></RoleGuard> },
      { path: 'supplier', element: <RoleGuard roles={['Vendor']}><SupplierDashboardPage /></RoleGuard> },
      { path: 'transport', element: <RoleGuard roles={['Transporter']}><TransportDashboardPage /></RoleGuard> },
      { path: 'accounting', element: <RoleGuard roles={['Accountant']}><AccountingDashboardPage /></RoleGuard> },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard><AppLayout /></AdminGuard>,
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'roles', element: <AdminRoles /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: 'operations/pricing', element: <Pricing /> },
      { path: 'operations/:module', element: <AdminOperations /> },
      { path: 'catalog', element: <AdminCatalog /> },
      { path: 'platform', element: <PlatformAdmin /> },
      { path: 'manual-order', element: <ManualOrder /> },
      { path: 'fulfillment', element: <Fulfillment /> },
      { path: 'returns', element: <Returns /> },
      { path: 'payments', element: <Payments /> },
    ],
  },
  {
    path: '/auth',
    element: <MarketplaceLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'callback', element: <OAuthCallbackPage /> },
      { path: 'accept-invite', element: <AcceptInvitePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
