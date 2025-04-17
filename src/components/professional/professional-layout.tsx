import { Outlet } from 'react-router-dom'
import { ProfessionalSidebar } from './professional-sidebar'

export function ProfessionalLayout() {
  return (
    <div className="flex h-screen">
      <ProfessionalSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
