'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Calendar,
  Dumbbell,
  Apple,
  MessageSquare,
  Edit,
  Trash2,
  AlertCircle,
  LineChart,
  TrendingUp,
  ExternalLink,
  Video,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { toast } from 'sonner'
import useUser from '@/hooks/user-hooks'
import api from '@/lib/api'
import { formatDate } from '@/static'
import { Progress } from '@/components/ui/progress'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Client } from '@/types/userType'
import { TrainingWeekType, WeightType } from '@/types/TrainingType'
import { DietType } from '@/types/DietType'

export default function FeedbackDetails() {
  const { featureId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feature, setFeature] = useState<any>(null)
  const [relatedData, setRelatedData] = useState<{
    client: Client | null
    professional: any
    purchase: any
    trainingWeeks: TrainingWeekType[]
    diets: DietType[]
    weights: WeightType[]
    consultations: any[]
    returns: any[]
    features: any[]
  }>({
    client: null,
    professional: null,
    purchase: null,
    trainingWeeks: [],
    diets: [],
    weights: [],
    consultations: [],
    returns: [],
    features: [],
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchFeature = async () => {
      if (!featureId) return

      setIsLoading(true)
      try {
        // Buscar dados da feature
        const response = await api.get(`/features/${featureId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data) {
          setFeature(response.data)

          // Buscar dados do plano
          const planResponse = await api.get(`/plans/${response.data.planId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          // Buscar dados da compra
          const purchasesResponse = await api.get(
            `/purchases?planId=${response.data.planId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )

          if (!purchasesResponse.data || purchasesResponse.data.length === 0) {
            throw new Error('Compra não encontrada')
          }

          const purchase = purchasesResponse.data[0]
          const buyerId = purchase.buyerId
          const professionalId = purchase.professionalId

          if (buyerId && professionalId) {
            // Buscar todas as features do plano
            const features = planResponse.data?.features || []

            // Buscar dados do cliente e profissional
            const [clientRes, professionalRes] = await Promise.all([
              api.get(`/users/${buyerId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              api.get(`/users/${professionalId}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ])

            // Buscar dados relacionados
            const [trainingRes, dietRes, weightRes, consultationsRes, returnsRes] =
              await Promise.all([
                api.get(`/training-weeks?userId=${buyerId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                api.get(`/diets?userId=${buyerId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                api.get(`/weights?userId=${buyerId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                api.get(`/meetings?studentId=${buyerId}&type=CONSULTATION`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
                api.get(`/meetings?studentId=${buyerId}&type=RETURN`, {
                  headers: { Authorization: `Bearer ${token}` },
                }),
              ])

            setRelatedData({
              client: clientRes.data,
              professional: professionalRes.data,
              purchase: purchase,
              trainingWeeks: trainingRes.data || [],
              diets: dietRes.data || [],
              weights: weightRes.data || [],
              consultations: consultationsRes.data || [],
              returns: returnsRes.data || [],
              features: features,
            })
          }
        }
      } catch (err) {
        console.error('Erro ao buscar feedback:', err)
        setError('Falha ao carregar dados do feedback')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeature()
  }, [featureId, token])

  const handleDelete = async () => {
    if (!feature) return

    try {
      // Remover o feedback da feature (não excluir a feature)
      await api.patch(
        `/features/${feature.id}`,
        {
          feedback: '',
          isFeedback: false,
          dateToResolve: null,
          linkToResolve: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success('Feedback excluído com sucesso', {
        description: 'O feedback foi removido permanentemente.',
      })

      navigate('/feedback/list')
    } catch (err) {
      console.error('Erro ao excluir feedback:', err)
      toast.error('Erro ao excluir', {
        description: 'Não foi possível excluir o feedback. Tente novamente.',
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Função para calcular o progresso do treino
  const calculateTrainingProgress = () => {
    if (!relatedData.trainingWeeks || relatedData.trainingWeeks.length === 0) return 0

    const latestTrainingWeek =
      relatedData.trainingWeeks[relatedData.trainingWeeks.length - 1]

    if (!latestTrainingWeek || !latestTrainingWeek.trainingDays) return 0

    const totalExercises = latestTrainingWeek.trainingDays.reduce(
      (total, day) => total + (day.exercises?.length || 0),
      0
    )

    const completedExercises = latestTrainingWeek.trainingDays.reduce(
      (total, day) =>
        total + (day.exercises?.filter((ex) => ex.isCompleted)?.length || 0),
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
    const completedMeals = latestDiet.meals.filter((meal) => meal.isCompleted).length

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

  if (isLoading) {
    return (
      <ContainerContent>
        <LoadingSpinner />
      </ContainerContent>
    )
  }

  if (error || !feature || !feature.feedback) {
    return (
      <ContainerContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error || 'Feedback não encontrado'}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/feedback/list')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Lista
        </Button>
      </ContainerContent>
    )
  }

  const canEdit = user?.id === relatedData.professional?.id

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>{feature.name} - Feedback</ContainerTitle>
        <section className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/feedback/list')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>

          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    `/feedback/create?purchaseId=${relatedData.purchase?.id}&clientId=${relatedData.client?.id}&professionalId=${relatedData.professional?.id}&edit=true`
                  )
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir este feedback? Esta ação não pode ser
                      desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </section>
      </ContainerHeader>

      <ContainerContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna principal - Conteúdo do feedback */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{feature.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Atualizado em {formatDate(feature.updatedAt)}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-500 text-white">
                    Feedback
                  </Badge>
                </div>
                <div className="flex items-center mt-2">
                  <Badge className="mr-2" variant="outline">
                    {getFeatureType(feature)}
                  </Badge>
                  {feature.dateToResolve && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Data limite: {formatDate(feature.dateToResolve)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="feedback">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="progress">Análise de Progresso</TabsTrigger>
                  </TabsList>

                  <TabsContent value="feedback" className="pt-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-line">{feature.feedback}</p>
                    </div>

                    {feature.linkToResolve && (
                      <div className="mt-6">
                        <Button variant="outline" asChild className="w-full">
                          <a
                            href={feature.linkToResolve}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Acessar Link Relacionado
                          </a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

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
                              <p className="text-sm text-muted-foreground">Peso Atual</p>
                              <p className="text-lg font-medium">
                                {calculateWeightChange()?.current} kg
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Consultas e Retornos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Consultas</CardTitle>
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
                          <CardTitle className="text-sm font-medium">Retornos</CardTitle>
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
                                  <Badge variant="outline">{returnMeeting.status}</Badge>
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
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    Feedback por {relatedData.professional?.name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Referente ao plano: {relatedData.purchase?.Plan?.name}
                </div>
              </CardFooter>
            </Card>
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
                  {relatedData.client ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={relatedData.client.imageUrl || '/placeholder.svg'}
                            alt={relatedData.client.name}
                          />
                          <AvatarFallback>
                            {relatedData.client.name
                              ? relatedData.client.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{relatedData.client.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {relatedData.client.email}
                          </p>
                          {relatedData.client.phone && (
                            <p className="text-sm text-muted-foreground">
                              {relatedData.client.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {relatedData.client.sex || 'N/A'},{' '}
                            {relatedData.client.currentWeight || 'N/A'}kg,{' '}
                            {relatedData.client.height || 'N/A'}cm
                          </span>
                        </div>
                        {relatedData.client.currentBf && (
                          <div className="flex items-center text-sm">
                            <LineChart className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>BF: {relatedData.client.currentBf}%</span>
                          </div>
                        )}
                        {relatedData.client.birthDate && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatDate(relatedData.client.birthDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Dados do cliente não disponíveis
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

              {/* Card de features do plano */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features do Plano</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedData.features && relatedData.features.length > 0 ? (
                    <div className="space-y-2">
                      {relatedData.features.map((feat) => (
                        <div
                          key={feat.id}
                          className={`flex items-center justify-between p-2 rounded-md ${feat.id === feature.id ? 'bg-muted' : ''}`}
                        >
                          <div className="flex items-center">
                            {getFeatureIcon(feat)}
                            <span className="ml-2 text-sm">{feat.name}</span>
                          </div>
                          <Badge variant="outline">{getFeatureType(feat)}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma feature disponível
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Links para treinos e dietas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Treinos e Dietas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Treinos Recentes</h4>
                    {relatedData.trainingWeeks.length > 0 ? (
                      <div className="space-y-2">
                        {relatedData.trainingWeeks
                          .slice(-3)
                          .reverse()
                          .map((week) => (
                            <div
                              key={week.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <Dumbbell className="h-4 w-4 text-blue-500 mr-2" />
                                <span>Semana {week.weekNumber}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => navigate(`/training/${week.id}`)}
                              >
                                Ver
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum treino registrado
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Dietas Recentes</h4>
                    {relatedData.diets.length > 0 ? (
                      <div className="space-y-2">
                        {relatedData.diets
                          .slice(-3)
                          .reverse()
                          .map((diet) => (
                            <div
                              key={diet.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center">
                                <Apple className="h-4 w-4 text-green-500 mr-2" />
                                <span>Semana {diet.weekNumber}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => navigate(`/diet/${diet.id}`)}
                              >
                                Ver
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma dieta registrada
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ContainerContent>
    </>
  )
}
