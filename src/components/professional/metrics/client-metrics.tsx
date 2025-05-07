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
} from 'recharts'

type ClientMetricsProps = {
  data: {
    activeClients: number
    retentionRate: number
    newClients: {
      period: string
      count: number
    }[]
    clientsByType: {
      type: string
      count: number
    }[]
  }
}

export default function ClientMetrics({ data }: ClientMetricsProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Client Metrics</CardTitle>
        <CardDescription>Client acquisition and retention data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
              <p className="text-2xl font-bold">{data.activeClients}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
              <p className="text-2xl font-bold">{data.retentionRate}%</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              New Clients
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.newClients}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Clients by Type
            </h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart layout="vertical" data={data.clientsByType}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
