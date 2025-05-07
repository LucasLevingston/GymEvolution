import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ContainerContent, ContainerHeader, ContainerTitle } from '@/components/Container'
import { TrainingWeekCard } from '@/components/training/training-week-card'
import { Button } from '@/components/ui/button'
import { ClipboardIcon } from 'lucide-react'
import { useUser } from '@/hooks/user-hooks'
import { usePurchases } from '@/hooks/purchase-hooks'

export default function CreateTraining() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const { getPurchaseById } = usePurchases()
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)

  const searchParams = new URLSearchParams(location.search)
  const purchaseId = searchParams.get('purchaseId')
  const featureId = searchParams.get('featureId')
  const clientId = searchParams.get('clientId')
  const professionalId = searchParams.get('professionalId')

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (purchaseId) {
        try {
          setLoading(true)
          const purchase = await getPurchaseById(purchaseId)
          if (purchase?.buyer.name) {
            setClientName(purchase?.buyer?.name)
          }
        } catch (error) {
          console.error('Error fetching purchase details:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchPurchaseDetails()
  }, [purchaseId])

  const initialData = {
    weekNumber: 1,
    trainingDays: [],
    information: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    isCompleted: false,
    userId: clientId || user?.id,
    purchaseId: purchaseId || undefined,
    featureId: featureId || undefined,
    professionalId: professionalId || user?.id,
  }

  return (
    <>
      <ContainerHeader>
        <div className="flex items-center">
          <ContainerTitle>
            {clientName ? `Criar Treino para ${clientName}` : 'Criar Novo Treino'}
          </ContainerTitle>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/training')} variant="secondary">
            Ver treinos
            <ClipboardIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </ContainerHeader>
      <ContainerContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Carregando...</p>
          </div>
        ) : (
          <TrainingWeekCard isCreating={true} initialData={initialData} />
        )}
      </ContainerContent>
    </>
  )
}
