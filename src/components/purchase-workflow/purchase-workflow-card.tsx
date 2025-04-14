'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, CheckCircle, ClipboardList, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Purchase } from '@/types/PurchaseType'
import { getActionsForRole } from './purchase-status-analyzer'
import { useUserStore } from '@/store/user-store'

interface PurchaseWorkflowCardProps {
  purchase: Purchase
}

export default function PurchaseWorkflowCard({ purchase }: PurchaseWorkflowCardProps) {
  const { user } = useUserStore()
  const [progress, setProgress] = useState(0)

  // Determine user role
  const userRole =
    user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER' ? 'professional' : 'student'

  // Get actions for the current user
  const requiredActions = getActionsForRole(purchase, userRole)

  useEffect(() => {
    // Calculate progress based on status
    const progressMap: Record<string, number> = {
      WAITINGPAYMENT: 10,
      SCHEDULEMEETING: 25,
      SCHEDULEDMEETING: 40,
      WAITINGSPREADSHEET: 60,
      'SPREADSHEET SENT': 75,
      'SCHEDULE RETURN': 90,
      FINALIZED: 100,
    }

    const statusProgress = progressMap[purchase.status] || 0

    // Animate progress
    const start = 0
    const target = statusProgress
    const duration = 1000
    const startTime = performance.now()

    const animateProgress = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const currentProgress = Math.floor(start + (target - start) * progress)

      setProgress(currentProgress)

      if (progress < 1) {
        requestAnimationFrame(animateProgress)
      }
    }

    requestAnimationFrame(animateProgress)
  }, [purchase.status])

  // Get status label
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      WAITINGPAYMENT: 'Aguardando Pagamento',
      SCHEDULEMEETING: 'Agendar Reunião',
      SCHEDULEDMEETING: 'Reunião Agendada',
      WAITINGSPREADSHEET: 'Aguardando Planilha',
      'SPREADSHEET SENT': 'Planilha Enviada',
      'SCHEDULE RETURN': 'Agendar Retorno',
      FINALIZED: 'Finalizado',
    }

    return statusMap[status] || status
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'WAITINGPAYMENT':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'SCHEDULEMEETING':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'SCHEDULEDMEETING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'WAITINGSPREADSHEET':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'SPREADSHEET SENT':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'SCHEDULE RETURN':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'FINALIZED':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Get next action icon
  const getNextActionIcon = () => {
    if (requiredActions.length === 0) return null

    const nextAction = requiredActions[0]
    switch (nextAction.type) {
      case 'SCHEDULE_MEETING':
      case 'SCHEDULE_FOLLOWUP':
      case 'ATTEND_MEETING':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'CREATE_DIET':
      case 'CREATE_TRAINING':
        return <ClipboardList className="h-5 w-5 text-purple-500" />
      case 'REVIEW_PROGRESS':
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  // Get next action text
  const getNextActionText = () => {
    if (requiredActions.length === 0) {
      return 'Nenhuma ação necessária no momento'
    }

    return requiredActions[0].label
  }

  // Get next action route
  const getNextActionRoute = () => {
    if (requiredActions.length === 0) {
      return `/purchases/${purchase.id}`
    }

    return requiredActions[0].route || `/purchases/${purchase.id}`
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{purchase.Plan.name}</CardTitle>
            <CardDescription>
              {purchase.professional?.name || 'Profissional'}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStatusBadgeColor(purchase.status)}>
            {getStatusLabel(purchase.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Next action */}
          <div className="mt-4 p-3 bg-muted rounded-lg flex items-center">
            {requiredActions.length === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              getNextActionIcon()
            )}
            <span
              className={`ml-2 font-medium ${requiredActions.length === 0 ? 'text-green-600' : ''}`}
            >
              {getNextActionText()}
            </span>
          </div>

          {/* Action button */}
          <Button asChild className="w-full mt-4">
            <Link to={getNextActionRoute()}>
              {requiredActions.length === 0 ? 'Ver Detalhes' : 'Realizar Ação'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
