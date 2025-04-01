import { useState, useEffect } from 'react'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import useUser from '@/hooks/user-hooks'
import type { UserType } from '@/types/userType'
import { UserSchema } from '@/schemas/UserSchema'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SiedbarComponent from '@/components/sidebar/SiedbarComponent'
import { toast } from 'sonner'
import { Loader2, Info, Calendar, RefreshCw } from 'lucide-react'
import HistoryButton from '@/components/HistoryButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGoogleCalendar } from '@/hooks/use-google-calendar'
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserFormValues = z.infer<typeof UserSchema>

const userFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'sex', label: 'Sex', type: 'text' },
  { name: 'street', label: 'Street', type: 'text' },
  { name: 'number', label: 'Number', type: 'text' },
  { name: 'zipCode', label: 'Zip Code', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'birthDate', label: 'Birth Date', type: 'date' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'currentWeight', label: 'Current Weight', type: 'text' },
  { name: 'currentBf', label: 'Current Body Fat %', type: 'text' },
  { name: 'height', label: 'Height', type: 'text' },
]

const professionalFields = [
  { name: 'bio', label: 'Biography', type: 'textarea' },
  { name: 'experience', label: 'Years of Experience', type: 'number' },
  { name: 'specialties', label: 'Specialties', type: 'text' },
  { name: 'certifications', label: 'Certifications', type: 'text' },
  { name: 'education', label: 'Education', type: 'text' },
  { name: 'reviews', label: 'Reviews', type: 'textarea', readOnly: true },
]

export default function MyInformations() {
  const { updateUser, user } = useUser()
  const { isConnected, checkConnection } = useGoogleCalendar()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [image, setImage] = useState<File | null>(null)

  const isProfessional = user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER'

  useEffect(() => {
    if (isProfessional) {
      checkConnection()
    }
  }, [isProfessional, checkConnection])

  const form = useForm<UserFormValues>({
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
      imageUrl: user?.imageUrl || '',
      useGooglePicture: false,
      profilePictureFile: undefined,

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
  })

  const workDaysArray =
    form
      .watch('workDays')
      ?.split(',')
      .map((day: string) => Number.parseInt(day.trim())) || []

  const onSubmit = async (data: z.infer<typeof UserSchema>) => {
    if (!user) return
    setIsSubmitting(true)

    try {
      const { profilePictureFile, ...userData } = data

      if (image) {
        const result = await updateUser({
          ...userData,
          profilePictureFile: image,
          id: user.id,
        })
        console.log('RESULT:', result)
      } else {
        await updateUser({
          ...userData,
          id: user.id,
        })
      }

      toast.success('Your personal information has been updated.')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update your information.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleWorkDay = (day: number) => {
    const currentDays = workDaysArray

    if (currentDays.includes(day)) {
      const newDays = currentDays.filter((d: number) => d !== day)
      form.setValue('workDays', newDays.join(','))
    } else {
      const newDays = [...currentDays, day].sort()
      form.setValue('workDays', newDays.join(','))
    }
  }

  const useGoogleProfilePicture = async () => {
    if (!user) return

    try {
      setIsSubmitting(true)

      const updatedUser: UserType = {
        ...user,
        useGooglePicture: true,
      }

      await updateUser(updatedUser)
      toast.success('Profile picture updated with Google image')

      form.setValue('profilePictureFile', undefined)
    } catch (error) {
      console.error('Error setting Google profile picture:', error)
      toast.error('Failed to set Google profile picture')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (user?.imageUrl) {
      form.setValue('profilePictureFile', image, {
        shouldValidate: true,
      })
    }
  }, [user, form])

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-24 h-24">
                      {image ? (
                        <AvatarImage src={URL.createObjectURL(image)} />
                      ) : (
                        <AvatarImage src={user?.imageUrl || ''} />
                      )}
                      <AvatarFallback>
                        {user?.name?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <FormField
                      control={form.control}
                      name="profilePictureFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/png"
                              disabled={form.formState.isSubmitting}
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  const file = e.target.files[0]
                                  setImage(file)
                                  field.onChange(file)

                                  form.clearErrors('profilePictureFile')
                                  form.setValue('profilePictureFile', file)
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isConnected && (
                      <div className="flex items-center mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={useGoogleProfilePicture}
                          disabled={isSubmitting}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Use Google Profile Picture
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userFields.map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              <Input type={field.type} {...formField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="min-w-[140px]">
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
              </Form>
            </TabsContent>

            <TabsContent value="professional">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {professionalFields.map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  {...formField}
                                  rows={4}
                                  readOnly={field.readOnly}
                                />
                              ) : (
                                <Input
                                  type={field.type}
                                  {...formField}
                                  readOnly={field.readOnly}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        !form.formState.isDirty || !form.formState.isValid || isSubmitting
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
              </Form>
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

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h3 className="text-lg font-medium">Availability Settings</h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="workStartHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Start Hour</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number.parseInt(value))
                              }
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select start hour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i.toString().padStart(2, '0')}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workEndHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work End Hour</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number.parseInt(value))
                              }
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select end hour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i.toString().padStart(2, '0')}:00
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="appointmentDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Appointment Duration (minutes)</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number.parseInt(value))
                              }
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="90">90 minutes</SelectItem>
                                <SelectItem value="120">120 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bufferBetweenSlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Buffer Between Appointments (minutes)</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number.parseInt(value))
                              }
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select buffer time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">No buffer</SelectItem>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="10">10 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxAdvanceBooking"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Days in Advance for Booking</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={365}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number.parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Zone</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="America/Sao_Paulo">
                                  America/Sao_Paulo
                                </SelectItem>
                                <SelectItem value="America/New_York">
                                  America/New_York
                                </SelectItem>
                                <SelectItem value="America/Chicago">
                                  America/Chicago
                                </SelectItem>
                                <SelectItem value="America/Denver">
                                  America/Denver
                                </SelectItem>
                                <SelectItem value="America/Los_Angeles">
                                  America/Los_Angeles
                                </SelectItem>
                                <SelectItem value="Europe/London">
                                  Europe/London
                                </SelectItem>
                                <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Working Days</FormLabel>
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

                    <FormField
                      control={form.control}
                      name="autoAcceptMeetings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto-accept meeting requests
                            </FormLabel>
                            <FormDescription>
                              Automatically accept meeting requests from clients
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={
                          !form.formState.isDirty ||
                          !form.formState.isValid ||
                          isSubmitting
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
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <FormField
                  control={form.control}
                  name="profilePictureFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={form.formState.isSubmitting}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0]
                              setImage(file)
                              field.onChange(file)

                              // Mark field as valid and touched to remove Required message
                              form.clearErrors('profilePictureFile')
                              form.setValue('profilePictureFile', file, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                              })
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.googleAccessToken && (
                  <div className="flex items-center mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={useGoogleProfilePicture}
                      disabled={isSubmitting}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Use Google Profile Picture
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input type={field.type} {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="min-w-[140px]">
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
          </Form>
        )}
      </CardContent>
    </SiedbarComponent>
  )
}
