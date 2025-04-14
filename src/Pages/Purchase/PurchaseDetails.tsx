'use client'

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePurchases } from '@/hooks/purchase-hooks'
import { useUserStore } from '@/store/user-store'
import LoadingSpinner from '@/components/LoadingSpinner'
import {
  type RequiredAction,
  getActionsForRole,
} from '@/components/purchase-workflow/purchase-status-analyzer'
import RequiredActionsList from '@/components/purchase-workflow/required-actions-list'

export default function PurchaseDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getPurchaseById, isLoading } = usePurchases()
  const { user } = useUserStore()
  const [purchase, setPurchase] = useState<any | null>(null)
  const [requiredActions, setRequiredActions] = useState<RequiredAction[]>([])

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!id) return
      const data = await getPurchaseById(id)
      setPurchase(data)

      if (data) {
        // Determine user role
        const userRole =
          user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER'
            ? 'professional'
            : 'student'

        // Get actions for the current user
        const actions = getActionsForRole(data, userRole)
        setRequiredActions(actions)
      }
    }

    fetchPurchase()
  }, [id, user])

  if (isLoading || !purchase) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  // Determine if user is professional or student
  const isProfessional = user?.role === 'NUTRITIONIST' || user?.role === 'TRAINER'
  const isStudent = user?.role === 'STUDENT'

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-6 pl-0">
        <Link to="/purchases">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Compras
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Original purchase details component */}
          {/* This would be your existing PurchaseDetails component */}
          {/* We're adding the required actions section */}

          {/* Required Actions Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ações Necessárias</CardTitle>
            </CardHeader>
            <CardContent>
              <RequiredActionsList
                actions={requiredActions}
                title=""
                description=""
                emptyMessage={
                  isProfessional
                    ? 'Não há ações pendentes para você neste atendimento no momento'
                    : 'Não há ações pendentes para você nesta compra no momento'
                }
              />
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Sidebar content */}
          {/* This would be your existing sidebar content */}
        </div>
      </div>
    </div>
  )
}
