import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type SalesMetricsProps = {
  data: {
    totalSales: number
    conversionRate: number
    averageOrderValue: number
    salesByPeriod: {
      period: string
      sales: number
    }[]
    salesByPlan: {
      plan: string
      sales: number
    }[]
    topSellingPlans: {
      name: string
      count: number
      revenue: number
    }[]
  }
}

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e']

export default function SalesMetrics({ data }: SalesMetricsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Sales Metrics</CardTitle>
        <CardDescription>Sales performance and conversion data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{data.totalSales}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{data.conversionRate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold">${data.averageOrderValue}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Sales Trend
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.salesByPeriod}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Sales by Plan
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.salesByPlan}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  nameKey="plan"
                  label={({ plan, sales }) => `${plan}: ${sales}`}
                >
                  {data.salesByPlan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} sales`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Top Selling Plans
            </h4>
            <div className="space-y-2">
              {data.topSellingPlans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">{plan.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm">{plan.count} sales</p>
                    <p className="text-sm font-medium">
                      ${plan.revenue.toLocaleString()}
                    </p>
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
