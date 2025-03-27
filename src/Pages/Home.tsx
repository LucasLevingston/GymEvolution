import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Dumbbell, Utensils, LineChart } from 'lucide-react';
import useUser from '@/hooks/user-hooks';
import { TrainingWeekCard } from '@/components/training/training-week-card';
import FeatureCard from '@/components/FeatureCard';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const { user } = useUser();

  const currentTraining = user?.trainingWeeks
    ? user.trainingWeeks.find((trainingWeek) => trainingWeek.weekNumber)
    : null;

  return (
    <>
      <Helmet title="Home" />
      <main className="py-12">
        <section className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Your Personal Training & Diet Assistant
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Track your progress, analyze your performance, and achieve your fitness goals
            with our comprehensive system.
          </p>
          {!user && (
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
          )}
        </section>

        <section className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Dumbbell className="h-10 w-10" />}
            title="Workout Tracking"
            description="Log and analyze your training sessions with ease."
          />
          <FeatureCard
            icon={<Utensils className="h-10 w-10" />}
            title="Diet Analysis"
            description="Monitor your nutrition and make informed dietary choices."
          />
          <FeatureCard
            icon={<LineChart className="h-10 w-10" />}
            title="Progress Monitoring"
            description="Visualize your fitness journey with detailed charts and graphs."
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10" />}
            title="Performance Metrics"
            description="Get insights into your performance and areas for improvement."
          />
        </section>

        {user && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold text-primary">
              This Week's Training
            </h2>

            {currentTraining ? (
              <TrainingWeekCard initialData={currentTraining} />
            ) : (
              <p className="text-center text-muted-foreground">
                Não há dias de treino registrados para esta semana.
              </p>
            )}
          </section>
        )}

        <section className="rounded-lg bg-primary/10 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
            Join our community of fitness enthusiasts and take control of your health and
            wellness today.
          </p>
          <Button asChild size="lg">
            <Link to={user ? '/profile' : '/register'}>
              {user ? 'Update Your Profile' : 'Sign Up Now'}
            </Link>
          </Button>
        </section>
      </main>
    </>
  );
}
