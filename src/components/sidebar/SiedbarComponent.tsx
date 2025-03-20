import type React from 'react';
import { Card } from '@/components/ui/card';
import Sidebar from './Sidebar';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '../Container';

export default function SiedbarComponent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Settings</ContainerTitle>
      </ContainerHeader>
      <ContainerContent>
        <Card className="flex">
          <aside className="w-64 border-r">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </Card>
      </ContainerContent>
    </>
  );
}
