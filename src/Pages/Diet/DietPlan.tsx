import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, PlusCircleIcon } from 'lucide-react'
import { useDiets } from '@/hooks/use-diets'
import type { DietType } from '@/types/DietType'
import { Skeleton } from '@/components/ui/skeleton'
import useUser from '@/hooks/user-hooks'
import { DietComponent } from '@/components/diet/DietComponent'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'

export default function DietPlan() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getDiet } = useDiets()
  const { user } = useUser()
  const [diet, setDiet] = useState<DietType | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { dietId } = useParams()

  useEffect(() => {
    const fetchDiet = async () => {
      if (dietId) {
        const data = await getDiet(dietId)
        setDiet(data)

        return
      }

      if (user?.diets && user.diets.length > 0) {
        const dietToLoad = id
          ? user.diets.find((d) => d.id === id)
          : user.diets[user.diets.length - 1]

        if (dietToLoad) {
          setDiet(dietToLoad)
        } else {
          setError('Diet plan not found')
        }
      } else {
        setError('No diet plans available')
      }
    }

    fetchDiet()
    setIsLoading(false)
  }, [user, id])

  if (isLoading) {
    return (
      <>
        <div className="container mx-auto p-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/diet')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Skeleton className="h-10 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-[400px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>
          Diet Plan{diet?.weekNumber ? ` - Week ${diet.weekNumber}` : ''}
        </ContainerTitle>
        <section className="flex gap-2">
          <>
            <Button onClick={() => navigate('/training/create')} variant="secondary">
              Create new Diet
              <PlusCircleIcon className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={() => navigate('/diet/list')}>View past diets</Button>
          </>
        </section>
      </ContainerHeader>

      <ContainerContent>
        {diet ? (
          <DietComponent diet={diet} />
        ) : (
          <div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || 'Diet plan not found'}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/diet')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Diet Plans
            </Button>
          </div>
        )}
      </ContainerContent>
    </>
  )
}
