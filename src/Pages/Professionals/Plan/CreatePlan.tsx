'use client'

import type React from 'react'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, X, Save, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/store/user-store'
import { ContainerRoot } from '@/components/Container'
import { usePlans } from '@/hooks/use-plans'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'

// Define available features by professional type
const NUTRITIONIST_FEATURES = [
  { id: 'initial_consultation', label: 'Consulta Inicial' },
  { id: 'follow_up', label: 'Consulta de Retorno' },
  { id: 'diet_plan', label: 'Plano Alimentar' },
  { id: 'nutritional_monitoring', label: 'Acompanhamento Nutricional' },
  { id: 'whatsapp_support', label: 'Suporte via WhatsApp' },
  { id: 'meal_planning', label: 'Planejamento de Refeições' },
  { id: 'body_composition_analysis', label: 'Análise de Composição Corporal' },
  { id: 'nutritional_education', label: 'Educação Nutricional' },
]

const TRAINER_FEATURES = [
  { id: 'initial_assessment', label: 'Avaliação Física Inicial' },
  { id: 'training_plan', label: 'Planilha de Treino' },
  { id: 'follow_up_session', label: 'Sessão de Acompanhamento' },
  { id: 'physical_monitoring', label: 'Monitoramento de Progresso' },
  { id: 'whatsapp_support', label: 'Suporte via WhatsApp' },
  { id: 'exercise_technique', label: 'Correção de Técnica de Exercícios' },
  { id: 'personalized_training', label: 'Treino Personalizado' },
  { id: 'performance_evaluation', label: 'Avaliação de Desempenho' },
]

export default function CreatePlan() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { createPlan, isLoading } = usePlans()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [customFeature, setCustomFeature] = useState('')
  const [customFeatures, setCustomFeatures] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [planType, setPlanType] = useState('predefined') // 'predefined' or 'custom'

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Determine which feature set to use based on user role
  const availableFeatures =
    user?.role === 'NUTRITIONIST' ? NUTRITIONIST_FEATURES : TRAINER_FEATURES

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!price.trim()) newErrors.price = 'Preço é obrigatório'
    else if (isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0)
      newErrors.price = 'Preço deve ser um valor positivo'

    if (!duration.trim()) newErrors.duration = 'Duração é obrigatória'
    else if (isNaN(Number.parseInt(duration)) || Number.parseInt(duration) <= 0)
      newErrors.duration = 'Duração deve ser um número inteiro positivo'

    if (planType === 'predefined' && selectedFeatures.length === 0)
      newErrors.features = 'Selecione pelo menos um recurso para o plano'
    else if (planType === 'custom' && customFeatures.length === 0)
      newErrors.features = 'Adicione pelo menos um recurso ao plano'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddCustomFeature = () => {
    if (!customFeature.trim()) return

    setCustomFeatures([...customFeatures, customFeature])
    setCustomFeature('')

    // Clear feature error if it exists
    if (errors.features) {
      const { features, ...rest } = errors
      setErrors(rest)
    }
  }

  const handleRemoveCustomFeature = (index: number) => {
    setCustomFeatures(customFeatures.filter((_, i) => i !== index))
  }

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    )

    // Clear feature error if it exists
    if (errors.features) {
      const { features, ...rest } = errors
      setErrors(rest)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!user) {
      navigate('/login')
      return
    }

    // Determine which features to use based on plan type
    const featuresToSave =
      planType === 'predefined'
        ? selectedFeatures.map(
            (id) => availableFeatures.find((f) => f.id === id)?.label || id
          )
        : customFeatures

    const planData = {
      name,
      description,
      price: Number.parseFloat(price),
      duration: Number.parseInt(duration),
      features: featuresToSave,
      professionalId: user.id,
      professionalType: user.role,
    }

    const result = await createPlan(planData)

    if (result) {
      navigate(`/professional-plans/${user.id}`)
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

  if (user.role === 'STUDENT') {
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

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/professional-plans/${user.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Planos
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Criar Novo Plano</h1>
      <p className="text-muted-foreground mb-8">
        Defina os detalhes do plano que você oferecerá aos seus clientes
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
            <CardDescription>Preencha os detalhes básicos do seu plano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (dias)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recursos do Plano</CardTitle>
            <CardDescription>
              Adicione os recursos que estão incluídos neste plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={planType} onValueChange={setPlanType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predefined">Recursos Pré-definidos</TabsTrigger>
                <TabsTrigger value="custom">Recursos Personalizados</TabsTrigger>
              </TabsList>

              <TabsContent value="predefined" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <Label htmlFor={feature.id} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.features && planType === 'predefined' && (
                  <p className="text-red-500 text-sm mt-2">{errors.features}</p>
                )}
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Consulta inicial detalhada"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    className={
                      errors.features && planType === 'custom' ? 'border-red-500' : ''
                    }
                  />
                  <Button type="button" onClick={handleAddCustomFeature}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                {errors.features && planType === 'custom' && (
                  <p className="text-red-500 text-sm mt-2">{errors.features}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {customFeatures.map((feat, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5">
                      {feat}
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomFeature(index)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Plano
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  )
}
