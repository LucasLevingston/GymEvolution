import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, XCircle, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ContainerContent,
  ContainerHeader,
  ContainerTitle,
} from '@/components/Container';

interface Relationship {
  id: string;
  nutritionist?: {
    id: string;
    name: string;
    email: string;
  } | null;
  trainer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  student?: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export default function RelationshipManagement() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, getRelationships, updateRelationship } = useUser();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchRelationships = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getRelationships(user.id);
        setRelationships(data);

        if (data.length > 0) {
          const pendingCount = data.filter((rel) => rel.status === 'PENDING').length;
          if (pendingCount > 0) {
            addNotification({
              title: 'Pending Requests',
              message: `You have ${pendingCount} pending professional ${pendingCount === 1 ? 'request' : 'requests'}.`,
              type: 'info',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching relationships:', error);
        toast.error('Failed to load relationships');
        addNotification({
          title: 'Error',
          message: 'Failed to load your professional relationships.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRelationships();
  }, [user, getRelationships, addNotification]);

  const handleUpdateStatus = async (
    relationshipId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      await updateRelationship(relationshipId, { status });

      // Update local state
      setRelationships((prev) =>
        prev.map((rel) => (rel.id === relationshipId ? { ...rel, status } : rel))
      );

      toast.success(`Request ${status.toLowerCase()}`);

      // Add notification
      addNotification({
        title: status === 'ACCEPTED' ? 'Request Accepted' : 'Request Rejected',
        message:
          status === 'ACCEPTED'
            ? 'You have successfully accepted the professional request.'
            : 'You have rejected the professional request.',
        type: status === 'ACCEPTED' ? 'success' : 'info',
      });
    } catch (error) {
      console.error('Error updating relationship:', error);
      toast.error('Failed to update request');
      addNotification({
        title: 'Error',
        message: 'Failed to update the professional request.',
        type: 'error',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to view your relationships.
          </p>
          <Button asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <ContainerHeader>
        <div>
          <ContainerTitle>My Professionals</ContainerTitle>
          <p className="mb-8 text-muted-foreground">
            Manage your relationships with nutritionists and trainers
          </p>
        </div>
      </ContainerHeader>
      <ContainerContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : relationships.filter((rel) => rel.status === 'ACCEPTED').length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No Active Professionals</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any active relationships with professionals yet.
                  </p>
                  <Button asChild>
                    <Link to="/professionals">Find Professionals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {relationships
                  .filter((rel) => rel.status === 'ACCEPTED')
                  .map((relationship) => {
                    const professional =
                      relationship.nutritionist || relationship.trainer;
                    const type = relationship.nutritionist ? 'Nutritionist' : 'Trainer';

                    return (
                      <Card key={relationship.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{professional?.name}</CardTitle>
                              <CardDescription>{type}</CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Active
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground mb-4">
                            <p>Email: {professional?.email}</p>
                            <p>Since: {formatDate(relationship.createdAt)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" asChild>
                            <Link to={`/professionals/${professional?.id}`}>
                              View Profile
                            </Link>
                          </Button>
                          <Button asChild>
                            <Link to={`/messages/${professional?.id}`}>Message</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : relationships.filter((rel) => rel.status === 'PENDING').length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending relationship requests.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {relationships
                  .filter((rel) => rel.status === 'PENDING')
                  .map((relationship) => {
                    const professional =
                      relationship.nutritionist || relationship.trainer;
                    const type = relationship.nutritionist ? 'Nutritionist' : 'Trainer';

                    return (
                      <Card key={relationship.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{professional?.name}</CardTitle>
                              <CardDescription>{type}</CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700"
                            >
                              Pending
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground mb-4">
                            <p>Email: {professional?.email}</p>
                            <p>Requested: {formatDate(relationship.createdAt)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" asChild>
                            <Link to={`/professionals/${professional?.id}`}>
                              View Profile
                            </Link>
                          </Button>
                          <div className="space-x-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(relationship.id, 'REJECTED')
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : relationships.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No Relationships</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't connected with any professionals yet.
                  </p>
                  <Button asChild>
                    <Link to="/professionals">Find Professionals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {relationships.map((relationship) => {
                  const professional = relationship.nutritionist || relationship.trainer;
                  const type = relationship.nutritionist ? 'Nutritionist' : 'Trainer';

                  let badgeClass = '';
                  let badgeText = '';

                  switch (relationship.status) {
                    case 'ACCEPTED':
                      badgeClass = 'bg-green-50 text-green-700';
                      badgeText = 'Active';
                      break;
                    case 'PENDING':
                      badgeClass = 'bg-amber-50 text-amber-700';
                      badgeText = 'Pending';
                      break;
                    case 'REJECTED':
                      badgeClass = 'bg-red-50 text-red-700';
                      badgeText = 'Cancelled';
                      break;
                  }

                  return (
                    <Card key={relationship.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{professional?.name}</CardTitle>
                            <CardDescription>{type}</CardDescription>
                          </div>
                          <Badge variant="outline" className={badgeClass}>
                            {badgeText}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-4">
                          <p>Email: {professional?.email}</p>
                          <p>
                            {relationship.status === 'ACCEPTED' ? 'Since' : 'Requested'}:{' '}
                            {formatDate(relationship.createdAt)}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                          <Link to={`/professionals/${professional?.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        {relationship.status === 'ACCEPTED' && (
                          <Button asChild>
                            <Link to={`/messages/${professional?.id}`}>Message</Link>
                          </Button>
                        )}
                        {relationship.status === 'PENDING' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(relationship.id, 'REJECTED')
                            }
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>{' '}
      </ContainerContent>
    </>
  );
}
