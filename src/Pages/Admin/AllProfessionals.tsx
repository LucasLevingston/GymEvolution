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
} from '@/components/ui/card'

type Professional = {
  id: string
  name: string
  email: string
  role: string
  bio: string
  experience: number
  specialties: string[] | string
  certifications: string | any[]
  education: string | any[]
  availability: string | string[]
  imageUrl: string | null
  location: string | null
  approvalStatus: string
  createdAt: string
  documents: {
    id: string
    name: string
    url: string
    description: string
    type: string
  }[]
}

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
    type: string
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

  useEffect(() => {
    fetchAllProfessionals()
  }, [])

  async function fetchAllProfessionals() {
    try {
      setLoading(true)
      const data = await getProfessionals()
      console.log(data)
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

  const allSpecialties = Array.from(
    new Set(professionals.flatMap((p) => getSpecialtiesArray(p.specialties)))
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
    const searchableText = [professional.name, professional.email, professional.bio]
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
    (p) => p.approvalStatus === 'PENDING' || p.approvalStatus === 'WAITING'
  )
  const rejectedProfessionals = filteredProfessionals.filter(
    (p) => p.approvalStatus === 'REJECTED'
  )

  const handleViewDetails = (professional: Professional) => {
    setSelectedProfessional(professional)
    setDetailsDialogOpen(true)
  }

  const handleViewDocument = (url: string, type: string) => {
    setSelectedDocument({ url, type })
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={professional.imageUrl || undefined} />
                      <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{professional.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {professional.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {professional.role === 'TRAINER' ? 'Personal Trainer' : 'Nutritionist'}
                </TableCell>
                <TableCell>{professional.experience} years</TableCell>
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
                  {new Date(professional.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(professional)}
                      title="View Details"
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {professional.approvalStatus !== 'APPROVED' && (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleApproveClick(professional)}
                          >
                            Approve Professional
                          </DropdownMenuItem>
                        )}
                        {professional.approvalStatus !== 'REJECTED' && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleRejectClick(professional)}
                          >
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Professional Management</h1>
        <Badge variant="outline">{professionals.length} Total Professionals</Badge>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                              {status}
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
        <div className="flex flex-wrap gap-2 mt-4">
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
              {status}
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

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Approval</CardTitle>
            <CardDescription>Professionals awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{pendingProfessionals.length}</div>
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
            <CardDescription>Active professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{approvedProfessionals.length}</div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
            <CardDescription>Declined applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{rejectedProfessionals.length}</div>
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle2 className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professionals Tables */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {pendingProfessionals.length > 0 && (
              <Badge className="ml-2 bg-orange-500">{pendingProfessionals.length}</Badge>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProfessional && (
            <>
              <DialogHeader>
                <DialogTitle>Professional Profile</DialogTitle>
                <DialogDescription>
                  Complete professional information and documents
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="documents">
                      Documents
                      {selectedProfessional.documents?.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {selectedProfessional.documents.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6 pt-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedProfessional.imageUrl || undefined} />
                        <AvatarFallback>
                          {selectedProfessional.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {selectedProfessional.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {selectedProfessional.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge>
                            {selectedProfessional.role === 'TRAINER'
                              ? 'Personal Trainer'
                              : 'Nutritionist'}
                          </Badge>
                          {getStatusBadge(selectedProfessional.approvalStatus)}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                          {selectedProfessional.bio}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Availability</h3>
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                          {Array.isArray(selectedProfessional.availability)
                            ? selectedProfessional.availability.join(', ')
                            : selectedProfessional.availability}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProfessional.specialties &&
                          getSpecialtiesArray(selectedProfessional.specialties).map(
                            (specialty, index) => (
                              <Badge key={index} variant="secondary">
                                {specialty.trim()}
                              </Badge>
                            )
                          )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium mb-2">Certifications</h3>
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md whitespace-pre-line">
                          {Array.isArray(selectedProfessional.certifications)
                            ? selectedProfessional.certifications.join(', ')
                            : selectedProfessional.certifications}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Education</h3>
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md whitespace-pre-line">
                          {Array.isArray(selectedProfessional.education)
                            ? selectedProfessional.education.join(', ')
                            : selectedProfessional.education}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Registration Date</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedProfessional.createdAt).toLocaleDateString()} at{' '}
                        {new Date(selectedProfessional.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="pt-4">
                    {!selectedProfessional.documents ||
                    selectedProfessional.documents.length === 0 ? (
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
                        {selectedProfessional.documents?.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 border rounded-md"
                          >
                            <div className="flex items-center">
                              <FileText className="h-8 w-8 mr-4 text-primary" />
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                {doc.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {doc.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument(doc.url, doc.type)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                {selectedProfessional.approvalStatus !== 'APPROVED' && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleApproveClick(selectedProfessional)
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Professional
                  </Button>
                )}

                {selectedProfessional.approvalStatus !== 'REJECTED' && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setDetailsDialogOpen(false)
                      handleRejectClick(selectedProfessional)
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Professional
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
            <div className="h-[70vh] w-full">
              {selectedDocument.type.includes('pdf') ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full border rounded-md"
                  title="PDF Document"
                />
              ) : (
                <img
                  src={selectedDocument.url || '/placeholder.svg'}
                  alt="Document"
                  className="max-w-full max-h-full mx-auto object-contain"
                />
              )}
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
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedProfessional.imageUrl || undefined} />
                  <AvatarFallback>{selectedProfessional.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedProfessional.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfessional.role === 'TRAINER'
                      ? 'Personal Trainer'
                      : 'Nutritionist'}
                  </p>
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
            <Button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={processingAction}
            >
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
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-md mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedProfessional.imageUrl || undefined} />
                  <AvatarFallback>{selectedProfessional.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedProfessional.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfessional.role === 'TRAINER'
                      ? 'Personal Trainer'
                      : 'Nutritionist'}
                  </p>
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
