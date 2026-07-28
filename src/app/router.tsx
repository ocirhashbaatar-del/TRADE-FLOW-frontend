import { lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MarketplaceLayout } from '@/layouts/MarketplaceLayout'
import { ForbiddenPage, FullPageLoading, NotFoundPage, ServerErrorPage, UnauthorizedPage } from '@/pages/system/SystemPages'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const AuthUtilityPage = lazy(() => import('@/pages/auth/AuthUtilityPage').then((module) => ({ default: module.AuthUtilityPage })))
const SelectionPage = lazy(() => import('@/pages/auth/AuthUtilityPage').then((module) => ({ default: module.SelectionPage })))
const EnterpriseModulePage = lazy(() => import('@/pages/enterprise/EnterpriseModulePage'))
const AnalyticsPage = lazy(() => import('@/pages/enterprise/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/enterprise/SettingsPage'))
const NotificationsPage = lazy(() => import('@/pages/enterprise/NotificationsPage'))
const OrderDetailPage = lazy(() => import('@/pages/enterprise/OrderDetailPage'))

const marketplacePages = () => import('@/pages/marketplace/MarketplacePages')
const MarketplacePage = lazy(() => marketplacePages().then((module) => ({ default: module.MarketplacePage })))
const MarketplaceLandingPage = lazy(() => marketplacePages().then((module) => ({ default: module.MarketplaceLandingPage })))
const CategoriesPage = lazy(() => marketplacePages().then((module) => ({ default: module.CategoriesPage })))
const SearchPage = lazy(() => marketplacePages().then((module) => ({ default: module.SearchPage })))
const ProductDetailsPage = lazy(() => marketplacePages().then((module) => ({ default: module.ProductDetailsPage })))
const WishlistPage = lazy(() => marketplacePages().then((module) => ({ default: module.WishlistPage })))
const CartPage = lazy(() => marketplacePages().then((module) => ({ default: module.CartPage })))
const CheckoutPage = lazy(() => marketplacePages().then((module) => ({ default: module.CheckoutPage })))
const OrderSuccessPage = lazy(() => marketplacePages().then((module) => ({ default: module.OrderSuccessPage })))
const OrderHistoryPage = lazy(() => marketplacePages().then((module) => ({ default: module.OrderHistoryPage })))
const ReviewsPage = lazy(() => marketplacePages().then((module) => ({ default: module.ReviewsPage })))
const RecommendationsPage = lazy(() => marketplacePages().then((module) => ({ default: module.RecommendationsPage })))
const VendorStorePage = lazy(() => marketplacePages().then((module) => ({ default: module.VendorStorePage })))

const enterpriseModules = ['inventory', 'warehouses', 'suppliers', 'purchase-orders', 'finance', 'customers', 'vendors', 'shipping', 'delivery', 'returns', 'refunds', 'reports', 'billing'] as const

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <AuthUtilityPage type="forgot-password" /> },
      { path: 'reset-password', element: <AuthUtilityPage type="reset-password" /> },
      { path: 'email-verification', element: <AuthUtilityPage type="email-verification" /> },
      { path: 'otp-verification', element: <AuthUtilityPage type="otp-verification" /> },
      { path: 'role-selection', element: <SelectionPage mode="role" /> },
      { path: 'tenant-selection', element: <SelectionPage mode="tenant" /> },
    ],
  },
  {
    path: '/marketplace',
    element: <MarketplaceLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      { index: true, element: <MarketplacePage /> },
      { path: 'landing', element: <MarketplaceLandingPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'products/:id', element: <ProductDetailsPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-success', element: <OrderSuccessPage /> },
      { path: 'orders', element: <OrderHistoryPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'recommendations', element: <RecommendationsPage /> },
      { path: 'vendor/:slug', element: <VendorStorePage /> },
    ],
  },
  {
    element: <AppLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/design-system', element: <DesignSystemPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      ...enterpriseModules.map((module) => ({ path: `/${module}`, element: <EnterpriseModulePage module={module} /> })),
    ],
  },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/forbidden', element: <ForbiddenPage /> },
  { path: '/500', element: <ServerErrorPage /> },
  { path: '/loading', element: <FullPageLoading /> },
  { path: '*', element: <NotFoundPage /> },
])
