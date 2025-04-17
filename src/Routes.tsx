import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Authentication/Login'
import Register from './Pages/Authentication/Register'
import MyInformationsSettings from './Pages/Settings/MyInformations'
import CreateTraining from './Pages/Training/CreateTraining'
import { useUserStore } from './store/user-store'
import NotFound from './Pages/Not-Found'
import { ThemeProvider } from './components/providers/ThemeProvider'
import Profile from './Pages/Profile'
import ThemeSettings from './Pages/Settings/ThemeSettings'
import PastWorkouts from './Pages/Training/PastTrainings'
import CurrentWorkoutWeek from './Pages/Training/TrainingWeekPlan'
import Progress from './Pages/Progress'
import ResetPassword from './Pages/Authentication/ResetPassword'
import PasswordRecovery from './Pages/Authentication/PasswordRecovery'
import DietPlan from './Pages/Diet/DietPlan'
import PastDiets from './Pages/Diet/PastDiets'
import CreateDiet from './Pages/Diet/CreateDiet'
import ProfessionalsList from './Pages/Professionals/ProfessionalsList'
import ProfessionalDetail from './Pages/Professionals/ProfessionalDetail'
import { NotificationProvider } from './components/notifications/NotificationProvider'
import { ContainerRoot } from './components/Container'
import RegisterProfessional from './Pages/Professionals/RegisterProfessional'
import HiringFlow from './Pages/HiringFlow'
import PurchaseSuccess from './Pages/Purchase/PurchaseSuccess'
import PurchaseCancel from './Pages/Purchase/PurchaseCancel'
import RelationshipManagement from './Pages/Professionals/RelationshipManagement'
import CreatePlan from './Pages/Professionals/Plan/CreatePlan'
import EditPlan from './Pages/Professionals/Plan/EditPlan'
import Meetings from './Pages/Meetings/Meetings'
import ScheduleMeeting from './Pages/Meetings/ScheduleMeeting'
import ProfessionalPlans from './Pages/Professionals/Plan/ProfessionalPlans'
import Purchases from './Pages/Purchase/Purchases'
import PurchaseDetails from './Pages/Purchase/PurchaseDetails'
import ConnectGooglePage from './Pages/Settings/ConnectGoogle'
import ProfessionalDashboard from './Pages/Professionals/ProfessionalDashboard'
import AdminProfessionals from './Pages/Admin/AllProfessionals'
import AdminSettings from './Pages/Admin/AdminSettings'
import { AdminLayout } from './components/admin/admin-layout'
import ClientManagement from './Pages/Professionals/ClientManagement'
import ProfessionalMetrics from './Pages/Professionals/ProfessionalMetrics'
import type { JSX } from 'react'
import { ProfessionalLayout } from './components/professional/professional-layout'
import AdminPurchases from './Pages/Admin/AdminPurchases'
import SettingsLayout from './components/settings/settings-layout'
import ProfessionalPayments from './Pages/Professionals/ProfessionalPayments'
import ProfessionalTasks from './Pages/Professionals/ProfessionalTasks'

interface PrivateRouteProps {
  element: JSX.Element
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { user } = useUserStore()
  return user ? element : <Navigate to="/login" />
}

const AdminRoute = ({ element }: PrivateRouteProps) => {
  const { user } = useUserStore()
  return user?.role === 'ADMIN' ? element : <Navigate to="/" />
}

const ProfessionalRoute = ({ element }: PrivateRouteProps) => {
  const { user } = useUserStore()
  return user ? (
    user.role === 'NUTRITIONIST' || user.role === 'TRAINER' ? (
      element
    ) : (
      <Navigate to="/professional/register" />
    )
  ) : (
    <Navigate to="/login" />
  )
}

const AuthRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/password-recovery', element: <PasswordRecovery /> },
  { path: '/reset-password', element: <ResetPassword /> },
]

const ProfessionalRoutes = [
  {
    path: '/professional/',
    element: <ProfessionalRoute element={<ProfessionalLayout />} />,
    children: [
      { path: 'professional-dashboard', element: <ProfessionalDashboard /> },
      { path: 'clients', element: <ClientManagement /> },
      { path: 'metrics', element: <ProfessionalMetrics /> },
      { path: 'meetings', element: <Meetings /> },
      { path: 'professional-plans', element: <ProfessionalPlans /> },
      { path: 'create-plan', element: <CreatePlan /> },
      { path: 'payments', element: <ProfessionalPayments /> },
      { path: 'edit-plan/:id', element: <EditPlan /> },
      { path: 'tasks', element: <ProfessionalTasks /> },
      // { path: 'settings', element: <ProfessionalSettings /> },
    ],
  },
  {
    path: '/professional/register',
    element: <PrivateRoute element={<RegisterProfessional />} />,
  },
  { path: '/professional/list', element: <ProfessionalsList /> },
  { path: '/professional/:id', element: <ProfessionalDetail /> },
  { path: '/professional/hiring-flow', element: <HiringFlow /> },
]

const SettingsRoutes = [
  {
    element: <SettingsLayout />,
    path: '/settings/',
    children: [
      {
        path: 'google-connect',
        element: <PrivateRoute element={<ConnectGooglePage />} />,
      },
      { path: 'theme', element: <PrivateRoute element={<ThemeSettings />} /> },
      {
        path: 'my-informations',
        element: <PrivateRoute element={<MyInformationsSettings />} />,
      },
    ],
  },
]

const TrainingRoutes = [
  { path: '/workout-week', element: <PrivateRoute element={<CurrentWorkoutWeek />} /> },
  { path: '/training-weeks', element: <PrivateRoute element={<PastWorkouts />} /> },
  { path: '/create-training', element: <PrivateRoute element={<CreateTraining />} /> },
]

const DietRoutes = [
  { path: '/diet', element: <PrivateRoute element={<DietPlan />} /> },
  { path: '/past-diets', element: <PrivateRoute element={<PastDiets />} /> },
  { path: '/create-diet', element: <PrivateRoute element={<CreateDiet />} /> },
]

const AdminRoutes = [
  {
    path: '/admin/',
    element: <AdminRoute element={<AdminLayout />} />,
    children: [
      // { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'professionals', element: <AdminProfessionals /> },
      { path: 'purchases', element: <AdminPurchases /> },
      { path: 'settings', element: <AdminSettings /> },
      { path: '', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
]

const PurchaseRoutes = [
  {
    path: '/purchases',
    element: <PrivateRoute element={<Purchases />} />,
  },
  {
    path: '/purchases/:id',
    element: <PrivateRoute element={<PurchaseDetails />} />,
  },
  {
    path: '/purchase-success/:professionalId/:planId',
    element: <PrivateRoute element={<PurchaseSuccess />} />,
  },
  {
    path: '/purchase-cancel/:relationshipId',
    element: <PrivateRoute element={<PurchaseCancel />} />,
  },
  {
    path: '/professional-plans/:id',
    element: <PrivateRoute element={<ProfessionalPlans />} />,
  },
  {
    path: '/meetings',
    element: <PrivateRoute element={<Meetings />} />,
  },
  {
    path: '/schedule-meeting/:purchaseId',
    element: <PrivateRoute element={<ScheduleMeeting />} />,
  },
]

const GeneralRoutes = [
  { path: '/', element: <Home /> },
  { path: '/progress', element: <PrivateRoute element={<Progress />} /> },
  { path: '/profile', element: <PrivateRoute element={<Profile />} /> },
  {
    path: '/relationships',
    element: <PrivateRoute element={<RelationshipManagement />} />,
  },
  { path: '*', element: <NotFound /> },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NotificationProvider>
          <ContainerRoot>
            <Outlet />
          </ContainerRoot>
        </NotificationProvider>
      </ThemeProvider>
    ),
    children: [
      ...AuthRoutes,
      ...ProfessionalRoutes,
      ...SettingsRoutes,
      ...TrainingRoutes,
      ...DietRoutes,
      ...PurchaseRoutes,
      ...GeneralRoutes,
      ...AdminRoutes,
    ],
  },
])
