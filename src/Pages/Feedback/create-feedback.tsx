'use client'

import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowLeft,
  Save,
  User,
  Calendar,
  Dumbbell,
  Apple,
  LineChart,
  TrendingUp,
  Video,
  RotateCcw,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { toast } from 'sonner'
import useUser from '@/hooks/user-hooks'
import api from '@/lib/api'
import { formatDate } from '@/static'
import { Progress } from '@/components/ui/progress'
import { DietType, MealType } from '@/types/DietType'
import { ExerciseType, TrainingDayType, TrainingWeekType } from '@/types/TrainingType'
import { WeightType } from '@/types/userType'

// Definição do schema de validação
const feedbackSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  feedback: z.string().min(10, 'O feedback deve ter pelo menos 10 caracteres'),
  dateToResolve: z.string().optional(),
  linkToResolve: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

export default function CreateFeedback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, token } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [clientData, setClientData] = useState<any>(null)
  const [relatedData, setRelatedData] = useState<{
    trainingWeeks: TrainingWeekType[]
    diets: DietType[]
    weights: WeightType[]
    purchaseInfo: any
    features: any[]
    consultations: any[]
    returns: any[]
  }>({
    trainingWeeks: [],
    diets: [],
    weights: [],
    purchaseInfo: null,
    features: [],
    consultations: [],
    returns: [],
  })
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)

  // Extrair parâmetros da URL
  const queryParams = new URLSearchParams(location.search)
  const purchaseId = queryParams.get('purchaseId')
  // const clientId = queryParams.get('clientId')
  // const professionalId = queryParams.get('professionalId')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: '',
      feedback: '',
      dateToResolve: new Date().toISOString().split('T')[0],
      linkToResolve: '',
    },
  })

  // Buscar dados do cliente, compra e todas as features relacionadas
  useEffect(() => {
    const fetchData = async () => {
      if (!purchaseId) {
        setError('ID da compra não fornecido')
        return
      }

      setIsLoading(true)
      try {
        // Buscar dados da compra
        const purchaseResponse = await api.get(`/purchases/${purchaseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!purchaseResponse.data) {
          throw new Error('Compra não encontrada')
        }

        const purchase = purchaseResponse.data
        const buyerId = purchase.buyerId
        const planId = purchase.planId

        // Buscar dados do cliente
        const clientResponse = await api.get(`/users/${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (clientResponse.data) {
          setClientData(clientResponse.data)
          // Definir título padrão com nome do cliente
          setValue('title', `Avaliação de Progresso - ${clientResponse.data.name}`)
        }

        // Buscar plano e suas features
        const planResponse = await api.get(`/plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!planResponse.data || !planResponse.data.features) {
          throw new Error('Plano ou features não encontrados')
        }

        const features = planResponse.data.features

        // Buscar treinos relacionados ao cliente
        const trainingResponse = await api.get(`/training-weeks?userId=${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Buscar dietas relacionadas ao cliente
        const dietResponse = await api.get(`/diets?userId=${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Buscar histórico de peso do cliente
        const weightResponse = await api.get(`/weights?userId=${buyerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Buscar consultas relacionadas
        const consultationsResponse = await api.get(
          `/meetings?studentId=${buyerId}&type=CONSULTATION`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        // Buscar retornos relacionados
        const returnsResponse = await api.get(
          `/meetings?studentId=${buyerId}&type=RETURN`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setRelatedData({
          trainingWeeks: trainingResponse.data || [],
          diets: dietResponse.data || [],
          weights: weightResponse.data || [],
          purchaseInfo: purchase,
          features: features || [],
          consultations: consultationsResponse.data || [],
          returns: returnsResponse.data || [],
        })

        // Selecionar a primeira feature por padrão
        if (features && features.length > 0) {
          setSelectedFeatureId(features[0].id)
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError('Falha ao carregar dados do cliente ou plano')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [purchaseId, token, setValue])

  const onSubmit = async (data: FeedbackFormData) => {
    if (!purchaseId || !selectedFeatureId || !clientData?.id) {
      setError('Informações necessárias não fornecidas')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Atualizar a feature com o feedback
      const response = await api.patch(
        `/features/${selectedFeatureId}`,
        {
          feedback: data.feedback,
          dateToResolve: data.dateToResolve || undefined,
          linkToResolve: data.linkToResolve || undefined,
          isFeedback: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (response.data) {
        setSuccess(true)
        toast.success('Feedback enviado com sucesso!', {
          description: 'O cliente foi notificado sobre seu feedback.',
        })

        // Criar notificação para o cliente
        await api.post(
          '/notifications',
          {
            title: 'Novo feedback disponível',
            message: `${user?.name} enviou um feedback sobre seu progresso.`,
            type: 'FEEDBACK',
            userId: clientData.id,
            link: `/feedback/${selectedFeatureId}`,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate(`/feedback/${selectedFeatureId}`)
        }, 2000)
      }
    } catch (err: any) {
      console.error('Erro ao enviar feedback:', err)
      toast.error('Falha ao enviar feedback', {
        description:
          err.response?.data?.message || 'Ocorreu um erro ao processar sua solicitação',
      })
      setError(err.response?.data?.message || 'Falha ao enviar feedback')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para calcular o progresso do treino
  const calculateTrainingProgress = () => {
    if (!relatedData.trainingWeeks || relatedData.trainingWeeks.length === 0) return 0

    const latestTrainingWeek =
      relatedData.trainingWeeks[relatedData.trainingWeeks.length - 1]

    if (!latestTrainingWeek || !latestTrainingWeek.trainingDays) return 0

    const totalExercises = latestTrainingWeek.trainingDays.reduce(
      (total: number, trainingDay: TrainingDayType) =>
        total + (trainingDay.exercises?.length || 0),
      0
    )

    const completedExercises = latestTrainingWeek.trainingDays.reduce(
      (total: number, trainingDay: TrainingDayType) =>
        total +
        (trainingDay.exercises?.filter((exercise: ExerciseType) => exercise.isCompleted)
          ?.length || 0),
      0
    )

    return totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0
  }

  // Função para calcular o progresso da dieta
  const calculateDietProgress = () => {
    if (!relatedData.diets || relatedData.diets.length === 0) return 0

    const latestDiet = relatedData.diets[relatedData.diets.length - 1]

    if (!latestDiet || !latestDiet.meals) return 0

    const totalMeals = latestDiet.meals.length
    const completedMeals = latestDiet.meals.filter(
      (meal: MealType) => meal.isCompleted
    ).length

    return totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0
  }

  // Função para calcular a variação de peso
  const calculateWeightChange = () => {
    if (!relatedData.weights || relatedData.weights.length < 2) return null

    const sortedWeights = [...relatedData.weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const firstWeight = Number.parseFloat(sortedWeights[0].weight)
    const lastWeight = Number.parseFloat(sortedWeights[sortedWeights.length - 1].weight)

    return {
      initial: firstWeight,
      current: lastWeight,
      change: lastWeight - firstWeight,
      percentage: ((lastWeight - firstWeight) / firstWeight) * 100,
    }
  }

  // Função para obter o ícone da feature
  const getFeatureIcon = (feature: any) => {
    if (feature.isTrainingWeek) return <Dumbbell className="h-4 w-4 text-blue-500" />
    if (feature.isDiet) return <Apple className="h-4 w-4 text-green-500" />
    if (feature.isConsultation) return <Video className="h-4 w-4 text-amber-500" />
    if (feature.isReturn) return <RotateCcw className="h-4 w-4 text-indigo-500" />
    return <MessageSquare className="h-4 w-4 text-gray-500" />
  }

  // Função para obter o tipo da feature como texto
  const getFeatureType = (feature: any) => {
    const types = []
    if (feature.isTrainingWeek) types.push('Treino')
    if (feature.isDiet) types.push('Dieta')
    if (feature.isConsultation) types.push('Consulta')
    if (feature.isReturn) types.push('Retorno')
    return types.length > 0 ? types.join(' e ') : 'Outro'
  }

  if (success) {
    return (
      <ContainerContent>
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertTitle>Feedback enviado com sucesso!</AlertTitle>
            <AlertDescription>
              Seu feedback foi registrado e o cliente foi notificado. Você será
              redirecionado em instantes...
            </AlertDescription>
          </Alert>
        </div>
      </ContainerContent>
    )
  }

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Criar Novo Feedback</ContainerTitle>
        <section className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/feedback/list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
        </section>
      </ContainerHeader>

      <ContainerContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna principal - Formulário de feedback */}
          <div className="md:col-span-2">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Feedback</Label>
                    <Input id="title" {...register('title')} disabled={isLoading} />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Seleção de Feature */}
                  <div className="space-y-2">
                    <Label>Selecione a Feature para Feedback</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {relatedData.features.map((feature) => (
                        <Button
                          key={feature.id}
                          type="button"
                          variant={
                            selectedFeatureId === feature.id ? 'default' : 'outline'
                          }
                          className="justify-start"
                          onClick={() => setSelectedFeatureId(feature.id)}
                        >
                          <div className="flex items-center">
                            {getFeatureIcon(feature)}
                            <span className="ml-2">{feature.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {getFeatureType(feature)}
                            </Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Tabs defaultValue="progress">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="progress">Análise de Progresso</TabsTrigger>
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    </TabsList>

                    <TabsContent value="progress" className="space-y-6 pt-4">
                      {/* Resumo do progresso */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Progresso do Treino
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Conclusão</span>
                                <span className="font-medium">
                                  {calculateTrainingProgress()}%
                                </span>
                              </div>
                              <Progress
                                value={calculateTrainingProgress()}
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Progresso da Dieta
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Conclusão</span>
                                <span className="font-medium">
                                  {calculateDietProgress()}%
                                </span>
                              </div>
                              <Progress value={calculateDietProgress()} className="h-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Análise de peso */}
                      {calculateWeightChange() && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Evolução de Peso
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Peso Inicial
                                </p>
                                <p className="text-lg font-medium">
                                  {calculateWeightChange()?.initial} kg
                                </p>
                              </div>
                              <div className="flex items-center">
                                {(calculateWeightChange()?.change ?? 0) > 0 ? (
                                  <TrendingUp className="h-5 w-5 text-red-500 mr-1" />
                                ) : (
                                  <TrendingUp className="h-5 w-5 text-green-500 mr-1 rotate-180" />
                                )}
                                <span
                                  className={`text-lg font-medium ${(calculateWeightChange()?.change ?? 0) > 0 ? 'text-red-500' : 'text-green-500'}`}
                                >
                                  {(calculateWeightChange()?.change ?? 0) > 0 ? '+' : ''}
                                  {calculateWeightChange()?.change.toFixed(1)} kg
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Peso Atual
                                </p>
                                <p className="text-lg font-medium">
                                  {calculateWeightChange()?.current} kg
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Últimos treinos */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Últimos Treinos
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {relatedData.trainingWeeks &&
                          relatedData.trainingWeeks.length > 0 ? (
                            relatedData.trainingWeeks
                              .slice(-3)
                              .reverse()
                              .map((week) => (
                                <div key={week.id} className="border rounded-md p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">
                                      Semana {week.weekNumber}
                                    </h4>
                                    <Badge
                                      variant={week.isCompleted ? 'default' : 'outline'}
                                    >
                                      {week.isCompleted ? 'Completo' : 'Em andamento'}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <p>
                                      Período: {formatDate(week.startDate)} -{' '}
                                      {formatDate(week.endDate)}
                                    </p>
                                    <p className="mt-1">
                                      {week.trainingDays?.length || 0} dias de treino |{' '}
                                      {week.trainingDays?.filter(
                                        (day: TrainingDayType) => day.isCompleted
                                      ).length || 0}{' '}
                                      dias concluídos
                                    </p>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhum treino registrado
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Últimas dietas */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Últimas Dietas
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {relatedData.diets && relatedData.diets.length > 0 ? (
                            relatedData.diets
                              .slice(-3)
                              .reverse()
                              .map((diet) => (
                                <div key={diet.id} className="border rounded-md p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">
                                      Semana {diet.weekNumber}
                                    </h4>
                                    <Badge
                                      variant={diet.isCurrent ? 'default' : 'outline'}
                                    >
                                      {diet.isCurrent ? 'Atual' : 'Anterior'}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <p>Calorias: {diet.totalCalories || 'N/A'} kcal</p>
                                    <div className="grid grid-cols-3 gap-2 mt-1">
                                      <p>P: {diet.totalProtein || 'N/A'}g</p>
                                      <p>C: {diet.totalCarbohydrates || 'N/A'}g</p>
                                      <p>G: {diet.totalFat || 'N/A'}g</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma dieta registrada
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      {/* Consultas e Retornos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Consultas
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {relatedData.consultations &&
                            relatedData.consultations.length > 0 ? (
                              relatedData.consultations.map((consultation) => (
                                <div
                                  key={consultation.id}
                                  className="border rounded-md p-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <Video className="h-4 w-4 text-amber-500 mr-2" />
                                      <span className="text-sm">
                                        {formatDate(consultation.startTime)}
                                      </span>
                                    </div>
                                    <Badge variant="outline">{consultation.status}</Badge>
                                  </div>
                                  {consultation.title && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {consultation.title}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nenhuma consulta registrada
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Retornos
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {relatedData.returns && relatedData.returns.length > 0 ? (
                              relatedData.returns.map((returnMeeting) => (
                                <div
                                  key={returnMeeting.id}
                                  className="border rounded-md p-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <RotateCcw className="h-4 w-4 text-indigo-500 mr-2" />
                                      <span className="text-sm">
                                        {formatDate(returnMeeting.startTime)}
                                      </span>
                                    </div>
                                    <Badge variant="outline">
                                      {returnMeeting.status}
                                    </Badge>
                                  </div>
                                  {returnMeeting.title && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {returnMeeting.title}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nenhum retorno registrado
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="feedback" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback Detalhado</Label>
                        <Textarea
                          id="feedback"
                          {...register('feedback')}
                          rows={10}
                          placeholder="Descreva o progresso do cliente, resultados observados, análise da dieta e treino, recomendações e próximos passos..."
                          disabled={isLoading}
                        />
                        {errors.feedback && (
                          <p className="text-sm text-red-500">
                            {errors.feedback.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateToResolve">Data para Resolução</Label>
                          <Input
                            id="dateToResolve"
                            type="date"
                            {...register('dateToResolve')}
                            disabled={isLoading}
                          />
                          {errors.dateToResolve && (
                            <p className="text-sm text-red-500">
                              {errors.dateToResolve.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkToResolve">
                            Link Relacionado (opcional)
                          </Label>
                          <Input
                            id="linkToResolve"
                            type="url"
                            placeholder="https://exemplo.com"
                            {...register('linkToResolve')}
                            disabled={isLoading}
                          />
                          {errors.linkToResolve && (
                            <p className="text-sm text-red-500">
                              {errors.linkToResolve.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !selectedFeatureId}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Feedback'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          {/* Coluna lateral - Informações do cliente e plano */}
          <div>
            <div className="space-y-6">
              {/* Card de informações do cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientData ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={clientData.imageUrl || '/placeholder.svg'}
                            alt={clientData.name}
                          />
                          <AvatarFallback>
                            {clientData.name
                              ? clientData.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{clientData.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {clientData.email}
                          </p>
                          {clientData.phone && (
                            <p className="text-sm text-muted-foreground">
                              {clientData.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {clientData.sex || 'N/A'}, {clientData.currentWeight || 'N/A'}
                            kg, {clientData.height || 'N/A'}cm
                          </span>
                        </div>
                        {clientData.currentBf && (
                          <div className="flex items-center text-sm">
                            <LineChart className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>BF: {clientData.currentBf}%</span>
                          </div>
                        )}
                        {clientData.birthDate && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatDate(clientData.birthDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {isLoading
                        ? 'Carregando dados do cliente...'
                        : 'Dados do cliente não disponíveis'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card de plano e features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plano e Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedData.purchaseInfo ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">
                          {relatedData.purchaseInfo.Plan?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Iniciado em: {formatDate(relatedData.purchaseInfo.createdAt)}
                        </p>
                        <Badge
                          className="mt-2"
                          variant={
                            relatedData.purchaseInfo.status === 'ACTIVE'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {relatedData.purchaseInfo.status}
                        </Badge>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Features do Plano</h4>
                        <div className="space-y-2">
                          {relatedData.features.map((feature) => (
                            <div
                              key={feature.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                {getFeatureIcon(feature)}
                                <span className="ml-2 text-sm">{feature.name}</span>
                              </div>
                              <Badge variant="outline">{getFeatureType(feature)}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {isLoading
                        ? 'Carregando dados do plano...'
                        : 'Dados do plano não disponíveis'}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Card de histórico de peso */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Peso</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedData.weights && relatedData.weights.length > 0 ? (
                    <div className="space-y-3">
                      {relatedData.weights
                        .slice(-5)
                        .reverse()
                        .map((weight) => (
                          <div
                            key={weight.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{formatDate(weight.date)}</span>
                            <div className="flex items-center">
                              <span className="font-medium">{weight.weight} kg</span>
                              {weight.bf && (
                                <span className="text-muted-foreground ml-2">
                                  ({weight.bf}% BF)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum registro de peso disponível
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ContainerContent>
    </>
  )
}
