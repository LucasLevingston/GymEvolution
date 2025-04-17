'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import useUser from '@/hooks/user-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'

interface MetricsData {
  revenue: {
    total: number
    averageTicket: number
    recurring: number
    previousPeriodChange: number
    averageTicketChange: number
    recurringChange: number
    chartData?: any
  }
  clients: {
    total: number
    conversionRate: number
    active: number
    newClients: number
    conversionRateChange: number
    activeChange: number
    chartData?: any
  }
  retention: {
    rate: number
    renewals: number
    churnRate: number
    rateChange: number
    renewalsChange: number
    churnRateChange: number
    chartData?: any
  }
  ratings: {
    average: number
    total: number
    nps: number
    averageChange: number
    totalChange: number
    npsChange: number
    chartData?: any
  }
}

// Default metrics data to prevent undefined errors
const defaultMetrics: MetricsData = {
  revenue: {
    total: 0,
    averageTicket: 0,
    recurring: 0,
    previousPeriodChange: 0,
    averageTicketChange: 0,
    recurringChange: 0,
  },
  clients: {
    total: 0,
    conversionRate: 0,
    active: 0,
    newClients: 0,
    conversionRateChange: 0,
    activeChange: 0,
  },
  retention: {
    rate: 0,
    renewals: 0,
    churnRate: 0,
    rateChange: 0,
    renewalsChange: 0,
    churnRateChange: 0,
  },
  ratings: {
    average: 0,
    total: 0,
    nps: 0,
    averageChange: 0,
    totalChange: 0,
    npsChange: 0,
  },
}

export default function ProfessionalMetrics() {
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState('month')
  const [metrics, setMetrics] = useState<MetricsData>(defaultMetrics)
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('revenue')
  const { getMetricsByProfessionalId } = useProfessionals()

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await getMetricsByProfessionalId(user.id, timeRange)
        console.log(data)
        if (data && typeof data === 'object') {
          setMetrics({
            revenue: {
              total: data.revenue?.total ?? 0,
              averageTicket: data.revenue?.averageTicket ?? 0,
              recurring: data.revenue?.recurring ?? 0,
              previousPeriodChange: data.revenue?.previousPeriodChange ?? 0,
              averageTicketChange: data.revenue?.averageTicketChange ?? 0,
              recurringChange: data.revenue?.recurringChange ?? 0,
            },
            clients: {
              total: data.clients?.total ?? 0,
              conversionRate: data.clients?.conversionRate ?? 0,
              active: data.clients?.active ?? 0,
              newClients: data.clients?.newClients ?? 0,
              conversionRateChange: data.clients?.conversionRateChange ?? 0,
              activeChange: data.clients?.activeChange ?? 0,
            },
            retention: {
              rate: data.retention?.rate ?? 0,
              renewals: data.retention?.renewals ?? 0,
              churnRate: data.retention?.churnRate ?? 0,
              rateChange: data.retention?.rateChange ?? 0,
              renewalsChange: data.retention?.renewalsChange ?? 0,
              churnRateChange: data.retention?.churnRateChange ?? 0,
            },
            ratings: {
              average: data.ratings?.average ?? 0,
              total: data.ratings?.total ?? 0,
              nps: data.ratings?.nps ?? 0,
              averageChange: data.ratings?.averageChange ?? 0,
              totalChange: data.ratings?.totalChange ?? 0,
              npsChange: data.ratings?.npsChange ?? 0,
            },
          })
        } else {
          // If data is not in expected format, use default metrics
          setMetrics(defaultMetrics)
          setError('Formato de dados inválido recebido do servidor')
        }
      } catch (err) {
        console.error('Error fetching metrics:', err)
        setError('Não foi possível carregar as métricas. Tente novamente mais tarde.')
        // Set default metrics to prevent undefined errors
        setMetrics(defaultMetrics)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [user?.id, timeRange])

  // useEffect(() => {
  //   const fetchChartData = async () => {
  //     if (!user?.id || !activeTab) return

  //     try {
  //       const response = await fetch(
  //         `/api/professional/${user.id}/metrics/chart-data?timeRange=${timeRange}&chartType=${activeTab}`
  //       )

  //       if (!response.ok) {
  //         throw new Error(`Error fetching chart data: ${response.status}`)
  //       }

  //       const data = await response.json()

  //       // Validate chart data structure
  //       if (data.labels && data.datasets && Array.isArray(data.datasets)) {
  //         setChartData(data)
  //       } else {
  //         console.error('Invalid chart data format:', data)
  //         setChartData(null)
  //       }
  //     } catch (err) {
  //       console.error('Error fetching chart data:', err)
  //       setChartData(null)
  //     }
  //   }

  //   fetchChartData()
  // }, [user?.id, timeRange, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const renderLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  const renderErrorState = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={() => setTimeRange(timeRange)}
          className="text-sm text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </CardContent>
    </Card>
  )

  const renderRevenueChart = () => {
    if (
      !chartData ||
      !chartData.labels ||
      !chartData.datasets ||
      chartData.datasets.length < 2
    ) {
      return (
        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          Dados insuficientes para gerar o gráfico
        </div>
      )
    }

    // Safely create chart data
    const chartDataPoints = chartData.labels.map((label: string, index: number) => ({
      name: label,
      total: chartData.datasets[0]?.data?.[index] ?? 0,
      recurring: chartData.datasets[1]?.data?.[index] ?? 0,
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartDataPoints}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
          <Line
            type="monotone"
            dataKey="total"
            name="Receita Total"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="recurring"
            name="Receita Recorrente"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const renderClientsChart = () => {
    if (
      !chartData ||
      !chartData.labels ||
      !chartData.datasets ||
      chartData.datasets.length < 2
    ) {
      return (
        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          Dados insuficientes para gerar o gráfico
        </div>
      )
    }

    // Safely create chart data
    const chartDataPoints = chartData.labels.map((label: string, index: number) => ({
      name: label,
      total: chartData.datasets[0]?.data?.[index] ?? 0,
      new: chartData.datasets[1]?.data?.[index] ?? 0,
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartDataPoints}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="total"
            name="Total de Clientes"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
          <Bar dataKey="new" name="Novos Clientes" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderRetentionChart = () => {
    if (
      !chartData ||
      !chartData.labels ||
      !chartData.datasets ||
      chartData.datasets.length < 2
    ) {
      return (
        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          Dados insuficientes para gerar o gráfico
        </div>
      )
    }

    // Safely create chart data
    const chartDataPoints = chartData.labels.map((label: string, index: number) => ({
      name: label,
      retention: chartData.datasets[0]?.data?.[index] ?? 0,
      churn: chartData.datasets[1]?.data?.[index] ?? 0,
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartDataPoints}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
          <Line
            type="monotone"
            dataKey="retention"
            name="Taxa de Retenção"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="churn"
            name="Taxa de Churn"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const renderRatingsChart = () => {
    if (
      !chartData ||
      !chartData.datasets ||
      chartData.datasets.length < 2 ||
      !chartData.datasets[1]?.data
    ) {
      return (
        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
          Dados insuficientes para gerar o gráfico
        </div>
      )
    }

    // Safely create distribution data
    const distributionData = [
      { name: '1 estrela', value: chartData.datasets[1].data[0] ?? 0 },
      { name: '2 estrelas', value: chartData.datasets[1].data[1] ?? 0 },
      { name: '3 estrelas', value: chartData.datasets[1].data[2] ?? 0 },
      { name: '4 estrelas', value: chartData.datasets[1].data[3] ?? 0 },
      { name: '5 estrelas', value: chartData.datasets[1].data[4] ?? 0 },
    ]

    // Ensure backgroundColor exists
    const backgroundColors = chartData.datasets[1].backgroundColor || [
      '#ef4444', // red
      '#f97316', // orange
      '#eab308', // yellow
      '#84cc16', // lime
      '#10b981', // green
    ]

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
          >
            {distributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  backgroundColors[index] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} avaliações`} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Format number safely
  const formatNumber = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0,00'
    return value.toFixed(2).replace('.', ',')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas e Desempenho</h1>
          <p className="text-muted-foreground">
            Acompanhe seus resultados e desempenho profissional
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
            <SelectItem value="quarter">Último Trimestre</SelectItem>
            <SelectItem value="year">Último Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        renderErrorState()
      ) : (
        <Tabs defaultValue="revenue" className="w-full" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="retention">Retenção</TabsTrigger>
            <TabsTrigger value="ratings">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Receita Total</CardTitle>
                      <CardDescription>Período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        R$ {formatNumber(metrics.revenue.total)}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.revenue.previousPeriodChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.revenue.previousPeriodChange || 0) >= 0 ? '+' : ''}
                        {metrics.revenue.previousPeriodChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ticket Médio</CardTitle>
                      <CardDescription>Valor médio por cliente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        R$ {formatNumber(metrics.revenue.averageTicket)}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.revenue.averageTicketChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.revenue.averageTicketChange || 0) >= 0 ? '+' : ''}
                        {metrics.revenue.averageTicketChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Receita Recorrente</CardTitle>
                      <CardDescription>Assinaturas ativas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        R$ {formatNumber(metrics.revenue.recurring)}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.revenue.recurringChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.revenue.recurringChange || 0) >= 0 ? '+' : ''}
                        {metrics.revenue.recurringChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Evolução da Receita</CardTitle>
                    <CardDescription>Visualização ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>{renderRevenueChart()}</CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total de Clientes</CardTitle>
                      <CardDescription>Período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.clients.total || 0}
                      </div>
                      <p className="text-sm text-green-600 mt-2">
                        +{metrics.clients.newClients || 0} novos clientes
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Taxa de Conversão</CardTitle>
                      <CardDescription>Leads para clientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.clients.conversionRate || 0}%
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.clients.conversionRateChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.clients.conversionRateChange || 0) >= 0 ? '+' : ''}
                        {metrics.clients.conversionRateChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Clientes Ativos</CardTitle>
                      <CardDescription>Com planos em andamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.clients.active || 0}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.clients.activeChange || 0) >= 0 ? 'text-green-600' : 'text-amber-600'}`}
                      >
                        {(metrics.clients.activeChange || 0) >= 0 ? '+' : ''}
                        {metrics.clients.activeChange || 0} em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Distribuição de Clientes</CardTitle>
                    <CardDescription>Por tipo de plano</CardDescription>
                  </CardHeader>
                  <CardContent>{renderClientsChart()}</CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="retention" className="mt-6">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Taxa de Retenção</CardTitle>
                      <CardDescription>Período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.retention.rate || 0}%
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.retention.rateChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.retention.rateChange || 0) >= 0 ? '+' : ''}
                        {metrics.retention.rateChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Renovações</CardTitle>
                      <CardDescription>Planos renovados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.retention.renewals || 0}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.retention.renewalsChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.retention.renewalsChange || 0) >= 0 ? '+' : ''}
                        {metrics.retention.renewalsChange || 0} em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Churn Rate</CardTitle>
                      <CardDescription>Taxa de cancelamento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.retention.churnRate || 0}%
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.retention.churnRateChange || 0) <= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.retention.churnRateChange || 0) >= 0 ? '+' : ''}
                        {metrics.retention.churnRateChange || 0}% em relação ao período
                        anterior
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Ciclo de Vida do Cliente</CardTitle>
                    <CardDescription>Duração média da relação</CardDescription>
                  </CardHeader>
                  <CardContent>{renderRetentionChart()}</CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="ratings" className="mt-6">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avaliação Média</CardTitle>
                      <CardDescription>Período selecionado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {(metrics.ratings.average || 0).toFixed(1)}/5.0
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.ratings.averageChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.ratings.averageChange || 0) >= 0 ? '+' : ''}
                        {(metrics.ratings.averageChange || 0).toFixed(1)} em relação ao
                        período anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Total de Avaliações</CardTitle>
                      <CardDescription>Avaliações recebidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {metrics.ratings.total || 0}
                      </div>
                      <p
                        className={`text-sm mt-2 ${(metrics.ratings.totalChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.ratings.totalChange || 0) >= 0 ? '+' : ''}
                        {metrics.ratings.totalChange || 0} em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>NPS</CardTitle>
                      <CardDescription>Net Promoter Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{metrics.ratings.nps || 0}</div>
                      <p
                        className={`text-sm mt-2 ${(metrics.ratings.npsChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {(metrics.ratings.npsChange || 0) >= 0 ? '+' : ''}
                        {metrics.ratings.npsChange || 0} em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Distribuição de Avaliações</CardTitle>
                    <CardDescription>Por número de estrelas</CardDescription>
                  </CardHeader>
                  <CardContent>{renderRatingsChart()}</CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
