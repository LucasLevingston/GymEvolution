'use client'

import type React from 'react'
import { Button } from '@/components/ui/button'
import useUser from '@/hooks/user-hooks'
import { Link } from 'react-router-dom'
import HistoryButton from '@/components/HistoryButton'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MapPin,
  User,
  Phone,
  Calendar,
  Weight,
  Ruler,
  Award,
  BookOpen,
  FileText,
  Heart,
} from 'lucide-react'

export default function Profile() {
  const { user } = useUser()

  if (!user) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center space-y-4">
          <div className="text-xl font-semibold text-foreground">
            Please log in to view your profile
          </div>
          <Button asChild variant="default" className="w-32">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Profile</ContainerTitle>
        <HistoryButton />
      </ContainerHeader>
      <ContainerContent>
        <div className="mb-8 flex flex-col items-center md:flex-row md:items-start md:space-x-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center md:mt-0 md:text-left">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            {user.bio && <p className="mt-2 max-w-md">{user.bio}</p>}
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileItem
                icon={<User className="h-4 w-4" />}
                label="Name"
                value={user.name}
              />
              <ProfileItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={user.phone}
              />
              <ProfileItem
                icon={<Calendar className="h-4 w-4" />}
                label="Birth Date"
                value={user.birthDate}
              />
              <ProfileItem
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={
                  user.street && user.number
                    ? `${user.street}, ${user.number}`
                    : user.street || ''
                }
              />
              <ProfileItem
                icon={<MapPin className="h-4 w-4" />}
                label="City/State"
                value={
                  user.city && user.state
                    ? `${user.city}, ${user.state}`
                    : user.city || user.state || ''
                }
              />
              <ProfileItem
                icon={<MapPin className="h-4 w-4" />}
                label="Zip Code"
                value={user.zipCode}
              />
            </div>
          </TabsContent>

          <TabsContent value="physical" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileItem
                icon={<User className="h-4 w-4" />}
                label="Sex"
                value={user.sex}
              />
              <ProfileItem
                icon={<Ruler className="h-4 w-4" />}
                label="Height"
                value={user.height ? `${user.height} m` : ''}
              />
              <ProfileItem
                icon={<Weight className="h-4 w-4" />}
                label="Current Weight"
                value={user.currentWeight ? `${user.currentWeight} kg` : ''}
              />
              <ProfileItem
                icon={<Heart className="h-4 w-4" />}
                label="Body Fat %"
                value={user.currentBf ? `${user.currentBf}%` : ''}
              />
              <ProfileItem
                icon={<Award className="h-4 w-4" />}
                label="Experience"
                value={user.experience !== undefined ? `${user.experience} years` : ''}
              />
            </div>
          </TabsContent>

          <TabsContent value="professional" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileItem
                icon={<Award className="h-4 w-4" />}
                label="Specialties"
                value={user.specialties}
              />
              <ProfileItem
                icon={<FileText className="h-4 w-4" />}
                label="Certifications"
                value={user.certifications}
              />
              <ProfileItem
                icon={<BookOpen className="h-4 w-4" />}
                label="Education"
                value={user.education}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col space-y-4 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
          <Button variant="outline" className="flex-1">
            <Link to="/past-trainings" className="w-full">
              Past Trainings
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            <Link to="/progress" className="w-full">
              Progress
            </Link>
          </Button>
          <Button variant="default" className="flex-1">
            <Link to="/settings/my-informations" className="w-full">
              Edit Profile
            </Link>
          </Button>
        </div>
      </ContainerContent>
    </>
  )
}

interface ProfileItemProps {
  icon?: React.ReactNode
  label: string
  value: string | undefined | number
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      {icon}
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
    </div>
    <p className="min-h-12 rounded-md border-b-[2px] p-2 text-lg">{value || '-'}</p>
  </div>
)
