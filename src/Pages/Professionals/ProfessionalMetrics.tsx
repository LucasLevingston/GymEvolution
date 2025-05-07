'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfessionals } from '@/hooks/professional-hooks'
import MetricsOverview from '@/components/professional/metrics/metrics-overview'
import ClientMetrics from '@/components/professional/metrics/client-metrics'
import ReviewsMetrics from '@/components/professional/metrics/reviews-metrics'
import FinancialMetrics from '@/components/professional/metrics/financial-metrics'
import SalesMetrics from '@/components/professional/metrics/sales-metrics'
import { Skeleton } from '@/components/ui/skeleton'
import useUser from '@/hooks/user-hooks'

export default function ProfessionalMetrics() {
  const [timeRange, setTimeRange] = useState('month')
  const [metrics, setMetrics] = useState(null)
  const { getMetricsByProfessionalId, isLoading, error } = useProfessionals()
  const { user } = useUser()

  useEffect(() => {
    const loadMetrics = async () => {
      if (user?.id) {
        const data = await getMetricsByProfessionalId(user.id, timeRange)
        if (data) {
          setMetrics(data)
        }
      }
    }

    loadMetrics()
  }, [user, timeRange])

  if (isLoading || !metrics) {
    return <MetricsLoading />
  }

  if (error) {
    return <MetricsError message={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <MetricsOverview data={metrics.overview} />

      <div className="grid gap-6 md:grid-cols-2">
        <ClientMetrics data={metrics.clients} />
        <ReviewsMetrics data={metrics.reviews} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FinancialMetrics data={metrics.financial} timeRange={timeRange} />
        <SalesMetrics data={metrics.sales} />
      </div>
    </div>
  )
}

function MetricsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

function MetricsError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
      <h3 className="mb-2 text-lg font-medium">Error Loading Metrics</h3>
      <p className="text-sm text-muted-foreground">
        {message || 'Failed to load metrics data. Please try again later.'}
      </p>
    </div>
  )
}
