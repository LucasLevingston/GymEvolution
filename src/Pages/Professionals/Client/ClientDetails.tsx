import { useEffect, useState } from 'react'
import { Mail, Phone, DollarSign, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate, useParams } from 'react-router-dom'
import { Client } from '@/types/userType'
import useUser from '@/hooks/user-hooks'
import { PendingTasksList } from '@/components/professional/pending-task-list'
import { getInitials } from '@/lib/utils/getInitias'

export default function ClientDetails() {
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const { user } = useUser()
  const { clientId } = useParams()

  useEffect(() => {
    const findClient = user?.clients?.find(({ id }) => id === clientId)
    if (!findClient) {
      throw new Error('Client not found')
    }
    setClient(findClient)
  })

  return (
    <>
      {client && (
        <>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={client.imageUrl || '/placeholder.svg'}
                alt={client.name}
              />
              <AvatarFallback className="text-2xl">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <Badge
                  variant={client.isActive ? 'default' : 'outline'}
                  className="w-fit"
                >
                  {client.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="mt-2 text-muted-foreground">
                {client.latestPlanName && (
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{client.latestPlanName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resumo Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-2xl font-bold mt-2">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(client.totalSpent)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Total gasto</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/clients/${clientId}/payments`)}
                    >
                      Ver detalhes
                    </Button>
                  </CardFooter>
                </Card>

                <PendingTasksList
                  tasks={client.tasks}
                  className="h-full flex flex-col md:col-span-3"
                />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="h-full">
              <PendingTasksList tasks={client.tasks} showViewAll={false} limit={100} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  )
}
