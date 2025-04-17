'use client'

import { type Feature, defaultFeatures } from '@/types/PlanType'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dumbbell,
  Utensils,
  MessageSquare,
  Video,
  RotateCcw,
  LinkIcon,
} from 'lucide-react'

interface FeatureSelectorProps {
  selectedFeatures: Feature[]
  onFeaturesChange: (features: Feature[]) => void
}

export function FeatureSelector({
  selectedFeatures,
  onFeaturesChange,
}: FeatureSelectorProps) {
  const handleFeatureToggle = (feature: Feature) => {
    const isSelected = selectedFeatures.some((f) => f.id === feature.id)

    if (isSelected) {
      // Remove feature
      onFeaturesChange(selectedFeatures.filter((f) => f.id !== feature.id))
    } else {
      // Add feature
      onFeaturesChange([...selectedFeatures, feature])
    }
  }

  const getFeatureIcon = (feature: Feature) => {
    if (feature.isTrainingWeek) return <Dumbbell className="h-4 w-4" />
    if (feature.isDiet) return <Utensils className="h-4 w-4" />
    if (feature.isFeedback) return <MessageSquare className="h-4 w-4" />
    if (feature.isConsultation) return <Video className="h-4 w-4" />
    if (feature.isReturn) return <RotateCcw className="h-4 w-4" />
    if (feature.linkToResolve) return <LinkIcon className="h-4 w-4" />
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <h3 className="text-lg font-medium">Recursos do Plano</h3>
        <p className="text-sm text-muted-foreground">
          Selecione os recursos que estarão disponíveis neste plano
        </p>
      </div>

      <div className="space-y-2">
        {defaultFeatures.map((feature) => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox
              id={`feature-${feature.id}`}
              checked={selectedFeatures.some((f) => f.id === feature.id)}
              onCheckedChange={() => handleFeatureToggle(feature)}
            />
            <Label
              htmlFor={`feature-${feature.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              {getFeatureIcon(feature)}
              <span>{feature.name}</span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
