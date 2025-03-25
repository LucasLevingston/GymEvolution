// 'use client';

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Calendar,
//   Clock,
//   Video,
//   Users,
//   CheckCircle,
//   XCircle,
//   Plus,
//   ExternalLink,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useUserStore } from '@/store/user-store';
// import { ContainerRoot } from '@/components/Container';
// import { useMeetings, type Meeting } from '@/hooks/use-google-calendar';
// import LoadingSpinner from '@/components/LoadingSpinner';

// export default function Meetings() {
//   const { user } = useUserStore();
//   const { getUserMeetings, cancelMeeting, completeMeeting, isLoading } = useMeetings();
//   const [meetings, setMeetings] = useState<Meeting[]>([]);
//   const [activeTab, setActiveTab] = useState('upcoming');

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       if (!user) return;

//       const role =
//         user.role === 'NUTRITIONIST' || user.role === 'TRAINER'
//           ? 'professional'
//           : 'student';
//       const data = await getUserMeetings(role);
//       setMeetings(data);
//     };

//     fetchMeetings();
//   }, [user, getUserMeetings]);

//   const handleCancelMeeting = async (id: string) => {
//     if (window.confirm('Tem certeza que deseja cancelar esta reunião?')) {
//       const result = await cancelMeeting(id);
//       if (result) {
//         setMeetings(
//           meetings.map((meeting) =>
//             meeting.id === id ? { ...meeting, status: 'CANCELLED' } : meeting
//           )
//         );
//       }
//     }
//   };

//   const handleCompleteMeeting = async (id: string) => {
//     if (window.confirm('Marcar esta reunião como concluída?')) {
//       const result = await completeMeeting(id);
//       if (result) {
//         setMeetings(
//           meetings.map((meeting) =>
//             meeting.id === id ? { ...meeting, status: 'COMPLETED' } : meeting
//           )
//         );
//       }
//     }
//   };

//   const isProfessional = user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER';

//   const upcomingMeetings = meetings.filter(
//     (meeting) =>
//       meeting.status === 'SCHEDULED' && new Date(meeting.startTime) > new Date()
//   );

//   const pastMeetings = meetings.filter(
//     (meeting) =>
//       meeting.status === 'COMPLETED' || new Date(meeting.startTime) < new Date()
//   );

//   const cancelledMeetings = meetings.filter((meeting) => meeting.status === 'CANCELLED');

//   if (!user) {
//     return (
//       <ContainerRoot>
//         <div className="py-20 text-center">
//           <h2 className="text-2xl font-bold mb-4">Por favor, faça login</h2>
//           <p className="text-muted-foreground mb-8">
//             Você precisa estar logado para acessar esta página.
//           </p>
//           <Button asChild>
//             <Link to="/login">Fazer Login</Link>
//           </Button>
//         </div>
//       </ContainerRoot>
//     );
//   }

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Minhas Reuniões</h1>
//           <p className="text-muted-foreground">
//             Gerencie suas reuniões com {isProfessional ? 'alunos' : 'profissionais'}
//           </p>
//         </div>
//         {isProfessional && (
//           <Button asChild>
//             <Link to="/schedule-meeting">
//               <Plus className="mr-2 h-4 w-4" />
//               Agendar Nova Reunião
//             </Link>
//           </Button>
//         )}
//       </div>

//       <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="upcoming">Próximas</TabsTrigger>
//           <TabsTrigger value="past">Concluídas</TabsTrigger>
//           <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
//         </TabsList>

//         <TabsContent value="upcoming" className="mt-6">
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : upcomingMeetings.length === 0 ? (
//             <Card>
//               <CardContent className="py-10 text-center">
//                 <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                   <Calendar className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="mb-2 text-xl font-semibold">Nenhuma reunião agendada</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Você não tem reuniões agendadas para os próximos dias.
//                 </p>
//                 {isProfessional && (
//                   <Button asChild>
//                     <Link to="/schedule-meeting">Agendar Nova Reunião</Link>
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2">
//               {upcomingMeetings.map((meeting) => {
//                 const startTime = new Date(meeting.startTime);
//                 const endTime = new Date(meeting.endTime);
//                 const participant = isProfessional
//                   ? meeting.student
//                   : meeting.professional;

//                 return (
//                   <Card key={meeting.id}>
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <CardTitle>{meeting.title}</CardTitle>
//                         <Badge variant="outline" className="bg-green-50 text-green-700">
//                           Agendada
//                         </Badge>
//                       </div>
//                       <CardDescription>{meeting.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           <span>{startTime.toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           <span>
//                             {startTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}{' '}
//                             -
//                             {endTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-muted-foreground" />
//                           <span>Com: {participant?.name || 'Participante'}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                     <CardFooter className="flex justify-between">
//                       {meeting.meetLink ? (
//                         <Button asChild>
//                           <a
//                             href={meeting.meetLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             <Video className="mr-2 h-4 w-4" />
//                             Entrar na Reunião
//                             <ExternalLink className="ml-1 h-3 w-3" />
//                           </a>
//                         </Button>
//                       ) : (
//                         <Button disabled>
//                           <Video className="mr-2 h-4 w-4" />
//                           Link Indisponível
//                         </Button>
//                       )}
//                       <div className="flex gap-2">
//                         {isProfessional && (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleCompleteMeeting(meeting.id)}
//                           >
//                             <CheckCircle className="mr-2 h-4 w-4" />
//                             Concluir
//                           </Button>
//                         )}
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleCancelMeeting(meeting.id)}
//                         >
//                           <XCircle className="mr-2 h-4 w-4" />
//                           Cancelar
//                         </Button>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="past" className="mt-6">
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : pastMeetings.length === 0 ? (
//             <Card>
//               <CardContent className="py-10 text-center">
//                 <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                   <CheckCircle className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="mb-2 text-xl font-semibold">Nenhuma reunião concluída</h3>
//                 <p className="text-muted-foreground">
//                   Você ainda não concluiu nenhuma reunião.
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2">
//               {pastMeetings.map((meeting) => {
//                 const startTime = new Date(meeting.startTime);
//                 const endTime = new Date(meeting.endTime);
//                 const participant = isProfessional
//                   ? meeting.student
//                   : meeting.professional;

//                 return (
//                   <Card key={meeting.id}>
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <CardTitle>{meeting.title}</CardTitle>
//                         <Badge variant="outline" className="bg-blue-50 text-blue-700">
//                           Concluída
//                         </Badge>
//                       </div>
//                       <CardDescription>{meeting.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           <span>{startTime.toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           <span>
//                             {startTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}{' '}
//                             -
//                             {endTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-muted-foreground" />
//                           <span>Com: {participant?.name || 'Participante'}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="cancelled" className="mt-6">
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : cancelledMeetings.length === 0 ? (
//             <Card>
//               <CardContent className="py-10 text-center">
//                 <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//                   <XCircle className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="mb-2 text-xl font-semibold">Nenhuma reunião cancelada</h3>
//                 <p className="text-muted-foreground">Você não tem reuniões canceladas.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2">
//               {cancelledMeetings.map((meeting) => {
//                 const startTime = new Date(meeting.startTime);
//                 const endTime = new Date(meeting.endTime);
//                 const participant = isProfessional
//                   ? meeting.student
//                   : meeting.professional;

//                 return (
//                   <Card key={meeting.id}>
//                     <CardHeader className="pb-3">
//                       <div className="flex justify-between items-start">
//                         <CardTitle>{meeting.title}</CardTitle>
//                         <Badge variant="outline" className="bg-red-50 text-red-700">
//                           Cancelada
//                         </Badge>
//                       </div>
//                       <CardDescription>{meeting.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           <span>{startTime.toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           <span>
//                             {startTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}{' '}
//                             -
//                             {endTime.toLocaleTimeString([], {
//                               hour: '2-digit',
//                               minute: '2-digit',
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-muted-foreground" />
//                           <span>Com: {participant?.name || 'Participante'}</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </>
//   );
// }
