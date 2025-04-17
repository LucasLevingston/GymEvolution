import { NUTRITIONIST_FEATURES, TRAINER_FEATURES } from '@/lib/utils/plansFeatures'

export interface RequiredTask {
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate?: Date | null
  actionLink?: string
}

export interface Purchase {
  id: string
  status: string
  Plan?: {
    id: string
    name: string
    features: Array<{
      id: string
      name: string
      isCompleted?: boolean
    }>
  }
  professional?: {
    id: string
    name: string
    role?: string
  }
  buyer?: {
    id: string
    name: string
  }
  createdAt: Date
}

// Map feature IDs to task types
const featureToTaskTypeMap = {
  // Nutritionist features
  initial_consultation: 'SCHEDULE_MEETING',
  follow_up: 'SCHEDULE_FOLLOWUP',
  diet_plan: 'CREATE_DIET',
  nutritional_monitoring: 'REVIEW_PROGRESS',
  whatsapp_support: 'SUPPORT',
  meal_planning: 'CREATE_DIET',
  body_composition_analysis: 'REVIEW_PROGRESS',
  nutritional_education: 'EDUCATIONAL',

  // Trainer features
  initial_assessment: 'SCHEDULE_MEETING',
  training_plan: 'CREATE_TRAINING',
  follow_up_session: 'SCHEDULE_FOLLOWUP',
  physical_monitoring: 'REVIEW_PROGRESS',
  exercise_technique: 'EDUCATIONAL',
  personalized_training: 'CREATE_TRAINING',
  performance_evaluation: 'REVIEW_PROGRESS',
}

// Map feature IDs to task descriptions
const featureToDescriptionMap = {
  // Nutritionist features
  initial_consultation:
    'Agende a consulta inicial com o cliente para avaliação nutricional',
  follow_up: 'Agende uma consulta de retorno para acompanhamento',
  diet_plan: 'Crie um plano alimentar personalizado para o cliente',
  nutritional_monitoring: 'Revise o progresso nutricional do cliente',
  whatsapp_support: 'Forneça suporte via WhatsApp para dúvidas do cliente',
  meal_planning: 'Desenvolva um planejamento detalhado de refeições',
  body_composition_analysis: 'Realize uma análise de composição corporal',
  nutritional_education: 'Forneça materiais educativos sobre nutrição',

  // Trainer features
  initial_assessment: 'Agende uma avaliação física inicial com o cliente',
  training_plan: 'Crie uma planilha de treino personalizada',
  follow_up_session: 'Agende uma sessão de acompanhamento',
  physical_monitoring: 'Monitore o progresso físico do cliente',
  exercise_technique: 'Forneça orientações sobre técnicas de exercícios',
  personalized_training: 'Desenvolva um treino personalizado',
  performance_evaluation: 'Realize uma avaliação de desempenho',
}

// Function to determine task priority based on feature and days since purchase
function determineTaskPriority(
  featureId: string,
  daysSincePurchase: number
): 'high' | 'medium' | 'low' {
  // Initial consultations and assessments are high priority
  if (featureId === 'initial_consultation' || featureId === 'initial_assessment') {
    return daysSincePurchase > 3 ? 'high' : 'medium'
  }

  // Diet and training plans are medium to high priority
  if (featureId === 'diet_plan' || featureId === 'training_plan') {
    return daysSincePurchase > 5 ? 'high' : 'medium'
  }

  // Follow-ups are medium priority
  if (featureId === 'follow_up' || featureId === 'follow_up_session') {
    return daysSincePurchase > 7 ? 'medium' : 'low'
  }

  // Default to low priority
  return 'low'
}

// Function to calculate due date based on feature and purchase date
function calculateDueDate(featureId: string, purchaseDate: Date): Date {
  const dueDate = new Date(purchaseDate)

  // Initial consultations and assessments due within 3 days
  if (featureId === 'initial_consultation' || featureId === 'initial_assessment') {
    dueDate.setDate(dueDate.getDate() + 3)
    return dueDate
  }

  // Diet and training plans due within 5 days
  if (featureId === 'diet_plan' || featureId === 'training_plan') {
    dueDate.setDate(dueDate.getDate() + 5)
    return dueDate
  }

  // Follow-ups due within 14 days
  if (featureId === 'follow_up' || featureId === 'follow_up_session') {
    dueDate.setDate(dueDate.getDate() + 14)
    return dueDate
  }

  // Default to 7 days
  dueDate.setDate(dueDate.getDate() + 7)
  return dueDate
}

// Main function to analyze purchases and generate required tasks
export function analyzePurchasesForTasks(
  purchases: Purchase[],
  userRole: 'professional' | 'client'
): RequiredTask[] {
  if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
    return []
  }

  const tasks: RequiredTask[] = []
  const now = new Date()

  // Process each active purchase
  purchases.map((purchase) => {
    if (purchase.status !== 'ACTIVE' || !purchase.Plan?.features) {
      return
    }

    const daysSincePurchase = Math.floor(
      (now.getTime() - new Date(purchase.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    // Process each feature in the plan
    purchase.Plan.features.map((feature) => {
      // Skip completed features
      if (feature.isCompleted) {
        return
      }

      // Find the feature in our predefined lists
      const nutritionistFeature = NUTRITIONIST_FEATURES.find((f) => f.id === feature.id)
      const trainerFeature = TRAINER_FEATURES.find((f) => f.id === feature.id)
      const featureInfo = nutritionistFeature || trainerFeature

      if (!featureInfo) {
        return
      }

      const taskType =
        featureToTaskTypeMap[feature.id as keyof typeof featureToTaskTypeMap] || 'OTHER'
      const description =
        featureToDescriptionMap[feature.id as keyof typeof featureToDescriptionMap] ||
        feature.name
      const priority = determineTaskPriority(feature.id, daysSincePurchase)
      const dueDate = calculateDueDate(feature.id, purchase.createdAt)

      // Create task with appropriate title based on user role
      let title = featureInfo.label
      let actionLink = ''

      if (userRole === 'professional') {
        title = `${title} para ${purchase.buyer?.name || 'Cliente'}`
        actionLink = `/client/${purchase.buyer?.id}/plan/${purchase.Plan.id}`
      } else {
        title = `${title} com ${purchase.professional?.name || 'Profissional'}`
        actionLink = `/professional/${purchase.professional?.id}/plan/${purchase.Plan.id}`
      }

      tasks.push({
        type: taskType,
        title,
        description,
        priority,
        dueDate,
        actionLink,
      })
    })
  })

  return tasks
}
