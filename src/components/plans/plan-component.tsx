'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useUserStore } from '@/store/user-store'
import { ContainerRoot } from '@/components/Container'
import { usePlans } from '@/hooks/use-plans'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FeatureSelector } from '@/components/plans/feature-selector'
import { type Feature, Plan, defaultFeatures } from '@/types/PlanType'

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().optional(),
  price: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return num && num > 0
    },
    { message: 'Preço deve ser um valor positivo' }
  ),
  duration: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return num && num > 0
    },
    { message: 'Duração deve ser um número inteiro positivo' }
  ),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface PlanComponentProps {
  mode: 'create' | 'edit'
}

export default function PlanComponent({ mode }: PlanComponentProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useUserStore()
  const { getPlanById, createPlan, updatePlan, isLoading } = usePlans()

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([])
  const [featuresError, setFeaturesError] = useState<string | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(mode === 'edit')

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration: '',
      isActive: true,
    },
  })

  useEffect(() => {
    const fetchPlan = async () => {
      if (mode === 'edit' && id) {
        try {
          setIsInitialLoading(true)
          const plan = await getPlanById(id)
          if (plan) {
            // Set form values
            form.reset({
              name: plan.name,
              description: plan.description || '',
              price: plan.price.toString(),
              duration: plan.duration.toString(),
              isActive: plan.isActive,
            })

            // Set features
            if (plan.features && Array.isArray(plan.features)) {
              if (typeof plan.features[0] === 'string') {
                // Converter strings para objetos Feature
                const featureObjects = plan.features.map((featureName: string) => {
                  // Procurar uma feature pré-definida com nome correspondente
                  const matchedFeature = defaultFeatures.find(
                    (f) => f.name === featureName
                  )
                  if (matchedFeature) {
                    return matchedFeature
                  }

                  // Se não encontrar, criar um objeto Feature básico
                  return {
                    id: `legacy-${featureName}`,
                    name: featureName,
                    isTrainingWeek: false,
                    isDiet: false,
                    isFeedback: false,
                    feedback: '',
                    isConsultation: false,
                    consultationMeetingId: '',
                    isReturn: false,
                    returnMeetingId: '',
                  }
                })

                setSelectedFeatures(featureObjects)
              } else {
                // Já são objetos Feature
                setSelectedFeatures(plan.features)
              }
            }
          } else {
            navigate('/professional-plans')
          }
        } catch (error) {
          console.error('Error fetching plan:', error)
        } finally {
          setIsInitialLoading(false)
        }
      }
    }

    fetchPlan()
  }, [id, getPlanById, navigate, form, mode])

  const onSubmit = async (values: FormValues) => {
    // Validate features
    if (selectedFeatures.length === 0) {
      setFeaturesError('Adicione pelo menos um recurso ao plano')
      return
    } else {
      setFeaturesError(null)
    }

    if (!user) {
      navigate('/login')
      return
    }

    const planData = {
      name: values.name,
      description: values.description,
      price: Number.parseFloat(values.price),
      duration: Number.parseInt(values.duration),
      features: selectedFeatures,
      isActive: values.isActive,
      professionalId: user.id,
    }

    try {
      let result: Plan
      if (mode === 'edit' && id) {
        result = await updatePlan(id, planData)
      } else {
        result = await createPlan(planData)
      }

      if (result) {
        navigate(`/professional-plans/${user.id}`)
      }
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }

  if (!user) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Por favor, faça login</h2>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </ContainerRoot>
    )
  }

  if (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER') {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-8">
            Esta área é exclusiva para nutricionistas e personal trainers.
          </p>
          <Button asChild>
            <Link to="/register-professional">Cadastrar como Profissional</Link>
          </Button>
        </div>
      </ContainerRoot>
    )
  }

  if (isInitialLoading) {
    return (
      <ContainerRoot>
        <LoadingSpinner />
      </ContainerRoot>
    )
  }

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/professional-plans/${user.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Planos
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">
        {mode === 'create' ? 'Criar Novo Plano' : 'Editar Plano'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {mode === 'create'
          ? 'Defina os detalhes do plano que você oferecerá aos seus clientes'
          : 'Atualize os detalhes do seu plano'}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Plano</CardTitle>
              <CardDescription>
                {mode === 'create'
                  ? 'Preencha os detalhes básicos do seu plano'
                  : 'Atualize os detalhes básicos do seu plano'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Plano Premium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        placeholder="Descreva os benefícios do plano"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          placeholder="99.90"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} placeholder="30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Plano ativo</FormLabel>
                      <FormDescription>Disponível para contratação</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recursos do Plano</CardTitle>
              <CardDescription>
                Selecione os recursos que estarão incluídos neste plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeatureSelector
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
              />
              {featuresError && <p className="text-red-500 text-sm">{featuresError}</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(`/professional-plans/${user.id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {mode === 'create' ? 'Criando...' : 'Salvando...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === 'create' ? 'Criar Plano' : 'Salvar Alterações'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  )
}
