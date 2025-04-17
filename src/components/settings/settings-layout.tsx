import { Card } from '@/components/ui/card'
import SettingsSidebar from './settings-sidebar'
import { ContainerContent, ContainerHeader, ContainerTitle } from '../Container'
import { Outlet } from 'react-router-dom'

export default function SettingsLayout() {
  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Settings</ContainerTitle>
      </ContainerHeader>
      <ContainerContent>
        <Card className="flex">
          <aside className="w-64 border-r">
            <SettingsSidebar />
          </aside>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </Card>
      </ContainerContent>
    </>
  )
}
