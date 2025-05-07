'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Dumbbell,
  Utensils,
  Users,
  Calendar,
  ChevronRight,
  ArrowRight,
  Award,
  Clipboard,
  Activity,
  Heart,
  User,
  ShoppingBag,
  Settings,
  TrendingUp,
  Flame,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

import useUser from '@/hooks/user-hooks'
import FeatureCard from '@/components/FeatureCard'
import { Helmet } from 'react-helmet-async'
import RequiredTasksList from '@/components/purchase-workflow/required-tasks-list'
import { PendingTasksList } from '@/components/professional/pending-task-list'
import { checkIsProfessional } from '@/lib/utils/checkIsProfessional'
import { UserType } from '@/types/userType'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Home() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    completedWorkouts: 0,
    totalWorkouts: 0,
    caloriesBurned: 0,
    weightProgress: 0,
  })

  const isAdmin = user?.role === 'ADMIN'

  const isProfessional = checkIsProfessional(user)
  const isStudent = user?.role === 'STUDENT'

  const currentTraining = user?.trainingWeeks
    ? user.trainingWeeks.find((trainingWeek) => trainingWeek.weekNumber)
    : null
  const currentDiet = user?.diets ? user.diets.find((diet) => diet.isCurrent) : null

  useEffect(() => {
    if (isStudent && user) {
      const completedWorkouts =
        user.trainingWeeks?.reduce(
          (total, week) =>
            total + (week.trainingDays?.filter((day) => day.isCompleted)?.length || 0),
          0
        ) || 0

      const totalWorkouts =
        user.trainingWeeks?.reduce(
          (total, week) => total + (week.trainingDays?.length || 0),
          0
        ) || 0

      const weightProgress =
        user.oldWeights && user.oldWeights.length > 1
          ? Number.parseFloat(user.oldWeights[0].weight) -
            Number.parseFloat(user.oldWeights[user.oldWeights.length - 1].weight)
          : 0

      setStats({
        completedWorkouts,
        totalWorkouts,
        caloriesBurned: calculateCaloriesBurned(user),
        weightProgress: Math.abs(weightProgress),
      })
    }
  }, [user, isStudent])

  const calculateCaloriesBurned = (user: UserType) => {
    const completedWorkouts =
      user.trainingWeeks?.reduce(
        (total, week) =>
          total + (week.trainingDays?.filter((day) => day.isCompleted)?.length || 0),
        0
      ) || 0

    return completedWorkouts * 300
  }

  // Render different hero sections based on user role
  const renderHeroSection = () => {
    if (!user) {
      return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/80 to-primary py-16 px-6 text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Transform Your Fitness Journey Today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 max-w-2xl text-xl text-white/90"
            >
              Personalized training plans, nutrition guidance, and expert coaching to help
              you achieve your fitness goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/professional/list">Browse Professionals</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )
    }

    if (isAdmin) {
      return (
        <section className="rounded-3xl bg-gradient-to-r from-amber-500/80 to-amber-600 py-12 px-6 text-white shadow-xl">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mb-6 max-w-2xl text-lg text-white/90">
              Welcome back, {user.name}. Manage your platform, users, and system settings.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="secondary">
                <Link to="/admin/professionals">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Professionals
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )
    }

    if (isProfessional) {
      return (
        <section className="rounded-3xl bg-gradient-to-r from-blue-600/80 to-blue-700 py-12 px-6 text-white shadow-xl">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {user.role === 'NUTRITIONIST' ? 'Nutritionist' : 'Personal Trainer'}{' '}
              Dashboard
            </h1>
            <p className="mb-6 max-w-2xl text-lg text-white/90">
              Welcome back, {user.name}. Manage your clients and professional services.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="bg-white/10 text-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Active Clients</p>
                      <p className="text-3xl font-bold">{user?.clients?.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 text-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">Active Plans</p>
                      <p className="text-3xl font-bold">
                        {user.plans?.filter((plan) => plan.isActive)?.length || 0}
                      </p>
                    </div>
                    <Clipboard className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 text-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">
                        Upcoming Meetings
                      </p>
                      <p className="text-3xl font-bold">
                        {user.meetingsAsProfessional?.filter(
                          (m) => new Date(m.startTime) > new Date()
                        )?.length || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )
    }

    // Student view
    return (
      <section className="rounded-3xl bg-gradient-to-r from-primary/80 to-primary py-12 px-6 text-white shadow-xl">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back, {user.name || 'Athlete'}!
              </h1>
              <p className="max-w-2xl text-lg text-white/90">
                Here's your fitness journey at a glance.
              </p>
            </div>
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage
                src={user.imageUrl || '/placeholder.svg?height=100&width=100'}
                alt={user.name || 'User'}
              />
              <AvatarFallback className="bg-white/10 text-lg font-semibold text-white">
                {user.name ? user.name.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card className="bg-white/10 text-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Workouts</p>
                    <p className="text-2xl font-bold">
                      {stats.completedWorkouts}/{stats.totalWorkouts}
                    </p>
                  </div>
                  <Dumbbell className="h-8 w-8 text-white/70" />
                </div>
                <Progress
                  value={
                    stats.totalWorkouts > 0
                      ? (stats.completedWorkouts / stats.totalWorkouts) * 100
                      : 0
                  }
                  className="mt-2 h-1.5 bg-white/20"
                />
              </CardContent>
            </Card>
            <Card className="bg-white/10 text-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Calories Burned</p>
                    <p className="text-2xl font-bold">{stats.caloriesBurned}</p>
                  </div>
                  <Flame className="h-8 w-8 text-white/70" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 text-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Weight Progress</p>
                    <p className="text-2xl font-bold">
                      {stats.weightProgress > 0 ? `-${stats.weightProgress}` : '0'} kg
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-white/70" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 text-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Next Session</p>
                    <p className="text-2xl font-bold">
                      {user.meetingsAsStudent && user.meetingsAsStudent.length > 0
                        ? new Date(
                            user.meetingsAsStudent[0].startTime
                          ).toLocaleDateString()
                        : 'No sessions'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-white/70" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  const renderContentSection = () => {
    if (!user) {
      return (
        <>
          <section className="my-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Dumbbell className="h-10 w-10" />}
                  title="Personalized Training"
                  description="Custom workout plans designed specifically for your goals and fitness level."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Utensils className="h-10 w-10" />}
                  title="Nutrition Guidance"
                  description="Expert dietary advice and meal plans to fuel your performance."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Activity className="h-10 w-10" />}
                  title="Progress Tracking"
                  description="Monitor your improvements with detailed metrics and visualizations."
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeatureCard
                  icon={<Users className="h-10 w-10" />}
                  title="Expert Coaching"
                  description="Direct access to certified trainers and nutritionists for guidance."
                />
              </motion.div>
            </motion.div>
          </section>

          <section className="my-16">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary">How It Works</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our platform makes it easy to achieve your fitness goals with a simple
                process.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <CardTitle>1. Create Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sign up and complete your profile with your fitness goals,
                    preferences, and current metrics.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <CardTitle>2. Choose Your Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select from our range of training and nutrition plans, or get matched
                    with a professional.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <CardTitle>3. Achieve Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Follow your personalized plan, track your progress, and reach your
                    fitness goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="my-16 rounded-3xl bg-muted/50 p-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary">
                Join Thousands of Satisfied Users
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-background">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John D.</p>
                        <p className="text-sm text-muted-foreground">
                          Lost 15kg in 6 months
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The personalized training plan was exactly what I needed. The
                      nutrition guidance was a game-changer!"
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah M.</p>
                        <p className="text-sm text-muted-foreground">
                          Fitness competitor
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "As an athlete, I needed specific guidance. My trainer provided
                      exactly what I needed to compete at my best."
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Robert K.</p>
                        <p className="text-sm text-muted-foreground">
                          Gained muscle mass
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      "The workout tracking and progress visualization helped me stay
                      motivated and see my improvements."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </>
      )
    }

    if (isAdmin) {
      return (
        <section className="my-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Platform Overview</h2>
            <Button asChild variant="outline">
              <Link to="/admin/purchases">
                View Purchases
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Professional Management</CardTitle>
                <CardDescription>Manage platform professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Manage Professionals</p>
                      <p className="text-sm text-muted-foreground">
                        Review and approve professional accounts
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/admin/professionals">View</Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Manage Purchases</p>
                      <p className="text-sm text-muted-foreground">
                        Review platform transactions
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/admin/purchases">View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Platform Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Configure global platform settings
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/admin/settings">Configure</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )
    }

    if (isProfessional) {
      return (
        <section className="my-12">
          <div className="mb-8">
            <Tabs defaultValue="clients">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clients">My Clients</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-primary">Active Clients</h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/professional/clients">
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {user.clients ? (
                    user.clients.map((client) => (
                      <Card key={client.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={client.imageUrl || '/placeholder.svg'}
                                  alt={client.name}
                                />
                                <AvatarFallback>
                                  {client.name?.charAt(0) || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {client.name || client.email}
                                </CardTitle>
                                <CardDescription>{client.latestPlanName}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={client.isActive ? 'default' : 'outline'}>
                              {client.isActive}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-2">
                          <Button asChild variant="ghost" size="sm" className="w-full">
                            <Link to={`/client/${client.id}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card className="col-span-full">
                      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          You don't have any clients yet
                        </p>
                        <Button asChild className="mt-4">
                          <Link to="/professional/clients">Manage Clients</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-primary">
                    Tasks Requiring Attention
                  </h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/professional/tasks">
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6 text-center">
                    {/* <Clipboard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">Manage Your Tasks</h3>
                    <p className="mb-4 text-muted-foreground">
                      View and manage all your pending tasks in one place
                    </p>
                    <Button asChild>
                      <Link to="/professional/tasks">Go to Tasks</Link>
                    </Button> */}
                    <PendingTasksList tasks={user.tasks} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-primary">
                    Upcoming Appointments
                  </h3>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/meetings">
                      Full Calendar
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {user.meetingsAsProfessional &&
                  user.meetingsAsProfessional.length > 0 ? (
                    user.meetingsAsProfessional
                      .filter((meeting) => new Date(meeting.startTime) > new Date())
                      .sort(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                      )
                      .slice(0, 3)
                      .map((meeting) => (
                        <Card key={meeting.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium">{meeting.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{meeting.student?.name || 'Client'}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                                    {new Date(meeting.startTime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                              <Button size="sm">Join</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No upcoming meetings scheduled
                        </p>
                        <Button asChild className="mt-4">
                          <Link to="/meetings">Schedule Meeting</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Plans Management</CardTitle>
                <CardDescription>Manage your professional plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Your Plans</p>
                        <p className="text-sm text-muted-foreground">
                          Manage your service plans
                        </p>
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to="/professional/professional-plans">View Plans</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Create New Plan</p>
                        <p className="text-sm text-muted-foreground">
                          Add a new service plan
                        </p>
                      </div>
                    </div>
                    <Button asChild size="sm">
                      <Link to="/professional/create-plan">Create</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common professional tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/professional/create-plan">
                      <FileText className="mr-2 h-4 w-4" />
                      Create New Plan
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/meetings">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/diet/create">
                      <Utensils className="mr-2 h-4 w-4" />
                      Create Diet Plan
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/training/create">
                      <Dumbbell className="mr-2 h-4 w-4" />
                      Create Training Plan
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start md:col-span-2"
                  >
                    <Link to="/professional/professional-dashboard">
                      <Activity className="mr-2 h-4 w-4" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )
    }

    // Student view
    return (
      <section className="my-12">
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {currentTraining && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    Current Training Plan
                  </CardTitle>
                  <Badge>Week {currentTraining.weekNumber}</Badge>
                </div>
                <CardDescription>Your personalized workout schedule</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h4 className="mb-2 font-medium">Training Progress</h4>
                  <Progress
                    value={
                      currentTraining.trainingDays &&
                      currentTraining.trainingDays.length > 0
                        ? (currentTraining.trainingDays.filter((day) => day.isCompleted)
                            .length /
                            currentTraining.trainingDays.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {currentTraining.trainingDays?.filter((day) => day.isCompleted)
                        .length || 0}{' '}
                      of {currentTraining.trainingDays?.length || 0} days completed
                    </span>
                    <span>
                      {Math.round(
                        currentTraining.trainingDays &&
                          currentTraining.trainingDays.length > 0
                          ? (currentTraining.trainingDays.filter((day) => day.isCompleted)
                              .length /
                              currentTraining.trainingDays.length) *
                              100
                          : 0
                      )}
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentTraining.trainingDays?.slice(0, 3).map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            day.isCompleted
                              ? 'bg-green-100 text-green-700'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <Dumbbell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{day.muscleGroups}</p>
                          <p className="text-xs text-muted-foreground">{day.dayOfWeek}</p>
                        </div>
                      </div>
                      <Badge variant={day.isCompleted ? 'default' : 'outline'}>
                        {day.isCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-4 py-3">
                <Button asChild className="w-full">
                  <Link to={`/training/${currentTraining.id}`}>
                    View Full Training Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentDiet && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Current Diet Plan
                  </CardTitle>
                  <Badge>Week {currentDiet.weekNumber}</Badge>
                </div>
                <CardDescription>Your personalized nutrition plan</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h4 className="mb-2 font-medium">Nutrition Overview</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-primary/5 p-2">
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-bold">{currentDiet.totalCalories || 0}</p>
                    </div>
                    <div className="rounded-md bg-primary/5 p-2">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-bold">{currentDiet.totalProtein || 0}g</p>
                    </div>
                    <div className="rounded-md bg-primary/5 p-2">
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-bold">{currentDiet.totalCarbohydrates || 0}g</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentDiet.meals?.slice(0, 3).map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            meal.isCompleted
                              ? 'bg-green-100 text-green-700'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          <Utensils className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Day {meal.day} • {meal.hour}
                          </p>
                        </div>
                      </div>
                      <Badge variant={meal.isCompleted ? 'default' : 'outline'}>
                        {meal.isCompleted ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-4 py-3">
                <Button asChild className="w-full">
                  <Link to={`/diet/${currentDiet.id}`}>
                    View Full Diet Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {(!currentTraining || !currentDiet) && (
          <Card className="mb-8 bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Professional Guidance</h3>
              <p className="mb-4 max-w-md text-muted-foreground">
                Take your fitness journey to the next level with personalized training and
                nutrition plans from our certified professionals.
              </p>
              <Button asChild>
                <Link to="/professional/list">Find a Professional</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">
                  Track your fitness progress over time
                </p>
                <Button asChild>
                  <Link to="/progress">View Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.meetingsAsStudent && user.meetingsAsStudent.length > 0 ? (
                <div className="space-y-4">
                  {user.meetingsAsStudent
                    .filter((meeting) => new Date(meeting.startTime) > new Date())
                    .sort(
                      (a, b) =>
                        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
                    .slice(0, 2)
                    .map((meeting, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(meeting.startTime).toLocaleDateString()} at{' '}
                              {new Date(meeting.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-4 text-muted-foreground">
                    No upcoming sessions scheduled
                  </p>
                  <Button asChild>
                    <Link to="/meetings">View Schedule</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {user.currentWeight || 'N/A'} kg
                      </span>
                      {user.oldWeights && user.oldWeights.length > 1 && (
                        <span className="ml-2 text-green-600">
                          {Number.parseFloat(user.oldWeights[0].weight) <
                          Number.parseFloat(
                            user.oldWeights[user.oldWeights.length - 1].weight
                          )
                            ? '+'
                            : '-'}
                          {Math.abs(
                            Number.parseFloat(user.oldWeights[0].weight) -
                              Number.parseFloat(
                                user.oldWeights[user.oldWeights.length - 1].weight
                              )
                          ).toFixed(1)}{' '}
                          kg
                        </span>
                      )}
                    </p>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium">Body Fat</p>
                    <p className="text-sm">
                      <span className="font-medium">{user.currentBf || 'N/A'}%</span>
                      {user.oldWeights &&
                        user.oldWeights.length > 1 &&
                        user.oldWeights[0].bf &&
                        user.oldWeights[user.oldWeights.length - 1].bf && (
                          <span className="ml-2 text-green-600">
                            {Number.parseFloat(user.oldWeights[0].bf) <
                            Number.parseFloat(
                              user.oldWeights[user.oldWeights.length - 1].bf
                            )
                              ? '+'
                              : '-'}
                            {Math.abs(
                              Number.parseFloat(user.oldWeights[0].bf) -
                                Number.parseFloat(
                                  user.oldWeights[user.oldWeights.length - 1].bf
                                )
                            ).toFixed(1)}
                            %
                          </span>
                        )}
                    </p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/progress">View All Metrics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet title="Home" />
      <main className="container mx-auto px-4 py-8">
        {renderHeroSection()}
        {renderContentSection()}

        <section className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
            Join our community of fitness enthusiasts and take control of your health and
            wellness today.
          </p>
          <Button asChild size="lg">
            <Link
              to={
                user
                  ? isProfessional
                    ? '/professional/clients'
                    : '/profile'
                  : '/register'
              }
            >
              {user
                ? isProfessional
                  ? 'Manage Clients'
                  : 'Update Your Profile'
                : 'Sign Up Now'}
            </Link>
          </Button>
        </section>
      </main>
    </>
  )
}
