'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { User, BadgeIcon as IdCard, Mail, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Client {
  id: string
  name: string
  email: string
  cpf?: string
}

interface ClientAssignmentProps {
  clients: Client[]
  onAssign: (data: {
    method: 'user' | 'cpf' | 'email'
    userId?: string
    cpf?: string
    email?: string
    name?: string
  }) => void
  initialMethod?: 'user' | 'cpf' | 'email'
}

export function ClientAssignment({
  clients,
  onAssign,
  initialMethod = 'user',
}: ClientAssignmentProps) {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState(initialMethod)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleTabChange = (value: string) => {
    setSelectedTab(value as 'user' | 'cpf' | 'email')
    setIsVerified(false)

    // Reset form when changing tabs
    if (value === 'user') {
      onAssign({ method: 'user', userId: selectedClientId })
    } else if (value === 'cpf') {
      onAssign({ method: 'cpf', cpf: '', name: '', email: '' })
    } else if (value === 'email') {
      onAssign({ method: 'email', email: '', name: '' })
    }
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    onAssign({ method: 'user', userId: clientId })
  }

  const formatCpf = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '')

    // Format as XXX.XXX.XXX-XX
    if (numericValue.length <= 3) {
      return numericValue
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`
    } else if (numericValue.length <= 9) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6)}`
    } else {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3, 6)}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCpf(e.target.value)
    setCpf(formattedCpf)
    setIsVerified(false)
  }

  const verifyCpf = () => {
    // In a real application, you would verify the CPF with your backend
    setIsSearching(true)

    setTimeout(() => {
      // Simulate a search
      const foundClient = clients.find((client) => client.cpf === cpf.replace(/\D/g, ''))

      if (foundClient) {
        setName(foundClient.name)
        setEmail(foundClient.email)
        toast({
          title: 'Client Found',
          description: `Found existing client: ${foundClient.name}`,
        })
      }

      setIsVerified(true)
      setIsSearching(false)

      onAssign({
        method: 'cpf',
        cpf: cpf.replace(/\D/g, ''),
        name,
        email,
      })
    }, 1000)
  }

  const verifyEmail = () => {
    // In a real application, you would verify the email with your backend
    setIsSearching(true)

    setTimeout(() => {
      // Simulate a search
      const foundClient = clients.find(
        (client) => client.email.toLowerCase() === email.toLowerCase()
      )

      if (foundClient) {
        setName(foundClient.name)
        toast({
          title: 'Client Found',
          description: `Found existing client: ${foundClient.name}`,
        })
      }

      setIsVerified(true)
      setIsSearching(false)

      onAssign({
        method: 'email',
        email,
        name,
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Assignment</CardTitle>
        <CardDescription>Assign this diet plan to a client</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user">
              <User className="mr-2 h-4 w-4" />
              Existing Client
            </TabsTrigger>
            <TabsTrigger value="cpf">
              <IdCard className="mr-2 h-4 w-4" />
              By CPF
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              By Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Select Client</Label>
              <Select value={selectedClientId} onValueChange={handleClientSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="cpf" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">Client CPF</Label>
              <div className="flex gap-2">
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                />
                <Button
                  variant="outline"
                  onClick={verifyCpf}
                  disabled={cpf.replace(/\D/g, '').length < 11 || isSearching}
                >
                  {isSearching ? 'Searching...' : 'Verify'}
                </Button>
              </div>
            </div>

            {isVerified && (
              <div className="space-y-4 pt-2">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">CPF Verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      onAssign({
                        method: 'cpf',
                        cpf: cpf.replace(/\D/g, ''),
                        name: e.target.value,
                        email,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Client Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      onAssign({
                        method: 'cpf',
                        cpf: cpf.replace(/\D/g, ''),
                        name,
                        email: e.target.value,
                      })
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Client Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={verifyEmail}
                  disabled={!email.includes('@') || isSearching}
                >
                  {isSearching ? 'Searching...' : 'Verify'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                An invitation will be sent to this email address if the client is not
                registered
              </p>
            </div>

            {isVerified && (
              <div className="space-y-4 pt-2">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Email Verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Client Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      onAssign({ method: 'email', email, name: e.target.value })
                    }}
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
