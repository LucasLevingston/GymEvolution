import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './admin-sidebar'

export function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
