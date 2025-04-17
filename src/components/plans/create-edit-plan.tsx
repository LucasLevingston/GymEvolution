'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultFeatures, type Feature } from '@/types/PlanType'
import { usePlans } from '@/hooks/use-plans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeatureSelector } from '@/components/plans/feature-selector'
import { toast } from 'sonner'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function CreateEditPlan() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { createPlan, updatePlan, getPlanById, isLoading: plansLoading } = usePlans()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPlanData = async () => {
      if (isEditing && id) {
        try {
          setIsLoading(true)
          const plan = await getPlanById(id)
          if (plan) {
            setName(plan.name)
            setDescription(plan.description)
            setPrice(plan.price.toString())
            setDuration(plan.duration.toString())

            // Use as features que já vêm com o plano
            if (plan.features && Array.isArray(plan.features)) {
              if (typeof plan.features[0] === 'string') {
                // Se as features são strings, não usamos mais - apenas as pré-definidas
                setSelectedFeatures([])
              } else {
                // Já são objetos Feature - verificamos quais das pré-definidas estão selecionadas
                const selectedIds = plan.features.map((f: Feature) => f.id)
                const matchedFeatures = defaultFeatures.filter((f) =>
                  selectedIds.includes(f.id)
                )
                setSelectedFeatures(matchedFeatures)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching plan:', error)
          toast.error('Falha ao carregar dados do plano')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchPlanData()
  }, [id, isEditing, getPlanById])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !price || !duration) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    try {
      setIsLoading(true)

      const planData = {
        name,
        description,
        price: Number.parseFloat(price),
        duration: Number.parseInt(duration),
        features: selectedFeatures, // Enviar os objetos Feature completos
        isActive: true,
      }

      if (isEditing && id) {
        await updatePlan(id, planData)
        toast.success('Plano atualizado com sucesso')
      } else {
        await createPlan(planData)
        toast.success('Plano criado com sucesso')
      }

      navigate('/professional-plans')
    } catch (error) {
      console.error('Error saving plan:', error)
      toast.error('Falha ao salvar o plano')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || plansLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Editar Plano' : 'Criar Novo Plano'}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Plano Premium"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva os benefícios do plano"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.90"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duração (dias)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <FeatureSelector
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/professional-plans')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  <>{isEditing ? 'Atualizar Plano' : 'Criar Plano'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
