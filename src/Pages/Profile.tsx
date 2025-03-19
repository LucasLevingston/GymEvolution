import React from 'react';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import { Link } from 'react-router-dom';
import HistoryButton from '@/components/HistoryButton';
import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <ContainerRoot>
        <div className="flex h-screen flex-col items-center justify-center space-y-4">
          <div className="text-xl font-semibold text-foreground">
            Please log in to view your profile
          </div>
          <Button asChild variant="default" className="w-32">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  return (
    <ContainerRoot>
      <ContainerHeader>
        <ContainerTitle>Profile</ContainerTitle>
        <HistoryButton />
      </ContainerHeader>
      <ContainerContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileItem label="Name" value={user.name} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="Phone" value={user.phone} />
          <ProfileItem label="Birth Date" value={user.birthDate} />
          <ProfileItem label="Current Weight" value={user.currentWeight} />
          <ProfileItem label="Sex" value={user.sex} />
          <ProfileItem label="Height" value={user.height} />
        </div>
        <div className="mt-8 flex justify-between space-x-4">
          <Button variant="outline" className="flex-1">
            <Link to="/past-trainings">Past Trainings</Link>
          </Button>
          <Button variant="outline" className="flex-1">
            <Link to="/progress">Progress</Link>
          </Button>
          <Button variant="default" className="flex-1">
            <Link to="/settings/my-informations">Edit Profile</Link>
          </Button>
        </div>
      </ContainerContent>
    </ContainerRoot>
  );
}

interface ProfileItemProps {
  label: string;
  value: string | undefined;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value }) => (
  <div className="space-y-1">
    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    <p className="min-h-12 border-b-[2px] p-2 rounded-md  text-lg">{value}</p>
  </div>
);
