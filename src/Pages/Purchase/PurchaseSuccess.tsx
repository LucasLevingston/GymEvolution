'use client'

import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { CheckCircle, Calendar, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import { useUserStore } from '@/store/user-store'
import { ContainerRoot } from '@/components/Container'
import { usePurchases } from '@/hooks/purchase-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'
import type { Purchase } from '@/types/PurchaseType'
import type { Professional } from '@/types/ProfessionalType'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function PurchaseSuccess() {
  const navigate = useNavigate()
  const { professionalId, planId } = useParams()
  const { addNotification } = useNotifications()
  const { user } = useUserStore()
  const { getUserPurchases, isLoading: isPurchaseLoading } = usePurchases()
  const { getProfessionalById, isLoading: isProfessionalLoading } = useProfessionals()
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [professional, setProfessional] = useState<Professional | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !professionalId || !planId) return

      const professionalData = await getProfessionalById(professionalId)
      if (professionalData) {
        setProfessional(professionalData)
      }

      const purchases = await getUserPurchases()
      const matchingPurchase = purchases.find(
        (p) => p.professionalId === professionalId && p.planId === planId
      )

      if (matchingPurchase) {
        setPurchase(matchingPurchase)
      }
    }

    fetchData()
  }, [])

  if (isPurchaseLoading || isProfessionalLoading) {
    return (
      <ContainerRoot>
        <LoadingSpinner />
      </ContainerRoot>
    )
  }

  if (!purchase && !isPurchaseLoading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Compra não encontrada</h1>
          <p className="text-muted-foreground max-w-md">
            Não foi possível encontrar os detalhes da sua compra.
          </p>
          <Button asChild className="mt-6">
            <Link to="/professional">Explorar profissionais</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Compra Realizada com Sucesso!</h1>
        <p className="text-muted-foreground max-w-md">
          Sua solicitação foi enviada ao profissional e você receberá uma notificação
          quando for aceita.
        </p>
      </div>

      {purchase && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalhes da Compra</CardTitle>
            <CardDescription>Informações sobre o plano contratado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Profissional:</span>
              <span>{professional?.name || 'Profissional'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Plano:</span>
              <span>{purchase.planName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Valor:</span>
              <span className="font-bold">R$ {purchase.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Status:</span>
              <span className="text-amber-600 font-medium">
                {purchase.status === 'PENDING'
                  ? 'Aguardando aprovação'
                  : purchase.status === 'COMPLETED'
                    ? 'Concluída'
                    : purchase.status === 'CANCELLED'
                      ? 'Cancelada'
                      : 'Reembolsada'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Data da compra:</span>
              <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>O que acontece agora?</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">Agende sua primeira reunião</h3>
                <p className="text-muted-foreground text-sm">
                  Escolha um horário disponível na agenda do profissional para sua
                  primeira consulta.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">Participe da reunião pelo Google Meet</h3>
                <p className="text-muted-foreground text-sm">
                  No horário agendado, acesse o link do Google Meet que será enviado para
                  você.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">Receba seu plano personalizado</h3>
                <p className="text-muted-foreground text-sm">
                  Após a consulta, você receberá seu plano personalizado e poderá começar
                  sua jornada.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="flex items-center justify-center" asChild>
          <Link to="/relationships">
            <Calendar className="mr-2 h-4 w-4" />
            Meus Profissionais
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center justify-center" asChild>
          <Link to={`/messages/${professionalId}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens
          </Link>
        </Button>
        <Button className="flex items-center justify-center" asChild>
          <Link to={`/schedule-meeting/${professionalId}`}>
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Reunião
          </Link>
        </Button>
      </div>
    </>
  )
}
