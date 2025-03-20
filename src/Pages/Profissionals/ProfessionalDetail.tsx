'use client';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Star,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import { Professional } from '@/types/ProfessionalType';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfessionals } from '@/hooks/professional-hooks';

export default function ProfessionalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, createRelationship } = useUser();
  const { getProfessionalById } = useProfessionals();
  const { addNotification } = useNotifications();

  if (!id) {
    return null;
  }

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setIsLoading(true);

        const professional = await getProfessionalById(id);
        if (!professional) {
          throw new Error('Professional not found');
        }
        setProfessional(professional);
      } catch (error) {
        console.error('Error fetching professional:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, []);

  const handleHire = async () => {
    if (!user) {
      toast.error('Please log in to hire a professional');
      addNotification({
        title: 'Authentication Required',
        message: 'Please log in to hire a professional',
        type: 'info',
      });
      navigate('/login');
      return;
    }

    if (!professional) return;

    try {
      setLoading(true);

      // Determine relationship type based on professional role
      const isNutritionist = professional.role === 'NUTRITIONIST';

      // Create relationship
      const result = await createRelationship({
        studentId: user.id,
        [isNutritionist ? 'nutritionistId' : 'trainerId']: professional.id,
        status: 'PENDING',
      });

      if (result) {
        toast.success(`Request sent to ${professional.name}`);
        addNotification({
          title: 'Request Sent',
          message: `Your request to ${professional.name} has been sent successfully.`,
          type: 'success',
        });
        navigate('/relationships');
      } else {
        throw new Error('Failed to send request');
      }
    } catch (error) {
      toast.error('Failed to send request');
      addNotification({
        title: 'Request Failed',
        message: 'There was an error sending your request. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  if (!professional) {
    return (
      <>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Professional Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The professional you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/professionals">View All Professionals</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/professionals">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Professionals
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full">
                  {professional.imageUrl ? (
                    <img
                      src={professional.imageUrl || '/placeholder.svg'}
                      alt={professional.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      <Users className="h-20 w-20 text-primary/50" />
                    </div>
                  )}
                </div>

                <h1 className="mb-1 text-2xl font-bold">{professional.name}</h1>
                <p className="mb-3 text-muted-foreground">
                  {professional.role === 'NUTRITIONIST'
                    ? 'Nutritionist'
                    : 'Personal Trainer'}
                </p>

                <div className="mb-4 flex items-center justify-center">
                  <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {professional.rating?.toFixed(1) || '4.5'}
                  </span>
                </div>

                <div className="mb-6 w-full border-t pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{professional.city || 'Remote'}</span>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{professional.experience || 0} years experience</span>
                  </div>
                </div>

                <Button className="w-full" onClick={handleHire} disabled={loading}>
                  {loading ? 'Sending Request...' : 'Hire Professional'}
                </Button>

                <Button variant="outline" className="mt-3 w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Availability</h3>
              <div className="space-y-2">
                {professional.availability?.map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{day}</span>
                  </div>
                )) || <p className="text-muted-foreground">Contact for availability</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {professional.specialties?.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                )) || <p className="text-muted-foreground">No specialties listed</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    About {professional.name}
                  </h2>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    {professional.bio || 'No bio available.'}
                  </p>

                  <h3 className="mb-3 text-lg font-semibold">Certifications</h3>
                  <ul className="mb-6 space-y-2">
                    {professional.certifications?.map((cert, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{cert}</span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground">No certifications listed</li>
                    )}
                  </ul>

                  <div className="rounded-lg bg-primary/5 p-6">
                    <h3 className="mb-3 text-lg font-semibold">How I Can Help You</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {professional.role === 'NUTRITIONIST'
                        ? "I create personalized nutrition plans tailored to your specific goals, dietary preferences, and lifestyle. Whether you're looking to lose weight, gain muscle, or improve your overall health, I'll work with you to develop sustainable eating habits that fit your needs."
                        : "I design customized training programs that align with your fitness goals, experience level, and schedule. Whether you're a beginner looking to get started or an experienced athlete aiming to break through plateaus, I'll guide you through effective workouts and proper technique."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Education & Training</h2>

                  <div className="space-y-6">
                    {professional.education?.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <h3 className="font-medium">{edu}</h3>
                      </div>
                    )) || (
                      <p className="text-muted-foreground">
                        No education information available
                      </p>
                    )}
                  </div>

                  <h2 className="mb-4 mt-8 text-xl font-semibold">
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {professional.experience ? (
                      <div className="border-l-2 border-primary/20 pl-4">
                        <h3 className="font-medium">
                          {professional.role === 'NUTRITIONIST'
                            ? 'Nutritionist'
                            : 'Personal Trainer'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {professional.experience} years of experience
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No experience information available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Client Reviews</h2>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= (professional.rating || 4.5)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-muted text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {professional.rating?.toFixed(1) || '4.5'}
                      </span>
                    </div>
                  </div>

                  {professional.reviews && professional.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {professional.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-medium text-primary">
                                  {review.author.initials}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium">{review.author.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {review.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
