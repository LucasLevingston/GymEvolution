'use client'

import { useState, useEffect } from 'react'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getFeaturesForRole, type Feature, FeatureType } from '@/types/PlanType'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FeatureSelectorProps {
  selectedFeatures: Feature[]
  onFeaturesChange: (features: Feature[]) => void
  planDuration?: number
  userRole?: string
}

export function FeatureSelector({
  selectedFeatures,
  onFeaturesChange,
  planDuration = 30,
  userRole,
}: FeatureSelectorProps) {
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([])
  const [feedbackFrequency, setFeedbackFrequency] = useState<
    'weekly' | 'biweekly' | 'monthly'
  >('weekly')

  // Set available features based on user role
  useEffect(() => {
    const features = getFeaturesForRole(userRole)
    setAvailableFeatures(features)
  }, [userRole])

  const isFeatureSelected = (feature: Feature) => {
    return selectedFeatures.some((f) => f.id === feature.id)
  }

  const toggleFeature = (feature: Feature) => {
    if (isFeatureSelected(feature)) {
      // If it's a feedback feature, remove all generated feedback features
      if (feature.type === FeatureType.FEEDBACK) {
        onFeaturesChange(selectedFeatures.filter((f) => f.type !== FeatureType.FEEDBACK))
      } else {
        onFeaturesChange(selectedFeatures.filter((f) => f.id !== feature.id))
      }
    } else {
      // If it's a feedback feature, generate multiple feedback features based on plan duration
      if (feature.type === FeatureType.FEEDBACK) {
        const feedbackFeatures = generateFeedbackFeatures(
          feature,
          planDuration,
          feedbackFrequency
        )
        onFeaturesChange([
          ...selectedFeatures.filter((f) => f.type !== FeatureType.FEEDBACK),
          ...feedbackFeatures,
        ])
      } else {
        onFeaturesChange([...selectedFeatures, feature])
      }
    }
  }

  const generateFeedbackFeatures = (
    baseFeature: Feature,
    duration: number,
    frequency: 'weekly' | 'biweekly' | 'monthly'
  ): Feature[] => {
    const feedbackFeatures: Feature[] = []
    let interval: number
    let feedbackCount: number

    switch (frequency) {
      case 'weekly':
        interval = 7
        feedbackCount = Math.floor(duration / 7)
        break
      case 'biweekly':
        interval = 14
        feedbackCount = Math.floor(duration / 14)
        break
      case 'monthly':
        interval = 30
        feedbackCount = Math.floor(duration / 30)
        break
      default:
        interval = 7
        feedbackCount = Math.floor(duration / 7)
    }

    // Ensure at least one feedback if the duration is shorter than the interval
    feedbackCount = Math.max(feedbackCount, 1)

    for (let i = 0; i < feedbackCount; i++) {
      const dayNumber = (i + 1) * interval
      const adjustedDay = Math.min(dayNumber, duration)

      feedbackFeatures.push({
        ...baseFeature,
        id: `${baseFeature.id}-${i + 1}`,
        name: `Feedback ${i + 1} (Dia ${adjustedDay})`,
        feedback: `Feedback ${frequency === 'weekly' ? 'semanal' : frequency === 'biweekly' ? 'quinzenal' : 'mensal'} - Dia ${adjustedDay}`,
        scheduledDay: adjustedDay,
      })
    }

    return feedbackFeatures
  }

  const handleFeedbackFrequencyChange = (value: string) => {
    const frequency = value as 'weekly' | 'biweekly' | 'monthly'
    setFeedbackFrequency(frequency)

    // Update existing feedback features if any are selected
    const feedbackFeature = availableFeatures.find((f) => f.type === FeatureType.FEEDBACK)
    if (
      feedbackFeature &&
      selectedFeatures.some((f) => f.type === FeatureType.FEEDBACK)
    ) {
      const updatedFeatures = selectedFeatures.filter(
        (f) => f.type !== FeatureType.FEEDBACK
      )
      const newFeedbackFeatures = generateFeedbackFeatures(
        feedbackFeature,
        planDuration,
        frequency
      )
      onFeaturesChange([...updatedFeatures, ...newFeedbackFeatures])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableFeatures.map((feature) => {
          // Special handling for feedback feature
          if (feature.type === FeatureType.FEEDBACK) {
            const isFeedbackSelected = selectedFeatures.some(
              (f) => f.type === FeatureType.FEEDBACK
            )

            return (
              <Card
                key={feature.id}
                className={`border ${isFeedbackSelected ? 'border-primary' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={isFeedbackSelected}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {feature.name}
                      </label>

                      {isFeedbackSelected && (
                        <div className="mt-3">
                          <Label
                            htmlFor="feedback-frequency"
                            className="text-xs text-muted-foreground mb-1 block"
                          >
                            Frequência de feedback
                          </Label>
                          <Select
                            value={feedbackFrequency}
                            onValueChange={handleFeedbackFrequencyChange}
                          >
                            <SelectTrigger id="feedback-frequency" className="w-full">
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="biweekly">Quinzenal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Feedbacks serão agendados automaticamente com base na duração
                            do plano
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {isFeedbackSelected && (
                    <div className="mt-2 pl-7">
                      <p className="text-xs text-muted-foreground mb-2">
                        Feedbacks programados (
                        {
                          selectedFeatures.filter((f) => f.type === FeatureType.FEEDBACK)
                            .length
                        }
                        ):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFeatures
                          .filter((f) => f.type === FeatureType.FEEDBACK)
                          .map((f, index) => (
                            <Badge key={index} variant="outline">
                              Dia {f.scheduledDay}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          }

          // Regular feature display
          return (
            <Card
              key={feature.id}
              className={`border ${isFeatureSelected(feature) ? 'border-primary' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={isFeatureSelected(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <div>
                    <label
                      htmlFor={`feature-${feature.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {feature.name}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Recursos selecionados:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedFeatures.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum recurso selecionado</p>
          ) : (
            selectedFeatures.map((feature, index) => (
              <Badge key={index} className="flex items-center gap-1">
                {feature.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleFeature(feature)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
