'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  UserRound,
  MapPin,
  Star,
  ArrowUpRight,
  X,
  ChevronDown,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { Professional } from '@/types/ProfessionalType'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { calculateAverageRating } from '@/lib/utils/calculateAverageRating'
import { useProfessionals } from '@/hooks/professional-hooks'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useUser from '@/hooks/user-hooks'

export default function ProfessionalsList() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useUser()

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [isRemoteOnly, setIsRemoteOnly] = useState<boolean | null>(null)

  const { getProfessionals } = useProfessionals()

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true)
        const professionalsData = await getProfessionals()
        setProfessionals(professionalsData)
      } catch (error) {
        console.error('Error fetching professionals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessionals()
  }, [])

  // Extract unique values for filters
  const allSpecialties = new Set<string>()
  const allRoles = new Set<string>()
  const allLocations = new Set<string>()

  professionals?.map((professional) => {
    // Add role
    if (professional.role) {
      allRoles.add(
        professional.role === 'NUTRITIONIST' ? 'Nutritionist' : 'Personal Trainer'
      )
    }

    // Add location
    if (professional.location && professional.location !== 'Remote') {
      allLocations.add(professional.location)
    }

    // Add specialties
    if (Array.isArray(professional.specialties)) {
      professional.specialties.map((spec) => allSpecialties.add(spec))
    }
    if (professional.specialty) {
      allSpecialties.add(professional.specialty)
    }
  })

  // Convert to sorted arrays
  const specialtyOptions = Array.from(allSpecialties).sort()
  const roleOptions = Array.from(allRoles).sort()
  const locationOptions = Array.from(allLocations).sort()

  // Count active filters
  const activeFilterCount =
    selectedSpecialties.length +
    selectedRoles.length +
    selectedLocations.length +
    (isRemoteOnly !== null ? 1 : 0)

  const filteredProfessionals = professionals?.filter((professional) => {
    // Search in name, specialty, and specialties array
    const searchableText = [
      professional.name,
      professional.specialty,
      ...(professional.specialties || []),
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase())

    // Check if matches selected specialties
    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some(
        (spec) =>
          professional.specialty === spec ||
          (Array.isArray(professional.specialties) &&
            professional.specialties.includes(spec))
      )

    // Check if matches selected roles
    const professionalRole =
      professional.role === 'NUTRITIONIST' ? 'Nutritionist' : 'Personal Trainer'
    const matchesRoles =
      selectedRoles.length === 0 || selectedRoles.includes(professionalRole)

    // Check if matches selected locations
    const matchesLocations =
      selectedLocations.length === 0 ||
      (professional.location && selectedLocations.includes(professional.location))

    // Check if matches remote filter
    const matchesRemote =
      isRemoteOnly === null ||
      (isRemoteOnly === true && professional.location === 'Remote') ||
      (isRemoteOnly === false && professional.location !== 'Remote')

    return (
      matchesSearch &&
      matchesSpecialties &&
      matchesRoles &&
      matchesLocations &&
      matchesRemote
    )
  })

  // Reset all filters
  const resetFilters = () => {
    setSelectedSpecialties([])
    setSelectedRoles([])
    setSelectedLocations([])
    setIsRemoteOnly(null)
  }

  // Toggle a filter value
  const toggleFilter = (
    value: string,
    currentValues: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentValues.includes(value)) {
      setValues(currentValues.filter((v) => v !== value))
    } else {
      setValues([...currentValues, value])
    }
  }

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Our Professional Team</ContainerTitle>
      </ContainerHeader>
      <ContainerContent>
        <section className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search professionals..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="h-8 text-xs"
                        >
                          Reset all
                        </Button>
                      )}
                    </div>

                    <Accordion type="multiple" className="w-full">
                      {/* Role Filter */}
                      <AccordionItem value="role">
                        <AccordionTrigger className="py-2">
                          Professional Type
                          {selectedRoles?.length > 0 && (
                            <Badge variant="secondary" className="ml-auto mr-2">
                              {selectedRoles.length}
                            </Badge>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1">
                            {roleOptions.map((role) => (
                              <div key={role} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`role-${role}`}
                                  checked={selectedRoles.includes(role)}
                                  onCheckedChange={() =>
                                    toggleFilter(role, selectedRoles, setSelectedRoles)
                                  }
                                />
                                <Label
                                  htmlFor={`role-${role}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  {role}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="location">
                        <AccordionTrigger className="py-2">
                          Location
                          {(selectedLocations?.length > 0 || isRemoteOnly !== null) && (
                            <Badge variant="secondary" className="ml-auto mr-2">
                              {selectedLocations.length + (isRemoteOnly !== null ? 1 : 0)}
                            </Badge>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center space-x-2 pb-2 border-b">
                              <Checkbox
                                id="remote-only"
                                checked={isRemoteOnly === true}
                                onCheckedChange={(checked) => {
                                  if (checked === true) {
                                    setIsRemoteOnly(true)
                                    setSelectedLocations([]) // Clear locations when remote is selected
                                  } else {
                                    setIsRemoteOnly(null)
                                  }
                                }}
                              />
                              <Label
                                htmlFor="remote-only"
                                className="flex-1 cursor-pointer"
                              >
                                Remote Only
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2 pb-2 border-b">
                              <Checkbox
                                id="in-person-only"
                                checked={isRemoteOnly === false}
                                onCheckedChange={(checked) => {
                                  if (checked === true) {
                                    setIsRemoteOnly(false)
                                  } else {
                                    setIsRemoteOnly(null)
                                  }
                                }}
                              />
                              <Label
                                htmlFor="in-person-only"
                                className="flex-1 cursor-pointer"
                              >
                                In-Person Only
                              </Label>
                            </div>

                            {isRemoteOnly !== true &&
                              locationOptions.map((location) => (
                                <div
                                  key={location}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`location-${location}`}
                                    checked={selectedLocations.includes(location)}
                                    onCheckedChange={() =>
                                      toggleFilter(
                                        location,
                                        selectedLocations,
                                        setSelectedLocations
                                      )
                                    }
                                    disabled={isRemoteOnly === true}
                                  />
                                  <Label
                                    htmlFor={`location-${location}`}
                                    className={`flex-1 cursor-pointer ${isRemoteOnly === true ? 'text-muted-foreground' : ''}`}
                                  >
                                    {location}
                                  </Label>
                                </div>
                              ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Specialties Filter */}
                      <AccordionItem value="specialties">
                        <AccordionTrigger className="py-2">
                          Specialties
                          {selectedSpecialties?.length > 0 && (
                            <Badge variant="secondary" className="ml-auto mr-2">
                              {selectedSpecialties.length}
                            </Badge>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1 max-h-[200px] overflow-y-auto pr-2">
                            {specialtyOptions.map((specialty) => (
                              <div
                                key={specialty}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`specialty-${specialty}`}
                                  checked={selectedSpecialties.includes(specialty)}
                                  onCheckedChange={() =>
                                    toggleFilter(
                                      specialty,
                                      selectedSpecialties,
                                      setSelectedSpecialties
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`specialty-${specialty}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  {specialty}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedRoles.map((role) => (
                <Badge
                  key={`role-${role}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {role}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setSelectedRoles(selectedRoles.filter((r) => r !== role))
                    }
                  />
                </Badge>
              ))}

              {isRemoteOnly === true && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setIsRemoteOnly(null)}
                  />
                </Badge>
              )}

              {isRemoteOnly === false && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In-Person Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setIsRemoteOnly(null)}
                  />
                </Badge>
              )}

              {selectedLocations.map((location) => (
                <Badge
                  key={`location-${location}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setSelectedLocations(
                        selectedLocations.filter((l) => l !== location)
                      )
                    }
                  />
                </Badge>
              ))}

              {selectedSpecialties.map((specialty) => (
                <Badge
                  key={`specialty-${specialty}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {specialty}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setSelectedSpecialties(
                        selectedSpecialties.filter((s) => s !== specialty)
                      )
                    }
                  />
                </Badge>
              ))}

              {activeFilterCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </section>

        {loading ? (
          <LoadingSpinner />
        ) : filteredProfessionals?.length === 0 ? (
          <div className="rounded-lg bg-primary/5 p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold">No professionals found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals?.map((professional) => (
              <Card
                key={professional.id}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <div className="aspect-video bg-muted relative">
                  {professional.imageUrl ? (
                    <img
                      src={professional.imageUrl || '/placeholder.svg'}
                      alt={professional.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      <UserRound className="h-16 w-16 text-primary/50" />
                    </div>
                  )}
                  {professional.available && (
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                      Available
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{professional.name}</h3>
                      <p className="text-muted-foreground">
                        {professional.role === 'NUTRITIONIST'
                          ? 'Nutritionist'
                          : 'Personal Trainer'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {professional.reviews && professional.reviews.length > 0
                          ? calculateAverageRating(professional.reviews).toFixed(1)
                          : '0.0'}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({professional.reviews?.length || 0}{' '}
                        {professional.reviews?.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.location || 'Remote'}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      {professional.experience} years of experience
                    </p>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {professional.specialties?.map((spec, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`bg-primary/5 ${selectedSpecialties.includes(spec) ? 'border-primary text-primary' : ''}`}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/professionals/${professional.id}`}>
                      View Profile
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
        {user && (
          <section className="mt-16 rounded-lg bg-primary/10 p-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">
              Join Our Professional Team
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
              Are you a fitness professional looking to expand your client base? Join our
              platform and connect with motivated clients.
            </p>
            <Button asChild size="lg">
              <Link to="/professionals/register-professional">
                Apply as a Professional
              </Link>
            </Button>
          </section>
        )}
      </ContainerContent>
    </>
  )
}
