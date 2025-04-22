'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { DietComponent } from '@/components/diet/DietComponent'
import useUser from '@/hooks/user-hooks'
import { ClipboardIcon, Edit, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { DietType } from '@/types/DietType'
import { useDiets } from '@/hooks/use-diets'

export const ListDiets = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const { updateDiet } = useDiets()
  const [selectedDietId, setSelectedDietId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDiet, setCurrentDiet] = useState<DietType | null>(null)

  if (!user || !user.diets.length) {
    return (
      <>
        <div className="container mx-auto p-4">
          <h1 className="mb-6 text-3xl font-bold">Past Diets</h1>
          <p>No past diets available.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/current-diet')}
          >
            <ClipboardIcon className="mr-2 h-4 w-4" />
            View Current Diet
          </Button>
        </div>
      </>
    )
  }

  // Initialize the selected diet
  const selectedDiet =
    user.diets.find((diet) => diet.id === selectedDietId) || user.diets[0]

  // Initialize currentDiet if it's null and selectedDiet exists
  if (!currentDiet && selectedDiet) {
    setCurrentDiet(selectedDiet)
  }

  const handleDietSelect = (dietId: string) => {
    setSelectedDietId(dietId)
    const newSelectedDiet = user.diets.find((diet) => diet.id === dietId)
    if (newSelectedDiet) {
      setCurrentDiet(newSelectedDiet)
      setIsEditing(false) // Reset editing state when changing diets
    }
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  return (
    <>
      <ContainerHeader className="mb-6 flex items-center justify-between">
        <ContainerTitle>Past Diets</ContainerTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={toggleEditMode} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={toggleEditMode}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Diet
              </Button>
              <Button variant="outline" onClick={() => navigate('/diet')}>
                <ClipboardIcon className="mr-2 h-4 w-4" />
                View Current Diet
              </Button>
            </>
          )}
        </div>
      </ContainerHeader>

      <ContainerContent>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a Diet Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={handleDietSelect}
              defaultValue={selectedDiet.id}
              value={selectedDietId || selectedDiet.id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a diet plan" />
              </SelectTrigger>
              <SelectContent>
                {user.diets.map((diet) => (
                  <SelectItem key={diet.id} value={diet.id!}>
                    Week {diet.weekNumber} - {diet.createdAt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {currentDiet && <DietComponent diet={selectedDiet} readOnly={!isEditing} />}
      </ContainerContent>
    </>
  )
}
