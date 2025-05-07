import type React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, Star, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'

type OverviewProps = {
  data: {
    totalClients: number
    averageRating: number
    totalRevenue: number
    totalSales: number
    growthRate: number
  }
}

export default function MetricsOverview({ data }: OverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Overview</CardTitle>
        <CardDescription>Your key performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <MetricCard
            title="Total Clients"
            value={data.totalClients}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Avg. Rating"
            value={data.averageRating}
            icon={<Star className="h-4 w-4 text-muted-foreground" />}
            formatter={(value) => value.toFixed(1)}
          />
          <MetricCard
            title="Revenue"
            value={data.totalRevenue}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <MetricCard
            title="Sales"
            value={data.totalSales}
            icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Growth"
            value={data.growthRate}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            formatter={(value) => `${value}%`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

type MetricCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  formatter?: (value: number) => string
}

function MetricCard({ title, value, icon, formatter }: MetricCardProps) {
  const displayValue = formatter ? formatter(value) : value.toString()

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-2xl font-bold">{displayValue}</div>
    </div>
  )
}
