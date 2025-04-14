import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
} from 'lucide-react'
import type { RequiredAction } from './purchase-status-analyzer'

interface RequiredActionsListProps {
  actions: RequiredAction[]
  title?: string
  description?: string
  emptyMessage?: string
}

export default function RequiredActionsList({
  actions,
  title = 'Ações Necessárias',
  description = 'Estas são as ações que você precisa realizar',
  emptyMessage = 'Não há ações pendentes no momento',
}: RequiredActionsListProps) {
  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort actions by priority
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActions.map((action, index) => (
            <div key={index} className="flex items-start p-4 border rounded-lg">
              {getActionIcon(action.type)}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{action.label}</h4>
                  <Badge variant={getPriorityVariant(action.priority)}>
                    {getPriorityLabel(action.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                {action.dueDate && (
                  <p className="text-sm mt-2 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Prazo: {formatDate(action.dueDate)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/purchases">
            Ver Todas as Compras
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper functions
function getActionIcon(type: string) {
  switch (type) {
    case 'SCHEDULE_MEETING':
    case 'SCHEDULE_FOLLOWUP':
      return <Calendar className="h-8 w-8 text-blue-500" />
    case 'ATTEND_MEETING':
      return <Calendar className="h-8 w-8 text-indigo-500" />
    case 'CREATE_DIET':
    case 'CREATE_TRAINING':
      return <ClipboardList className="h-8 w-8 text-purple-500" />
    case 'REVIEW_PROGRESS':
      return <FileText className="h-8 w-8 text-green-500" />
    default:
      return <AlertCircle className="h-8 w-8 text-amber-500" />
  }
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'outline'
    default:
      return 'outline'
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case 'high':
      return 'Alta'
    case 'medium':
      return 'Média'
    case 'low':
      return 'Baixa'
    default:
      return priority
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
