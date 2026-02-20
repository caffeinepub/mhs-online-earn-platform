import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import JobTask from './pages/JobTask';
import Withdraw from './pages/Withdraw';
import ReferAndEarn from './pages/ReferAndEarn';
import PaymentProof from './pages/PaymentProof';
import Support from './pages/Support';
import Header from './components/Header';
import FloatingFacebookButton from './components/FloatingFacebookButton';
import { Toaster } from '@/components/ui/sonner';

// Layout component with header and floating Facebook button
function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Outlet />
      <FloatingFacebookButton />
      <Toaster />
    </div>
  );
}

// Root route with layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Define all routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const jobTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/job-task',
  component: JobTask,
});

const withdrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/withdraw',
  component: Withdraw,
});

const referEarnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/refer-earn',
  component: ReferAndEarn,
});

const paymentProofRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-proof',
  component: PaymentProof,
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: Support,
});

const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-panel',
  component: AdminPanel,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  loginRoute,
  dashboardRoute,
  jobTaskRoute,
  withdrawRoute,
  referEarnRoute,
  paymentProofRoute,
  supportRoute,
  adminPanelRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Declare router type
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
