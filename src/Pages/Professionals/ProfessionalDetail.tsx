'use client'

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Star,
  Users,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowLeft,
  Edit,
  Save,
  Plus,
  X,
} from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import useUser from '@/hooks/user-hooks'
import type { Professional } from '@/types/ProfessionalType'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useProfessionals } from '@/hooks/professional-hooks'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculateAverageRating } from '@/lib/utils/calculateAverageRating'

const professionalSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.enum(['NUTRITIONIST', 'TRAINER'], {
    required_error: 'Please select a role',
  }),
  city: z.string().optional(),
  experience: z.number().min(0).optional(),
  bio: z.string().optional(),
  helpDescription: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

export default function ProfessionalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, updateUser } = useUser()
  const { getProfessionalById } = useProfessionals()
  const isOwner = user?.id === id

  const [isEditing, setIsEditing] = useState(false)

  const [newInputs, setNewInputs] = useState({
    specialty: '',
    certification: '',
    education: '',
    availability: '',
  })

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: '',
      role: 'NUTRITIONIST',
      city: '',
      experience: 0,
      bio: '',
      helpDescription: '',
      specialties: [],
      certifications: [],
      education: [],
      availability: [],
    },
  })

  useEffect(() => {
    const fetchProfessional = async () => {
      console.log(user?.ProfessionalSettings)
      try {
        setIsLoading(true)
        if (!id) {
          throw new Error('Id is missing')
        }

        const professional = await getProfessionalById(id)
        if (!professional) {
          throw new Error('Professional not found')
        }
        setProfessional(professional)

        // Parse string arrays if they're stored as strings
        const parseStringArray = (value: any) => {
          if (!value) return []
          if (Array.isArray(value)) return value
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value)
              return Array.isArray(parsed) ? parsed : []
            } catch {
              // If it's a string but not JSON, split by commas
              return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
            }
          }
          return []
        }

        form.reset({
          name: professional.name || '',
          role: professional.role || 'NUTRITIONIST',
          city: professional.city || '',
          experience: professional.experience || 0,
          bio: professional.bio || '',
          specialties: parseStringArray(professional.specialties),
          certifications: parseStringArray(professional.certifications),
          education: parseStringArray(professional.education),
          availability: parseStringArray(professional.availability),
        })
      } catch (error) {
        console.error('Error fetching professional:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProfessional()
    }
  }, [])

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    if (professional) {
      // Parse string arrays if they're stored as strings
      const parseStringArray = (value: any) => {
        if (!value) return []
        if (Array.isArray(value)) return value
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
          } catch {
            // If it's a string but not JSON, split by commas
            return value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          }
        }
        return []
      }

      form.reset({
        name: professional.name || '',
        role: professional.role || 'NUTRITIONIST',
        city: professional.city || '',
        experience: professional.experience || 0,
        bio: professional.bio || '',
        specialties: parseStringArray(professional.specialties),
        certifications: parseStringArray(professional.certifications),
        education: parseStringArray(professional.education),
        availability: parseStringArray(professional.availability),
      })
    }

    setNewInputs({
      specialty: '',
      certification: '',
      education: '',
      availability: '',
    })
  }

  const addItemToArray = (
    field: 'specialties' | 'certifications' | 'education' | 'availability',
    inputField: 'specialty' | 'certification' | 'education' | 'availability'
  ) => {
    const value = newInputs[inputField]
    if (!value.trim()) return

    const currentValues = form.getValues(field) || []
    form.setValue(field, [...currentValues, value.trim()], { shouldValidate: true })

    setNewInputs({ ...newInputs, [inputField]: '' })
  }

  const removeItemFromArray = (
    field: 'specialties' | 'certifications' | 'education' | 'availability',
    index: number
  ) => {
    const currentValues = [...(form.getValues(field) || [])]
    currentValues.splice(index, 1)
    form.setValue(field, currentValues, { shouldValidate: true })
  }

  const onSubmit = async (data: ProfessionalFormValues) => {
    try {
      setLoading(true)

      const prepareDataForSubmission = {
        ...data,
        id: id,
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        education: Array.isArray(data.education) ? data.education : [],
        availability: Array.isArray(data.availability) ? data.availability : [],
      }

      const result = await updateUser(prepareDataForSubmission)

      if (result) {
        const updatedProfessional = {
          ...professional,
          ...prepareDataForSubmission,
        } as Professional

        setProfessional(updatedProfessional)
        setIsEditing(false)
        toast.success('Profile updated successfully')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to safely get array data
  const getArrayData = (data: any): string[] => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        // If it's a string but not JSON, split by commas
        return data
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }
    return []
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!professional) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Professional Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The professional you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/professional">View All Professionals</Link>
        </Button>
      </div>
    )
  }

  // Ensure reviews is an array
  const reviews = Array.isArray(professional.reviews) ? professional.reviews : []

  // Get array data safely
  const specialties = getArrayData(professional.specialties)
  const certifications = getArrayData(professional.certifications)
  const education = getArrayData(professional.education)
  const availability = getArrayData(professional.availability)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link to="/professional">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Professionals
          </Link>
        </Button>

        {isOwner &&
          (isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={startEditing}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                      {isEditing && (
                        <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                          <Edit className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                className="mb-1 text-center font-bold"
                                placeholder="Your Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <h1 className="mb-1 text-2xl font-bold">{professional.name}</h1>
                    )}

                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full mb-3">
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NUTRITIONIST">
                                    Nutritionist
                                  </SelectItem>
                                  <SelectItem value="TRAINER">
                                    Personal Trainer
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="mb-3 text-muted-foreground">
                        {professional.role === 'NUTRITIONIST'
                          ? 'Nutritionist'
                          : 'Personal Trainer'}
                      </p>
                    )}

                    <div className="mb-4 flex items-center justify-center">
                      <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {calculateAverageRating(reviews).toFixed(1)}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({reviews.length || 0}{' '}
                        {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>

                    <div className="mb-6 w-full border-t pt-4">
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Your Location"
                                    className="flex-1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span>{professional.city || 'Remote'}</span>
                        )}
                      </div>

                      <div className="mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    placeholder="Years of Experience"
                                    className="flex-1"
                                    min="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span>{professional.experience || 0} years experience</span>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate(`/professional-plans/${id}`)}
                      disabled={loading}
                      type="button"
                    >
                      {loading
                        ? 'Sending Request...'
                        : isOwner
                          ? 'See My Plans'
                          : 'Hire Professional'}
                    </Button>

                    <Button variant="outline" className="mt-3 w-full" type="button">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Availability</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                {(field.value || []).map((day, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                      value={day}
                                      onChange={(e) => {
                                        const updatedAvailability = [
                                          ...(field.value || []),
                                        ]
                                        updatedAvailability[index] = e.target.value
                                        field.onChange(updatedAvailability)
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeItemFromArray('availability', index)
                                      }
                                      className="h-8 w-8"
                                      type="button"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <div className="flex items-center gap-2 mt-2">
                                  <Input
                                    value={newInputs.availability}
                                    onChange={(e) =>
                                      setNewInputs({
                                        ...newInputs,
                                        availability: e.target.value,
                                      })
                                    }
                                    placeholder="Add availability (e.g., Monday 9AM-5PM)"
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      addItemToArray('availability', 'availability')
                                    }
                                    disabled={!newInputs.availability.trim()}
                                    type="button"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availability.length > 0 ? (
                        availability.map((day, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{day}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Contact for availability</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Specialties</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="specialties"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(field.value || []).map((specialty, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="flex items-center gap-1"
                                    >
                                      {specialty}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          removeItemFromArray('specialties', index)
                                        }
                                        className="h-4 w-4 p-0 ml-1"
                                        type="button"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={newInputs.specialty}
                                    onChange={(e) =>
                                      setNewInputs({
                                        ...newInputs,
                                        specialty: e.target.value,
                                      })
                                    }
                                    placeholder="Add specialty"
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      addItemToArray('specialties', 'specialty')
                                    }
                                    disabled={!newInputs.specialty.trim()}
                                    type="button"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {specialties.length > 0 ? (
                        specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No specialties listed</p>
                      )}
                    </div>
                  )}
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
                      {isEditing ? (
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Write your bio here..."
                                  className="mb-6"
                                  rows={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <p className="mb-6 text-muted-foreground leading-relaxed">
                          {professional.bio || 'No bio available.'}
                        </p>
                      )}

                      <h3 className="mb-3 text-lg font-semibold">Certifications</h3>
                      {isEditing ? (
                        <div className="mb-6 space-y-2">
                          <FormField
                            control={form.control}
                            name="certifications"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <>
                                    {(field.value || []).map((cert, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 mb-2"
                                      >
                                        <CheckCircle className="mt-2 h-4 w-4 text-green-500 flex-shrink-0" />
                                        <Input
                                          value={cert}
                                          onChange={(e) => {
                                            const updatedCerts = [...(field.value || [])]
                                            updatedCerts[index] = e.target.value
                                            field.onChange(updatedCerts)
                                          }}
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            removeItemFromArray('certifications', index)
                                          }
                                          className="h-8 w-8"
                                          type="button"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <div className="flex items-center gap-2 mt-3">
                                      <Input
                                        value={newInputs.certification}
                                        onChange={(e) =>
                                          setNewInputs({
                                            ...newInputs,
                                            certification: e.target.value,
                                          })
                                        }
                                        placeholder="Add certification"
                                        className="flex-1"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          addItemToArray(
                                            'certifications',
                                            'certification'
                                          )
                                        }
                                        disabled={!newInputs.certification.trim()}
                                        type="button"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <ul className="mb-6 space-y-2">
                          {certifications.length > 0 ? (
                            certifications.map((cert, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="mt-1 h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>
                                  {typeof cert === 'string'
                                    ? cert
                                    : `${cert.name} - ${cert.organization} (${cert.year})`}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground">
                              No certifications listed
                            </li>
                          )}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="mb-4 text-xl font-semibold">Education & Training</h2>

                      {isEditing ? (
                        <div className="space-y-3 mb-6">
                          <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <>
                                    {(field.value || []).map((edu, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 border-l-2 border-primary/20 pl-4 mb-2"
                                      >
                                        <Input
                                          value={
                                            typeof edu === 'string'
                                              ? edu
                                              : `${edu.degree} - ${edu.institution} (${edu.year})`
                                          }
                                          onChange={(e) => {
                                            const updatedEducation = [
                                              ...(field.value || []),
                                            ]
                                            updatedEducation[index] = e.target.value
                                            field.onChange(updatedEducation)
                                          }}
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            removeItemFromArray('education', index)
                                          }
                                          className="h-8 w-8"
                                          type="button"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <div className="flex items-center gap-2 mt-3">
                                      <Input
                                        value={newInputs.education}
                                        onChange={(e) =>
                                          setNewInputs({
                                            ...newInputs,
                                            education: e.target.value,
                                          })
                                        }
                                        placeholder="Add education"
                                        className="flex-1"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          addItemToArray('education', 'education')
                                        }
                                        disabled={!newInputs.education.trim()}
                                        type="button"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {education.length > 0 ? (
                            education.map((edu, index) => (
                              <div
                                key={index}
                                className="border-l-2 border-primary/20 pl-4"
                              >
                                <h3 className="font-medium">
                                  {typeof edu === 'string'
                                    ? edu
                                    : `${edu.degree} - ${edu.institution} (${edu.year})`}
                                </h3>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">
                              No education information available
                            </p>
                          )}
                        </div>
                      )}

                      <h2 className="mb-4 mt-8 text-xl font-semibold">
                        Professional Experience
                      </h2>
                      {isEditing ? (
                        <div className="border-l-2 border-primary/20 pl-4">
                          <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem className="mb-2">
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger className="w-full mb-2">
                                      <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="NUTRITIONIST">
                                        Nutritionist
                                      </SelectItem>
                                      <SelectItem value="TRAINER">
                                        Personal Trainer
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      placeholder="Years of Experience"
                                      className="w-32"
                                      min="0"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <span className="text-sm text-muted-foreground">
                              years of experience
                            </span>
                          </div>
                        </div>
                      ) : (
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
                      )}
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
                                  reviews.length > 0 &&
                                  star <= calculateAverageRating(reviews)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-muted text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">
                            {reviews.length > 0
                              ? `${calculateAverageRating(reviews).toFixed(1)} (${reviews.length})`
                              : 'No reviews yet'}
                          </span>
                        </div>
                      </div>

                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review, index) => (
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
        </form>
      </Form>
    </>
  )
}
