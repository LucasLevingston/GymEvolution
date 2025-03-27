'use client';

import { useState, useEffect } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import type { UserType } from '@/types/userType';
import { UserSchema, ProfessionalUserSchema } from '@/schemas/UserSchema';
import DataCard from '@/components/DataCard';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SiedbarComponent from '@/components/sidebar/SiedbarComponent';
import { toast } from 'sonner';
import { Loader2, Info, Calendar } from 'lucide-react';
import HistoryButton from '@/components/HistoryButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserFormValues = z.infer<typeof UserSchema>;
type ProfessionalFormValues = z.infer<typeof ProfessionalUserSchema>;

const userFields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'sex', label: 'Sex' },
  { name: 'street', label: 'Street' },
  { name: 'number', label: 'Number' },
  { name: 'zipCode', label: 'Zip Code' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'birthDate', label: 'Birth Date' },
  { name: 'phone', label: 'Phone' },
  { name: 'currentWeight', label: 'Current Weight' },
  { name: 'currentBf', label: 'Current Body Fat %' },
  { name: 'height', label: 'Height' },
];

const professionalFields = [
  { name: 'bio', label: 'Biography', type: 'textarea' },
  { name: 'experience', label: 'Years of Experience', type: 'number' },
  { name: 'specialties', label: 'Specialties', type: 'text' },
  { name: 'certifications', label: 'Certifications', type: 'text' },
  { name: 'education', label: 'Education', type: 'text' },
  { name: 'reviews', label: 'Reviews', type: 'textarea', readOnly: true },
];

export default function MyInformations() {
  const { updateUser, user } = useUser();
  const { isConnected, checkConnection } = useGoogleCalendar();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const isProfessional = user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER';

  useEffect(() => {
    if (isProfessional) {
      checkConnection();
    }
  }, [isProfessional, checkConnection]);

  // Form for personal information
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      sex: user?.sex || '',
      street: user?.street || '',
      number: user?.number || '',
      zipCode: user?.zipCode || '',
      city: user?.city || '',
      state: user?.state || '',
      birthDate: user?.birthDate || '',
      phone: user?.phone || '',
      currentWeight: user?.currentWeight || '',
      currentBf: user?.currentBf || '',
      height: user?.height || '',
    },
    mode: 'onChange',
  });

  // Form for professional information
  const {
    register: registerProfessional,
    handleSubmit: handleSubmitProfessional,
    formState: {
      errors: professionalErrors,
      isDirty: isProfessionalDirty,
      isValid: isProfessionalValid,
    },
    setValue,
    watch,
  } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(ProfessionalUserSchema),
    defaultValues: {
      bio: user?.bio || '',
      experience: user?.experience || 0,
      specialties: user?.specialties || '',
      certifications: user?.certifications || '',
      education: user?.education || '',
      workStartHour: user?.ProfessionalSettings?.workStartHour || 9,
      workEndHour: user?.ProfessionalSettings?.workEndHour || 17,
      appointmentDuration: user?.ProfessionalSettings?.appointmentDuration || 60,
      workDays: user?.ProfessionalSettings?.workDays || '1,2,3,4,5',
      bufferBetweenSlots: user?.ProfessionalSettings?.bufferBetweenSlots || 0,
      maxAdvanceBooking: user?.ProfessionalSettings?.maxAdvanceBooking || 30,
      autoAcceptMeetings: user?.ProfessionalSettings?.autoAcceptMeetings || false,
      timeZone: user?.ProfessionalSettings?.timeZone || 'America/Sao_Paulo',
    },
    mode: 'onChange',
  });

  const workDaysArray =
    watch('workDays')
      ?.split(',')
      .map((day) => Number.parseInt(day.trim())) || [];

  const handleEditClick = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmitPersonal = async (data: UserFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    const updatedUser: UserType = {
      ...user,
      ...data,
    };

    try {
      await updateUser(updatedUser);
      toast.success('Your personal information has been updated.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitProfessional = async (data: ProfessionalFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    const updatedUser: UserType = {
      ...user,
      bio: data.bio,
      experience: data.experience,
      specialties: data.specialties,
      certifications: data.certifications,
      education: data.education,
      ProfessionalSettings: {
        ...(user.ProfessionalSettings || {}),
        workStartHour: data.workStartHour,
        workEndHour: data.workEndHour,
        appointmentDuration: data.appointmentDuration,
        workDays: data.workDays,
        bufferBetweenSlots: data.bufferBetweenSlots,
        maxAdvanceBooking: data.maxAdvanceBooking,
        autoAcceptMeetings: data.autoAcceptMeetings,
        timeZone: data.timeZone,
      },
    };

    try {
      await updateUser(updatedUser);
      toast.success('Your professional information has been updated.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update your professional information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWorkDay = (day: number) => {
    const currentDays = workDaysArray;

    if (currentDays.includes(day)) {
      // Remove day
      const newDays = currentDays.filter((d) => d !== day);
      setValue('workDays', newDays.join(','));
    } else {
      // Add day
      const newDays = [...currentDays, day].sort();
      setValue('workDays', newDays.join(','));
    }
  };

  return (
    <SiedbarComponent>
      <CardHeader>
        <CardTitle className="flex justify-between">
          My Information
          <HistoryButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isProfessional ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Profile</TabsTrigger>
              <TabsTrigger value="availability">Availability Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <form onSubmit={handleSubmit(onSubmitPersonal)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userFields.map((field) => (
                    <DataCard
                      key={field.name}
                      fieldName={field.name}
                      fieldLabel={field.label}
                      register={register}
                      editMode={editMode}
                      handleEditClick={() => handleEditClick(field.name)}
                      errors={errors}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="professional">
              <form
                onSubmit={handleSubmitProfessional(onSubmitProfessional)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {professionalFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.name}
                          {...registerProfessional(field.name as any)}
                          className={
                            professionalErrors[field.name as keyof ProfessionalFormValues]
                              ? 'border-red-500'
                              : ''
                          }
                          rows={4}
                          readOnly={field.readOnly}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          {...registerProfessional(field.name as any)}
                          className={
                            professionalErrors[field.name as keyof ProfessionalFormValues]
                              ? 'border-red-500'
                              : ''
                          }
                          readOnly={field.readOnly}
                        />
                      )}
                      {professionalErrors[field.name as keyof ProfessionalFormValues] && (
                        <p className="text-sm text-red-500">
                          {
                            professionalErrors[field.name as keyof ProfessionalFormValues]
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      !isProfessionalDirty || !isProfessionalValid || isSubmitting
                    }
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Professional Profile'
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="availability">
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium mb-4">Google Calendar Connection</h3>

                  {!isConnected ? (
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Connect your Google Calendar</AlertTitle>
                      <AlertDescription>
                        To manage your availability and meetings, you need to connect your
                        Google Calendar.
                        <div className="mt-2">
                          <GoogleCalendarConnect />
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <AlertTitle>Google Calendar Connected</AlertTitle>
                      <AlertDescription>
                        Your Google Calendar is connected. Your availability will be
                        synced with your calendar.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator />

                <form
                  onSubmit={handleSubmitProfessional(onSubmitProfessional)}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium">Availability Settings</h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="workStartHour">Work Start Hour</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('workStartHour', Number.parseInt(value))
                        }
                        defaultValue={watch('workStartHour').toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select start hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workEndHour">Work End Hour</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('workEndHour', Number.parseInt(value))
                        }
                        defaultValue={watch('workEndHour').toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select end hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentDuration">
                        Appointment Duration (minutes)
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('appointmentDuration', Number.parseInt(value))
                        }
                        defaultValue={watch('appointmentDuration').toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bufferBetweenSlots">
                        Buffer Between Appointments (minutes)
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue('bufferBetweenSlots', Number.parseInt(value))
                        }
                        defaultValue={watch('bufferBetweenSlots').toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select buffer time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No buffer</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAdvanceBooking">
                        Maximum Days in Advance for Booking
                      </Label>
                      <Input
                        id="maxAdvanceBooking"
                        type="number"
                        min={1}
                        max={365}
                        {...registerProfessional('maxAdvanceBooking', {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <Select
                        onValueChange={(value) => setValue('timeZone', value)}
                        defaultValue={watch('timeZone')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">
                            America/Sao_Paulo
                          </SelectItem>
                          <SelectItem value="America/New_York">
                            America/New_York
                          </SelectItem>
                          <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                          <SelectItem value="America/Denver">America/Denver</SelectItem>
                          <SelectItem value="America/Los_Angeles">
                            America/Los_Angeles
                          </SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Working Days</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                        (day, index) => (
                          <Button
                            key={day}
                            type="button"
                            variant={
                              workDaysArray.includes(index) ? 'default' : 'outline'
                            }
                            className="flex-1"
                            onClick={() => toggleWorkDay(index)}
                          >
                            {day}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoAcceptMeetings"
                      checked={watch('autoAcceptMeetings')}
                      onCheckedChange={(checked) =>
                        setValue('autoAcceptMeetings', checked)
                      }
                    />
                    <Label htmlFor="autoAcceptMeetings">
                      Auto-accept meeting requests
                    </Label>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        !isProfessionalDirty || !isProfessionalValid || isSubmitting
                      }
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Availability Settings'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Regular user view (non-professional)
          <form onSubmit={handleSubmit(onSubmitPersonal)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userFields.map((field) => (
                <DataCard
                  key={field.name}
                  fieldName={field.name}
                  fieldLabel={field.label}
                  register={register}
                  editMode={editMode}
                  handleEditClick={() => handleEditClick(field.name)}
                  errors={errors}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </SiedbarComponent>
  );
}
