import type { ChangeEvent } from 'react'

import { useState, useReducer } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Dumbbell,
  Utensils,
  Upload,
  Loader2,
  FileText,
  X,
  Plus,
  Calendar,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useProfessionals } from '@/hooks/professional-hooks'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
]

const professionalFormSchema = z.object({
  role: z.enum(['TRAINER', 'NUTRITIONIST'], {
    required_error: 'Please select a professional role',
  }),
  bio: z
    .string()
    .min(50, {
      message: 'Bio must be at least 50 characters',
    })
    .max(500, {
      message: 'Bio cannot exceed 500 characters',
    }),
  experience: z.coerce.number().min(0, {
    message: 'Experience must be a positive number',
  }),
  specialties: z.array(z.string()).min(1, 'Add at least one specialty'),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, 'Certification name is required'),
        organization: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .min(1, 'Add at least one certification'),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'Degree/qualification is required'),
        institution: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .min(1, 'Add at least one education entry'),
  availability: z.string().min(5, {
    message: 'Please describe your availability',
  }),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: 'You must accept the terms and conditions',
  }),
  workStartHour: z.coerce.number().min(0).max(23),
  workEndHour: z.coerce.number().min(0).max(23),
  appointmentDuration: z.coerce.number().min(15),
  workDays: z.string(),
  bufferBetweenSlots: z.coerce.number().min(0),
  maxAdvanceBooking: z.coerce.number().min(1).max(365),
  autoAcceptMeetings: z.boolean(),
  timeZone: z.string(),
  documentName: z.string().min(1, 'Document name is required'),
  documentDescription: z.string().optional(),
})

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>

type FormInputState = {
  newSpecialty: string
  newCertName: string
  newCertOrg: string
  newCertYear: string
  newEduDegree: string
  newEduInstitution: string
  newEduYear: string
}

type FormInputAction =
  | {
      type: 'SET_FIELD'
      field: keyof FormInputState
      value: string
    }
  | {
      type: 'RESET_CERTIFICATION'
    }
  | {
      type: 'RESET_EDUCATION'
    }

const formInputReducer = (
  state: FormInputState,
  action: FormInputAction
): FormInputState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET_CERTIFICATION':
      return {
        ...state,
        newCertName: '',
        newCertOrg: '',
        newCertYear: '',
      }
    case 'RESET_EDUCATION':
      return {
        ...state,
        newEduDegree: '',
        newEduInstitution: '',
        newEduYear: '',
      }
    default:
      return state
  }
}

export default function ProfessionalRegistrationForm() {
  // Reduced number of useState hooks by using useReducer
  const [formInputs, dispatch] = useReducer(formInputReducer, {
    newSpecialty: '',
    newCertName: '',
    newCertOrg: '',
    newCertYear: '',
    newEduDegree: '',
    newEduInstitution: '',
    newEduYear: '',
  })

  // Remaining useState hooks for more complex state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentError, setDocumentError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { toast } = useToast()
  const { registerProfessional } = useProfessionals()

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      role: 'TRAINER',
      bio: '',
      experience: 0,
      specialties: [],
      certifications: [],
      education: [],
      availability: '',
      acceptTerms: false,
      workStartHour: 9,
      workEndHour: 17,
      appointmentDuration: 60,
      workDays: '1,2,3,4,5',
      bufferBetweenSlots: 0,
      maxAdvanceBooking: 30,
      autoAcceptMeetings: false,
      timeZone: 'America/Sao_Paulo',
      documentName: '',
      documentDescription: '',
    },
  })

  const workDaysArray =
    form
      .watch('workDays')
      ?.split(',')
      .map((day: string) => Number.parseInt(day.trim())) || []

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setDocumentError('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
      setDocumentError('File must be PDF, JPEG, or PNG')
      return
    }

    setDocumentError(null)
    setDocumentFile(file)

    // Update form values
    form.setValue('documentName', file.name)

    // Reset file input
    if (e.target) {
      e.target.value = ''
    }
  }

  // Add specialty - now using string array
  const addSpecialty = () => {
    if (!formInputs.newSpecialty.trim()) return

    const currentSpecialties = form.getValues('specialties') || []
    form.setValue('specialties', [...currentSpecialties, formInputs.newSpecialty.trim()])
    dispatch({ type: 'SET_FIELD', field: 'newSpecialty', value: '' })
  }

  // Remove specialty - now using string array
  const removeSpecialty = (index: number) => {
    const currentSpecialties = form.getValues('specialties') || []
    form.setValue(
      'specialties',
      currentSpecialties.filter((_, i) => i !== index)
    )
  }

  // Add certification
  const addCertification = () => {
    if (!formInputs.newCertName.trim()) return

    const currentCertifications = form.getValues('certifications') || []
    form.setValue('certifications', [
      ...currentCertifications,
      {
        name: formInputs.newCertName.trim(),
        organization: formInputs.newCertOrg.trim() || undefined,
        year: formInputs.newCertYear.trim() || undefined,
      },
    ])
    dispatch({ type: 'RESET_CERTIFICATION' })
  }

  // Remove certification
  const removeCertification = (index: number) => {
    const currentCertifications = form.getValues('certifications') || []
    form.setValue(
      'certifications',
      currentCertifications.filter((_, i) => i !== index)
    )
  }

  // Add education
  const addEducation = () => {
    if (!formInputs.newEduDegree.trim()) return

    const currentEducation = form.getValues('education') || []
    form.setValue('education', [
      ...currentEducation,
      {
        degree: formInputs.newEduDegree.trim(),
        institution: formInputs.newEduInstitution.trim() || undefined,
        year: formInputs.newEduYear.trim() || undefined,
      },
    ])
    dispatch({ type: 'RESET_EDUCATION' })
  }

  // Remove education
  const removeEducation = (index: number) => {
    const currentEducation = form.getValues('education') || []
    form.setValue(
      'education',
      currentEducation.filter((_, i) => i !== index)
    )
  }

  // Toggle work day
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

  async function onSubmit(data: ProfessionalFormValues) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append('role', data.role)
      formData.append('bio', data.bio)
      formData.append('experience', data.experience.toString())
      formData.append('availability', data.availability)

      // Updated to handle string array for specialties
      formData.append('specialties', JSON.stringify(data.specialties))
      formData.append('certifications', JSON.stringify(data.certifications))
      formData.append('education', JSON.stringify(data.education))

      // Add professional settings data
      formData.append('workStartHour', data.workStartHour.toString())
      formData.append('workEndHour', data.workEndHour.toString())
      formData.append('appointmentDuration', data.appointmentDuration.toString())
      formData.append('workDays', data.workDays)
      formData.append('bufferBetweenSlots', data.bufferBetweenSlots.toString())
      formData.append('maxAdvanceBooking', data.maxAdvanceBooking.toString())
      formData.append('autoAcceptMeetings', data.autoAcceptMeetings.toString())
      formData.append('timeZone', data.timeZone)

      if (imageFile) {
        formData.append('profileImage', imageFile)
      }

      if (documentFile) {
        formData.append('document', documentFile)
      }

      const result = await registerProfessional(formData)

      if (result.success) {
        toast({
          title: 'Application Submitted',
          description: 'Your professional application has been submitted for review.',
        })

        navigate('/register-professional/success')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while submitting your application',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* Basic Information Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Professional Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="TRAINER" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Dumbbell className="mr-2 h-4 w-4" />
                          Personal Trainer
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="NUTRITIONIST" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Utensils className="mr-2 h-4 w-4" />
                          Nutritionist
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself, your approach, and your professional philosophy..."
                      className={cn(
                        'min-h-[120px]',
                        fieldState.error && 'border-red-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your public profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      className={cn(fieldState.error && 'border-red-500')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Qualifications Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Qualifications</h2>
          <div className="space-y-6">
            {/* Specialties Section - Updated for string array */}
            <FormField
              control={form.control}
              name="specialties"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormDescription>
                    Add your areas of specialization (e.g., Weight Loss, Strength
                    Training, Sports Nutrition)
                  </FormDescription>

                  {/* Display added specialties */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {field.value.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {specialty}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 ml-2 p-0"
                          onClick={() => removeSpecialty(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  {/* Add new specialty */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a specialty..."
                      value={formInputs.newSpecialty}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_FIELD',
                          field: 'newSpecialty',
                          value: e.target.value,
                        })
                      }
                      className={cn('flex-1', fieldState.error && 'border-red-500')}
                    />
                    <Button
                      type="button"
                      onClick={addSpecialty}
                      disabled={!formInputs.newSpecialty.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certifications Section */}
            <FormField
              control={form.control}
              name="certifications"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <FormDescription>Add your professional certifications</FormDescription>

                  {/* Display added certifications */}
                  <div className="space-y-3 mb-4">
                    {field.value.map((cert, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-md bg-muted/20"
                      >
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          {(cert.organization || cert.year) && (
                            <p className="text-sm text-muted-foreground">
                              {cert.organization}
                              {cert.organization && cert.year ? ' • ' : ''}
                              {cert.year}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add new certification */}
                  <Card className={cn(fieldState.error && 'border-red-500')}>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <FormLabel htmlFor="cert-name">Certification Name*</FormLabel>
                        <Input
                          id="cert-name"
                          placeholder="e.g., Personal Trainer Certification"
                          value={formInputs.newCertName}
                          onChange={(e) =>
                            dispatch({
                              type: 'SET_FIELD',
                              field: 'newCertName',
                              value: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormLabel htmlFor="cert-org">Issuing Organization</FormLabel>
                          <Input
                            id="cert-org"
                            placeholder="e.g., ACE, NASM"
                            value={formInputs.newCertOrg}
                            onChange={(e) =>
                              dispatch({
                                type: 'SET_FIELD',
                                field: 'newCertOrg',
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <FormLabel htmlFor="cert-year">Year</FormLabel>
                          <Input
                            id="cert-year"
                            placeholder="e.g., 2022"
                            value={formInputs.newCertYear}
                            onChange={(e) =>
                              dispatch({
                                type: 'SET_FIELD',
                                field: 'newCertYear',
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addCertification}
                        disabled={!formInputs.newCertName.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certification
                      </Button>
                    </CardContent>
                  </Card>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Education Section */}
            <FormField
              control={form.control}
              name="education"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormDescription>Add your educational background</FormDescription>

                  {/* Display added education */}
                  <div className="space-y-3 mb-4">
                    {field.value.map((edu, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-md bg-muted/20"
                      >
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          {(edu.institution || edu.year) && (
                            <p className="text-sm text-muted-foreground">
                              {edu.institution}
                              {edu.institution && edu.year ? ' • ' : ''}
                              {edu.year}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Add new education */}
                  <Card className={cn(fieldState.error && 'border-red-500')}>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <FormLabel htmlFor="edu-degree">Degree/Qualification*</FormLabel>
                        <Input
                          id="edu-degree"
                          placeholder="e.g., Bachelor of Science in Nutrition"
                          value={formInputs.newEduDegree}
                          onChange={(e) =>
                            dispatch({
                              type: 'SET_FIELD',
                              field: 'newEduDegree',
                              value: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormLabel htmlFor="edu-institution">Institution</FormLabel>
                          <Input
                            id="edu-institution"
                            placeholder="e.g., University of California"
                            value={formInputs.newEduInstitution}
                            onChange={(e) =>
                              dispatch({
                                type: 'SET_FIELD',
                                field: 'newEduInstitution',
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <FormLabel htmlFor="edu-year">Year</FormLabel>
                          <Input
                            id="edu-year"
                            placeholder="e.g., 2020"
                            value={formInputs.newEduYear}
                            onChange={(e) =>
                              dispatch({
                                type: 'SET_FIELD',
                                field: 'newEduYear',
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addEducation}
                        disabled={!formInputs.newEduDegree.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Education
                      </Button>
                    </CardContent>
                  </Card>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Document Section - Modified for single document */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Document Upload</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Upload Document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please upload your professional document, certification, diploma, or any
                other relevant documentation.
              </p>
            </div>

            {/* Document upload form */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="documentName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Document Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Personal Trainer Certification"
                          className={cn(fieldState.error && 'border-red-500')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Issued by ACE in 2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-2">
                  <FormLabel htmlFor="document-file">Document File*</FormLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id="document-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentChange}
                      className="flex-1"
                    />
                  </div>
                  <FormDescription>
                    Accepted formats: PDF, JPEG, PNG. Max size: 5MB.
                  </FormDescription>
                </div>

                {documentError && (
                  <Alert variant="destructive">
                    <AlertDescription>{documentError}</AlertDescription>
                  </Alert>
                )}

                {documentFile && (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/20">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          {form.getValues('documentName') || documentFile.name}
                        </p>
                        {form.getValues('documentDescription') && (
                          <p className="text-xs text-muted-foreground">
                            {form.getValues('documentDescription')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocumentFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Availability Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Availability</h2>
          <div className="space-y-6">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Availability Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure your working hours and appointment settings. This information
                will be used to determine your availability for client bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="workStartHour"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Work Start Hour</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && 'border-red-500')}
                        >
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
                    <FormDescription>The hour you start working each day</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workEndHour"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Work End Hour</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && 'border-red-500')}
                        >
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
                    <FormDescription>
                      The hour you finish working each day
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentDuration"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Appointment Duration (minutes)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && 'border-red-500')}
                        >
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
                    <FormDescription>
                      Standard length of your client appointments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bufferBetweenSlots"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Buffer Between Appointments (minutes)</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && 'border-red-500')}
                        >
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
                    <FormDescription>
                      Time between consecutive appointments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAdvanceBooking"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Maximum Days in Advance for Booking</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        className={cn(fieldState.error && 'border-red-500')}
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      How far in advance clients can book appointments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeZone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(fieldState.error && 'border-red-500')}
                        >
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">
                          America/Sao_Paulo
                        </SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                        <SelectItem value="America/Denver">America/Denver</SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          America/Los_Angeles
                        </SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Your local time zone for scheduling</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Working Days</FormLabel>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Button
                    key={day}
                    type="button"
                    variant={workDaysArray.includes(index) ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => toggleWorkDay(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <FormDescription>
                Select the days of the week you are available to work
              </FormDescription>
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
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Profile & Submit Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Profile & Submit</h2>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="availability"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your availability (days, hours, remote/in-person)..."
                      className={cn(
                        'min-h-[100px]',
                        fieldState.error && 'border-red-500'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Profile Image</FormLabel>
              <Card className="border-dashed">
                <CardContent className="pt-5 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 mb-4">
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('profile-image')?.click()}
                    >
                      Select Image
                    </Button>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload a professional photo for your profile
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field, fieldState }) => (
                <FormItem
                  className={cn(
                    'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4',
                    fieldState.error && 'border-red-500'
                  )}
                >
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormDescription>
                      I agree to the terms of service and privacy policy. I certify that
                      all information provided is accurate and complete.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  )
}
