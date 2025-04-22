'use client'

import { Link } from 'react-router-dom'
import {
  Calendar,
  CheckCircle,
  User,
  ArrowRight,
  Dumbbell,
  Apple,
  MessageSquare,
  Video,
  RotateCcw,
  ExternalLink,
} from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import type { Purchase } from '@/types/PurchaseType'
import { formatDate } from '@/static'
import { Feature } from '@/types/PlanType'

interface PurchaseWorkflowCardProps {
  purchase: Purchase
}

export default function PurchaseWorkflowCard({
  purchase: { Plan, id, status, buyer, createdAt, buyerId, professionalId },
}: PurchaseWorkflowCardProps) {
  const isFeatureComplete = (feature: any) => {
    if (feature.isTrainingWeek && feature.trainingWeekId) {
      return true
    } else if (feature.isDiet && feature.dietId) {
      return true
    } else if (feature.isFeedback && feature.feedback) {
      return true
    } else if (feature.isConsultation && feature.consultationMeetingId) {
      return true
    } else if (feature.isReturn && feature.returnMeetingId) {
      return true
    }
    return false
  }

  // Calcular progresso baseado nos IDs em vez de isCompleted
  const totalFeatures = Plan?.features?.length || 0
  const completedFeatures = Plan?.features?.filter(isFeatureComplete)?.length || 0
  const progressPercentage =
    totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

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

  // Função para obter o ícone baseado no tipo da feature
  const getFeatureIcon = (feature: any) => {
    if (feature.isTrainingWeek) {
      return <Dumbbell className="h-4 w-4 text-blue-500 mr-2" />
    } else if (feature.isDiet) {
      return <Apple className="h-4 w-4 text-green-500 mr-2" />
    } else if (feature.isFeedback) {
      return <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
    } else if (feature.isConsultation) {
      return <Video className="h-4 w-4 text-amber-500 mr-2" />
    } else if (feature.isReturn) {
      return <RotateCcw className="h-4 w-4 text-indigo-500 mr-2" />
    } else {
      return <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
    }
  }

  // Função para obter o texto do botão baseado no tipo da feature
  const getActionButtonText = (feature: any) => {
    if (feature.isTrainingWeek) {
      return feature.trainingWeekId ? 'Ver Treino' : 'Criar Treino'
    } else if (feature.isDiet) {
      return feature.dietId ? 'Ver Dieta' : 'Criar Dieta'
    } else if (feature.isFeedback) {
      return feature.feedback ? 'Ver Feedback' : 'Dar Feedback'
    } else if (feature.isConsultation) {
      return feature.consultationMeetingId ? 'Ver Consulta' : 'Agendar Consulta'
    } else if (feature.isReturn) {
      return feature.returnMeetingId ? 'Ver Retorno' : 'Agendar Retorno'
    } else {
      return 'Resolver'
    }
  }

  const getResolveLink = (feature: Feature) => {
    if (feature.linkToResolve) {
      return feature.linkToResolve
    }

    if (feature.isTrainingWeek) {
      return feature.trainingWeekId
        ? `/training/${feature.trainingWeekId}`
        : `/training/create?purchaseId=${id}&featureId=${feature.id}&clientId=${buyerId}&professionalId=${professionalId}`
    }
    if (feature.isDiet) {
      return feature.dietId
        ? `/diet/${feature.dietId}`
        : `/diet/create?purchaseId=${id}&featureId=${feature.id}&clientId=${buyerId}&professionalId=${professionalId}`
    } else if (feature.isFeedback) {
      const action = feature.feedback ? 'view' : 'create'
      return `/feedback/${action}?purchaseId=${id}&featureId=${feature.id}&clientId=${buyerId}&professionalId=${professionalId}`
    } else if (feature.isConsultation) {
      const action = feature.consultationMeetingId ? 'view' : 'schedule'
      const meetingId = feature.consultationMeetingId || 'new'
      return `/meeting/${action}/${meetingId}?purchaseId=${id}&featureId=${feature.id}&clientId=${buyerId}&professionalId=${professionalId}`
    } else if (feature.isReturn) {
      const action = feature.returnMeetingId ? 'view' : 'schedule'
      const meetingId = feature.returnMeetingId || 'new'
      return `/meeting/${action}/${meetingId}?purchaseId=${id}&featureId=${feature.id}&clientId=${buyerId}&professionalId=${professionalId}`
    } else {
      return `/purchases/${id}`
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{Plan?.name}</CardTitle>
          <Badge variant="outline" className={`${getStatusColor(status)} text-white`}>
            {getStatusLabel(status)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-1" />
          {buyer?.name}
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
            {Plan?.features?.map((feature, index) => {
              const completed = isFeatureComplete(feature)
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    {completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      getFeatureIcon(feature)
                    )}
                    <span>{feature.name}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant={completed ? 'outline' : 'default'}
                          size="sm"
                          className="h-6 px-2"
                        >
                          <Link to={getResolveLink(feature)}>
                            {completed ? (
                              <span className="flex items-center gap-1">
                                Ver <ExternalLink className="h-3 w-3 ml-1" />
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                Criar <ExternalLink className="h-3 w-3 ml-1" />
                              </span>
                            )}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getActionButtonText(feature)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Iniciado em: {formatDate(createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/purchases/${id}`}>
            Ver Detalhes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
