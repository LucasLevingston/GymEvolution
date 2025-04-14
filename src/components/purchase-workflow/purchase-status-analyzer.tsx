import type { Purchase } from '@/types/PurchaseType'

// Define the types of actions that can be required
export type ActionType =
  | 'SCHEDULE_MEETING'
  | 'ATTEND_MEETING'
  | 'CREATE_DIET'
  | 'CREATE_TRAINING'
  | 'REVIEW_PROGRESS'
  | 'SCHEDULE_FOLLOWUP'
  | 'COMPLETE_ASSESSMENT'

// Define the structure for required actions
export interface RequiredAction {
  type: ActionType
  label: string
  description: string
  priority: 'high' | 'medium' | 'low'
  forRole: 'professional' | 'student'
  route?: string
  dueDate?: Date
}

/**
 * Analyzes a purchase to determine what actions are required by the professional and student
 */
export function analyzePurchase(purchase: Purchase): RequiredAction[] {
  if (!purchase || !purchase.Plan) {
    return []
  }

  const actions: RequiredAction[] = []
  const planFeatures = purchase.Plan.features
    ? typeof purchase.Plan.features === 'string'
      ? JSON.parse(purchase.Plan.features)
      : purchase.Plan.features
    : []

  // Get professional type
  const isProfessionalNutritionist = purchase.professional?.role === 'NUTRITIONIST'
  const isProfessionalTrainer = purchase.professional?.role === 'TRAINER'

  // Determine actions based on purchase status
  switch (purchase.status) {
    case 'WAITINGPAYMENT':
      // No actions needed while waiting for payment
      break

    case 'SCHEDULEMEETING':
      // Student needs to schedule the initial meeting
      actions.push({
        type: 'SCHEDULE_MEETING',
        label: 'Agendar Consulta Inicial',
        description: 'Você precisa agendar sua consulta inicial com o profissional',
        priority: 'high',
        forRole: 'student',
        route: `/schedule-meeting/${purchase.id}`,
      })
      break

    case 'SCHEDULEDMEETING':
      actions.push({
        type: 'ATTEND_MEETING',
        label: 'Participar da Reunião Agendada',
        description: 'Você tem uma reunião agendada que precisa participar',
        priority: 'high',
        forRole: 'professional',
        route: `/meetings/${purchase.meetingId || ''}`,
      })

      actions.push({
        type: 'ATTEND_MEETING',
        label: 'Participar da Reunião Agendada',
        description: 'Você tem uma reunião agendada que precisa participar',
        priority: 'high',
        forRole: 'student',
        route: `/meetings/${purchase.meetingId || ''}`,
      })
      break

    case 'WAITINGSPREADSHEET':
      // Professional needs to create diet or training plan based on their role
      if (isProfessionalNutritionist) {
        // Check if diet plan is included in features
        if (
          planFeatures.some(
            (feature: string) =>
              feature.toLowerCase().includes('diet') ||
              feature.toLowerCase().includes('dieta') ||
              feature.toLowerCase().includes('alimentar')
          )
        ) {
          actions.push({
            type: 'CREATE_DIET',
            label: 'Criar Plano Alimentar',
            description: 'Você precisa criar um plano alimentar para o aluno',
            priority: 'high',
            forRole: 'professional',
            route: `/create-diet?purchaseId=${purchase.id}`,
          })
        }
      }

      if (isProfessionalTrainer) {
        // Check if training plan is included in features
        if (
          planFeatures.some(
            (feature: string) =>
              feature.toLowerCase().includes('train') ||
              feature.toLowerCase().includes('treino') ||
              feature.toLowerCase().includes('planilha')
          )
        ) {
          actions.push({
            type: 'CREATE_TRAINING',
            label: 'Criar Planilha de Treino',
            description: 'Você precisa criar uma planilha de treino para o aluno',
            priority: 'high',
            forRole: 'professional',
            route: `/create-training?purchaseId=${purchase.id}`,
          })
        }
      }
      break

    case 'SPREADSHEET SENT':
      // Student should review the spreadsheet and schedule a follow-up if needed
      actions.push({
        type: 'REVIEW_PROGRESS',
        label: 'Revisar Planilha Enviada',
        description:
          'O profissional enviou sua planilha. Revise e entre em contato se tiver dúvidas.',
        priority: 'medium',
        forRole: 'student',
        route: `/spreadsheet/${purchase.id}`,
      })

      // If follow-up is included in the plan features
      if (
        planFeatures.some(
          (feature: string) =>
            feature.toLowerCase().includes('follow') ||
            feature.toLowerCase().includes('retorno') ||
            feature.toLowerCase().includes('acompanhamento')
        )
      ) {
        actions.push({
          type: 'SCHEDULE_FOLLOWUP',
          label: 'Agendar Consulta de Retorno',
          description: 'Você pode agendar uma consulta de retorno com o profissional',
          priority: 'medium',
          forRole: 'student',
          route: `/schedule-meeting/${purchase.id}`,
        })
      }
      break

    case 'SCHEDULE RETURN':
      // Student needs to schedule a follow-up meeting
      actions.push({
        type: 'SCHEDULE_FOLLOWUP',
        label: 'Agendar Consulta de Retorno',
        description: 'Você precisa agendar sua consulta de retorno',
        priority: 'high',
        forRole: 'student',
        route: `/schedule-meeting/${purchase.id}`,
      })
      break

    case 'FINALIZED':
      // No actions needed for finalized purchases
      break
  }

  return actions
}

/**
 * Gets actions required for a specific role
 */
export function getActionsForRole(
  purchase: Purchase,
  role: 'professional' | 'student'
): RequiredAction[] {
  const allActions = analyzePurchase(purchase)
  return allActions.filter((action) => action.forRole === role)
}
