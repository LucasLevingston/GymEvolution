import React from 'react';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import { Link } from 'react-router-dom';
import HistoryButton from '@/components/HistoryButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContainerRoot } from '@/components/Container';

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
      <div className="mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold">Profile</CardTitle>
            <HistoryButton />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileItem label="Name" value={user.name} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Phone" value={user.phone} />
              <ProfileItem label="Birth Date" value={user.birthDate} />
              <ProfileItem label="Current Weight" value={user.currentWeight} />
              <ProfileItem label="Sex" value={user.sex} />
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
          </CardContent>
        </Card>
      </div>
    </ContainerRoot>
  );
}

interface ProfileItemProps {
  label: string;
  value: string | undefined;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    <p className="mt-1 text-lg">{value || 'Not provided'}</p>
  </div>
);
