'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  Search,
  UserRound,
  Loader2,
  Filter,
  ChevronDown,
  X,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  CircleXIcon as XCircle2,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Star,
  Award,
  GraduationCap,
  Briefcase,
  Settings,
  User,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfessionals } from '@/hooks/professional-hooks'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Professional } from '@/types/ProfessionalType'

const getSpecialtiesArray = (
  specialties: string | string[] | null | undefined
): string[] => {
  if (!specialties) return []
  // If specialties is already an array, return it
  if (Array.isArray(specialties)) {
    return specialties
  }

  // If specialties is a string, split it by comma
  return specialties.split(',').map((s) => s.trim())
}

export default function AdminProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(
    null
  )
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string
  } | null>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processingAction, setProcessingAction] = useState(false)

  // Filter states
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const { getProfessionals, approveProfessional, rejectProfessional } = useProfessionals()

  const { toast } = useToast()
  console.log(professionals)
  useEffect(() => {
    fetchAllProfessionals()
  }, [])

  async function fetchAllProfessionals() {
    try {
      setLoading(true)
      const data = await getProfessionals()
      setProfessionals(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load professionals',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!professionals) {
    return <></>
  }

  // Fixed the flatMap issue by ensuring we're not trying to flatMap null values
  const allSpecialties = Array.from(
    new Set(
      professionals
        .flatMap((p) => (p.specialties ? getSpecialtiesArray(p.specialties) : []))
        .filter(Boolean)
    )
  ).sort()

  const allStatuses = Array.from(
    new Set(professionals.map((p) => p.approvalStatus))
  ).sort()

  // Count active filters
  const activeFilterCount =
    selectedRoles.length + selectedStatuses.length + selectedSpecialties.length

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

  // Reset all filters
  const resetFilters = () => {
    setSelectedRoles([])
    setSelectedStatuses([])
    setSelectedSpecialties([])
  }

  const filteredProfessionals = professionals.filter((professional) => {
    // Search filter
    const searchableText = [
      professional.name,
      professional.email,
      professional.bio,
      professional.city,
      professional.state,
      professional.location,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      searchTerm === '' || searchableText.includes(searchTerm.toLowerCase())

    // Role filter
    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(professional.role)

    // Status filter
    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(professional.approvalStatus)

    // Specialties filter
    const professionalSpecialties = getSpecialtiesArray(professional.specialties)

    const matchesSpecialties =
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some((s) => professionalSpecialties.includes(s))

    return matchesSearch && matchesRole && matchesStatus && matchesSpecialties
  })

  // Separate professionals by approval status
  const approvedProfessionals = filteredProfessionals.filter(
    (p) => p.approvalStatus === 'APPROVED'
  )
  const pendingProfessionals = filteredProfessionals.filter(
    (p) => p.approvalStatus === 'WAITING'
  )
  const rejectedProfessionals = filteredProfessionals.filter(
    (p) => p.approvalStatus === 'REJECTED'
  )

  const handleViewDetails = (professional: Professional) => {
    setSelectedProfessional(professional)
    setDetailsDialogOpen(true)
  }

  const handleViewDocument = (url: string) => {
    setSelectedDocument({ url })
    setDocumentDialogOpen(true)
  }

  const handleApproveClick = (professional: Professional) => {
    setSelectedProfessional(professional)
    setApprovalDialogOpen(true)
  }

  const handleRejectClick = (professional: Professional) => {
    setSelectedProfessional(professional)
    setRejectionDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedProfessional) return

    try {
      setProcessingAction(true)
      await approveProfessional(selectedProfessional.id)

      // Update the professional in the local state
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === selectedProfessional.id ? { ...p, approvalStatus: 'APPROVED' } : p
        )
      )

      toast({
        title: 'Professional Approved',
        description: `${selectedProfessional.name} has been approved successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve professional',
        variant: 'destructive',
      })
    } finally {
      setProcessingAction(false)
      setApprovalDialogOpen(false)
    }
  }

  const handleReject = async () => {
    if (!selectedProfessional || !rejectionReason.trim()) return

    try {
      setProcessingAction(true)
      await rejectProfessional(selectedProfessional.id, rejectionReason)

      // Update the professional in the local state
      setProfessionals((prev) =>
        prev.map((p) =>
          p.id === selectedProfessional.id ? { ...p, approvalStatus: 'REJECTED' } : p
        )
      )

      toast({
        title: 'Professional Rejected',
        description: `${selectedProfessional.name} has been rejected.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject professional',
        variant: 'destructive',
      })
    } finally {
      setProcessingAction(false)
      setRejectionReason('')
      setRejectionDialogOpen(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'NOTSOLICITED':
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-500 border-orange-200"
          >
            Pending
          </Badge>
        )
      case 'APPROVED':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-500 border-green-200"
          >
            Approved
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">
            Rejected
          </Badge>
        )
      case 'WAITING':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">
            Waiting
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatWorkDays = (workDays?: string) => {
    if (!workDays) return 'Not specified'

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const workDaysArray = workDays.split(',').map((day) => Number(day.trim()))

    return workDaysArray.map((day) => days[day]).join(', ')
  }

  const renderProfessionalsTable = (professionals: Professional[]) => {
    if (professionals.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <UserRound className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-medium">No professionals found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Professional</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={professional.imageUrl || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {professional.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{professional.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {professional.email}
                      </div>
                      {professional.phone && (
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {professional.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {professional.role === 'TRAINER'
                      ? 'Personal Trainer'
                      : 'Nutritionist'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {professional.city && professional.state ? (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {professional.city}, {professional.state}
                    </div>
                  ) : professional.location ? (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {professional.location}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  {professional.experience ? (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span>{professional.experience} years</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {getSpecialtiesArray(professional.specialties)
                      .slice(0, 2)
                      .map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    {getSpecialtiesArray(professional.specialties).length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{getSpecialtiesArray(professional.specialties).length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(professional.approvalStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    {new Date(professional.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(professional)}
                      title="View Details"
                      className="hover:bg-primary/5"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {professional.approvalStatus !== 'APPROVED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApproveClick(professional)}
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    {professional.approvalStatus !== 'REJECTED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRejectClick(professional)}
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(professional)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {professional.approvalStatus !== 'APPROVED' && (
                          <DropdownMenuItem
                            className=""
                            onClick={() => handleApproveClick(professional)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Professional
                          </DropdownMenuItem>
                        )}
                        {professional.approvalStatus !== 'REJECTED' && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRejectClick(professional)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Professional
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading professionals data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Management</h1>
          <p className="text-muted-foreground mt-1">
            Review, approve, and manage professional accounts on the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <User className="h-3.5 w-3.5 mr-1.5" />
            {professionals.length} Total Professionals
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200 px-3 py-1 text-sm"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {pendingProfessionals.length} Pending
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-amber-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Pending Approval
            </CardTitle>
            <CardDescription className="text-amber-700">
              Professionals awaiting review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-900">
                {pendingProfessionals.length}
              </div>
              <div className="p-2 bg-amber-200 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <Progress
              value={(pendingProfessionals.length / (professionals.length || 1)) * 100}
              className="h-2 mt-4 bg-amber-200"
            />
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-200 w-full"
              onClick={() =>
                document
                  .querySelector('[value="pending"]')
                  ?.dispatchEvent(new MouseEvent('click'))
              }
            >
              View pending professionals
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-800 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              Approved
            </CardTitle>
            <CardDescription className="text-green-700">
              Active professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-900">
                {approvedProfessionals.length}
              </div>
              <div className="p-2 bg-green-200 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress
              value={(approvedProfessionals.length / (professionals.length || 1)) * 100}
              className="h-2 mt-4 bg-green-200"
            />
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="text-green-700 hover:text-green-900 hover:bg-green-200 w-full"
              onClick={() =>
                document
                  .querySelector('[value="approved"]')
                  ?.dispatchEvent(new MouseEvent('click'))
              }
            >
              View approved professionals
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-800 flex items-center">
              <XCircle2 className="h-5 w-5 mr-2 text-red-600" />
              Rejected
            </CardTitle>
            <CardDescription className="text-red-700">
              Declined applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-900">
                {rejectedProfessionals.length}
              </div>
              <div className="p-2 bg-red-200 rounded-full">
                <XCircle2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <Progress
              value={(rejectedProfessionals.length / (professionals.length || 1)) * 100}
              className="h-2 mt-4 bg-red-200"
            />
          </CardContent>
          <CardFooter className="pt-0">
            <Button
              variant="ghost"
              className="text-red-700 hover:text-red-900 hover:bg-red-200 w-full"
              onClick={() =>
                document
                  .querySelector('[value="rejected"]')
                  ?.dispatchEvent(new MouseEvent('click'))
              }
            >
              View rejected professionals
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/20 p-4 rounded-lg border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, location..."
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
                      {selectedRoles.length > 0 && (
                        <Badge variant="secondary" className="ml-auto mr-2">
                          {selectedRoles.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-TRAINER"
                            checked={selectedRoles.includes('TRAINER')}
                            onCheckedChange={() =>
                              toggleFilter('TRAINER', selectedRoles, setSelectedRoles)
                            }
                          />
                          <Label htmlFor="role-TRAINER" className="flex-1 cursor-pointer">
                            Personal Trainer
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-NUTRITIONIST"
                            checked={selectedRoles.includes('NUTRITIONIST')}
                            onCheckedChange={() =>
                              toggleFilter(
                                'NUTRITIONIST',
                                selectedRoles,
                                setSelectedRoles
                              )
                            }
                          />
                          <Label
                            htmlFor="role-NUTRITIONIST"
                            className="flex-1 cursor-pointer"
                          >
                            Nutritionist
                          </Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Status Filter */}
                  <AccordionItem value="status">
                    <AccordionTrigger className="py-2">
                      Status
                      {selectedStatuses.length > 0 && (
                        <Badge variant="secondary" className="ml-auto mr-2">
                          {selectedStatuses.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1">
                        {allStatuses.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() =>
                                toggleFilter(
                                  status,
                                  selectedStatuses,
                                  setSelectedStatuses
                                )
                              }
                            />
                            <Label
                              htmlFor={`status-${status}`}
                              className="flex-1 cursor-pointer"
                            >
                              {status === 'WAITING'
                                ? 'Waiting'
                                : status === 'APPROVED'
                                  ? 'Approved'
                                  : status === 'REJECTED'
                                    ? 'Rejected'
                                    : status === 'NOTSOLICITED'
                                      ? 'Not Solicited'
                                      : status}
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
                      {selectedSpecialties.length > 0 && (
                        <Badge variant="secondary" className="ml-auto mr-2">
                          {selectedSpecialties.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-1 max-h-[200px] overflow-y-auto pr-2">
                        {allSpecialties.map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
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
        <div className="flex flex-wrap gap-2 mt-4 bg-muted/10 p-3 rounded-md border">
          <div className="text-sm font-medium mr-2 text-muted-foreground">
            Active filters:
          </div>
          {selectedRoles.map((role) => (
            <Badge
              key={`role-${role}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {role === 'TRAINER' ? 'Personal Trainer' : 'Nutritionist'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedRoles(selectedRoles.filter((r) => r !== role))}
              />
            </Badge>
          ))}

          {selectedStatuses.map((status) => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status === 'WAITING'
                ? 'Waiting'
                : status === 'APPROVED'
                  ? 'Approved'
                  : status === 'REJECTED'
                    ? 'Rejected'
                    : status === 'NOTSOLICITED'
                      ? 'Not Solicited'
                      : status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
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

      {/* Professionals Tables */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {pendingProfessionals.length > 0 && (
              <Badge className="ml-2 bg-amber-500">{pendingProfessionals.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            {approvedProfessionals.length > 0 && (
              <Badge className="ml-2">{approvedProfessionals.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            {rejectedProfessionals.length > 0 && (
              <Badge className="ml-2">{rejectedProfessionals.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-amber-700 text-sm">
              These professionals are waiting for your approval. Review their information
              and documents before approving.
            </p>
          </div>
          {renderProfessionalsTable(pendingProfessionals)}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {renderProfessionalsTable(approvedProfessionals)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {renderProfessionalsTable(rejectedProfessionals)}
        </TabsContent>
      </Tabs>

      {/* Professional Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {selectedProfessional && (
            <>
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="text-2xl">Professional Profile</DialogTitle>
                <DialogDescription>
                  Complete professional information and documents
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[calc(90vh-10rem)]">
                <div className="px-6 py-4">
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="info">Information</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="documents">
                        Documents
                        {selectedProfessional.documentUrl && (
                          <Badge variant="secondary" className="ml-2">
                            1
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-6 pt-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center">
                          <Avatar className="h-24 w-24 border-4 border-primary/10">
                            <AvatarImage
                              src={selectedProfessional.imageUrl || undefined}
                            />
                            <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                              {selectedProfessional.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="mt-3 text-center">
                            <Badge className="mt-2">
                              {selectedProfessional.role === 'TRAINER'
                                ? 'Personal Trainer'
                                : 'Nutritionist'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h2 className="text-2xl font-semibold">
                                {selectedProfessional.name}
                              </h2>
                              <p className="text-muted-foreground">
                                {selectedProfessional.email}
                              </p>
                            </div>
                            <div>
                              {getStatusBadge(selectedProfessional.approvalStatus)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Location
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                {selectedProfessional.city && selectedProfessional.state
                                  ? `${selectedProfessional.city}, ${selectedProfessional.state}`
                                  : selectedProfessional.location || 'Not specified'}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">Phone</div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                {selectedProfessional.phone || 'Not specified'}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Experience
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                {selectedProfessional.experience
                                  ? `${selectedProfessional.experience} years`
                                  : 'Not specified'}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">
                                Registration Date
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                {new Date(
                                  selectedProfessional.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-1.5 text-primary" />
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProfessional.specialties &&
                          getSpecialtiesArray(selectedProfessional.specialties).length >
                            0 ? (
                            getSpecialtiesArray(selectedProfessional.specialties).map(
                              (specialty, index) => (
                                <Badge key={index} variant="secondary">
                                  {specialty.trim()}
                                </Badge>
                              )
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No specialties specified
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1.5 text-primary" />
                            Bio
                          </h3>
                          <div className="bg-muted/20 p-4 rounded-md border">
                            {selectedProfessional.bio ? (
                              <p className="text-sm whitespace-pre-line">
                                {selectedProfessional.bio}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No bio provided
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-1.5 text-primary" />
                            Availability
                          </h3>
                          <div className="bg-muted/20 p-4 rounded-md border">
                            {Array.isArray(selectedProfessional.availability) &&
                            selectedProfessional.availability.length > 0 ? (
                              <ul className="text-sm space-y-1 list-disc list-inside">
                                {selectedProfessional.availability.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : selectedProfessional.availability ? (
                              <p className="text-sm">
                                {selectedProfessional.availability}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No availability information provided
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1.5 text-primary" />
                            Certifications
                          </h3>
                          <div className="bg-muted/20 p-4 rounded-md border">
                            {selectedProfessional.certifications &&
                            selectedProfessional.certifications.length > 0 ? (
                              <div className="space-y-3">
                                {selectedProfessional.certifications.map(
                                  (cert, index) => (
                                    <div
                                      key={index}
                                      className="border-b pb-2 last:border-0 last:pb-0"
                                    >
                                      <p className="font-medium">{cert.name}</p>
                                      {(cert.organization || cert.year) && (
                                        <p className="text-sm text-muted-foreground">
                                          {cert.organization}
                                          {cert.organization && cert.year ? ' • ' : ''}
                                          {cert.year}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No certifications provided
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2 flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1.5 text-primary" />
                            Education
                          </h3>
                          <div className="bg-muted/20 p-4 rounded-md border">
                            {selectedProfessional.education &&
                            selectedProfessional.education.length > 0 ? (
                              <ul className="text-sm space-y-1 list-disc list-inside">
                                {selectedProfessional.education.map(
                                  (education, index) => (
                                    <li key={index}>{education.degree}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No education information provided
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedProfessional.reviews &&
                        selectedProfessional.reviews.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2 flex items-center">
                              <Star className="h-4 w-4 mr-1.5 text-primary" />
                              Reviews ({selectedProfessional.reviews.length})
                            </h3>
                            <div className="space-y-3">
                              {selectedProfessional.reviews.slice(0, 3).map((review) => (
                                <Card key={review.id}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarFallback>
                                            {review.author.initials}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">
                                            {review.author.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {new Date(review.date).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < review.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-muted-foreground'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="mt-2 text-sm">{review.content}</p>
                                  </CardContent>
                                </Card>
                              ))}
                              {selectedProfessional.reviews.length > 3 && (
                                <Button variant="outline" className="w-full">
                                  View all {selectedProfessional.reviews.length} reviews
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 pt-4">
                      <div className="bg-muted/10 p-4 rounded-md border">
                        <h3 className="font-medium mb-4 flex items-center">
                          <Settings className="h-4 w-4 mr-1.5 text-primary" />
                          Professional Settings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Working Hours
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings.workStartHour &&
                              selectedProfessional.ProfessionalSettings.workEndHour !==
                                undefined
                                ? `${selectedProfessional.ProfessionalSettings.workStartHour}:00 - ${selectedProfessional.ProfessionalSettings.workEndHour}:00`
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Appointment Duration
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings
                                .appointmentDuration
                                ? `${selectedProfessional.ProfessionalSettings.appointmentDuration} minutes`
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Working Days
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings.workDays
                                ? formatWorkDays(
                                    selectedProfessional.ProfessionalSettings.workDays
                                  )
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Buffer Between Appointments
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings
                                .bufferBetweenSlots !== undefined
                                ? `${selectedProfessional.ProfessionalSettings.bufferBetweenSlots} minutes`
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Maximum Advance Booking
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings.maxAdvanceBooking
                                ? `${selectedProfessional.ProfessionalSettings.maxAdvanceBooking} days`
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Auto-Accept Meetings
                            </div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings
                                .autoAcceptMeetings !== undefined
                                ? selectedProfessional.ProfessionalSettings
                                    .autoAcceptMeetings
                                  ? 'Yes'
                                  : 'No'
                                : 'Not specified'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Time Zone</div>
                            <div className="font-medium">
                              {selectedProfessional.ProfessionalSettings.timeZone ||
                                'Not specified'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="pt-4">
                      {!selectedProfessional.documentUrl ? (
                        <div className="text-center py-8 border rounded-lg bg-muted/20">
                          <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
                          <h3 className="mt-4 text-lg font-medium">
                            No documents uploaded
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            This professional has not uploaded any documents
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-md bg-muted/10">
                            <div className="flex items-center">
                              <div className="p-3 bg-primary/10 rounded-md mr-4">
                                <FileText className="h-8 w-8 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Professional Document</h4>
                                <p className="text-sm text-muted-foreground">
                                  Certification or qualification document
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewDocument(selectedProfessional.documentUrl!)
                              }
                              className="flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View Document
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>

              <DialogFooter className="px-6 py-4 border-t">
                {selectedProfessional.approvalStatus !== 'REJECTED' && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleRejectClick(selectedProfessional)
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Professional
                  </Button>
                )}

                {selectedProfessional.approvalStatus !== 'APPROVED' && (
                  <Button
                    variant="default"
                    className=""
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleApproveClick(selectedProfessional)
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Professional
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <div className="h-[70vh] w-full bg-muted/10 rounded-md flex items-center justify-center">
              <img
                src={selectedDocument.url || '/placeholder.svg'}
                alt="Document"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Professional</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this professional? They will be able to
              offer services on the platform.
            </DialogDescription>
          </DialogHeader>

          {selectedProfessional && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-muted/10 rounded-md border">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={selectedProfessional.imageUrl || undefined} />
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {selectedProfessional.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedProfessional.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfessional.role === 'TRAINER'
                      ? 'Personal Trainer'
                      : 'Nutritionist'}
                  </p>
                  {selectedProfessional.location && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedProfessional.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={processingAction}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} className="" disabled={processingAction}>
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Approval
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Professional</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this professional application.
            </DialogDescription>
          </DialogHeader>

          {selectedProfessional && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-muted/10 rounded-md border mb-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={selectedProfessional.imageUrl || undefined} />
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {selectedProfessional.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedProfessional.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfessional.role === 'TRAINER'
                      ? 'Personal Trainer'
                      : 'Nutritionist'}
                  </p>
                  {selectedProfessional.location && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedProfessional.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please explain why this professional is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialogOpen(false)}
              disabled={processingAction}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={processingAction || !rejectionReason.trim()}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
