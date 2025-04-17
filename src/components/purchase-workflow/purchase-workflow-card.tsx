'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle, User, ArrowRight, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import type { Purchase } from '@/types/PurchaseType'
import { usePurchases } from '@/hooks/purchase-hooks'

interface PurchaseWorkflowCardProps {
  purchase: Purchase
}

export default function PurchaseWorkflowCard({ purchase }: PurchaseWorkflowCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { markFeatureAsCompleted } = usePurchases()

  // Calcular progresso
  const totalFeatures = purchase.Plan?.features?.length || 0
  const completedFeatures =
    purchase.Plan?.features?.filter((f) => f.isCompleted)?.length || 0
  const progressPercentage =
    totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

  // Formatar data
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(purchase.createdAt))

  // Obter status em português
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo'
      case 'SCHEDULEDMEETING':
        return 'Reunião Agendada'
      case 'COMPLETED':
        return 'Finalizado'
      case 'WAITINGPAYMENT':
        return 'Aguardando Pagamento'
      case 'CANCELLED':
        return 'Cancelado'
      default:
        return status
    }
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500'
      case 'SCHEDULEDMEETING':
        return 'bg-blue-500'
      case 'COMPLETED':
        return 'bg-gray-500'
      case 'WAITINGPAYMENT':
        return 'bg-amber-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Marcar feature como concluída
  const handleMarkAsCompleted = async (featureId: string) => {
    setIsUpdating(true)
    try {
      await markFeatureAsCompleted(purchase.id, featureId)
    } catch (error) {
      console.error('Erro ao marcar feature como concluída:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{purchase.Plan?.name}</CardTitle>
          <Badge
            variant="outline"
            className={`${getStatusColor(purchase.status)} text-white`}
          >
            {getStatusLabel(purchase.status)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-1" />
          {purchase.buyer?.name}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Progresso</span>
              <span>
                {completedFeatures}/{totalFeatures}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Atividades:</p>
            {purchase.Plan?.features?.map((feature, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {feature.isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                  )}
                  <span>{feature.name}</span>
                </div>
                {!feature.isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => handleMarkAsCompleted(feature.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Concluir'
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Iniciado em: {formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/purchases/${purchase.id}`}>
            Ver Detalhes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
