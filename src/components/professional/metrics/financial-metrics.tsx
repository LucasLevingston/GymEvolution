import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type FinancialMetricsProps = {
  data: {
    totalRevenue: number
    monthlyRecurring: number
    averageClientValue: number
    revenueByPeriod: {
      period: string
      revenue: number
    }[]
    revenueByPlanType: {
      planType: string
      revenue: number
    }[]
  }
  timeRange: string
}

export default function FinancialMetrics({ data }: FinancialMetricsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Financial Metrics</CardTitle>
        </div>
        <CardDescription>Revenue and financial performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Recurring
              </p>
              <p className="text-2xl font-bold">
                ${data.monthlyRecurring.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Client Value
              </p>
              <p className="text-2xl font-bold">
                ${data.averageClientValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Revenue Trend
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.revenueByPeriod}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Revenue by Plan Type
            </h4>
            <div className="space-y-2">
              {data.revenueByPlanType.map((item) => (
                <div key={item.planType} className="flex items-center justify-between">
                  <p className="text-sm">{item.planType}</p>
                  <div className="flex items-center">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(item.revenue / data.totalRevenue) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="ml-2 text-sm">${item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
