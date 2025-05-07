export function calculateDateRanges(timeRange: string) {
  const now = new Date()
  let currentPeriodStart: Date
  const currentPeriodEnd: Date = new Date(now)

  switch (timeRange) {
    case 'week':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setDate(now.getDate() - 7)
      break

    case 'month':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setMonth(now.getMonth() - 1)
      break

    case 'quarter':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setMonth(now.getMonth() - 3)
      break

    case 'year':
      currentPeriodStart = new Date(now)
      currentPeriodStart.setFullYear(now.getFullYear() - 1)
      break

    default:
      // Default to month
      currentPeriodStart = new Date(now)
      currentPeriodStart.setMonth(now.getMonth() - 1)
  }

  return {
    currentPeriodStart,
    currentPeriodEnd,
  }
}

/**
 * Generate chart data based on the chart type
 */
export async function generateChartData(
  professionalId: string,
  chartType: string,
  startDate: Date,
  endDate: Date,
  timeRange: string
) {
  // Determine the interval based on the time range
  let interval: 'day' | 'week' | 'month'
  switch (timeRange) {
    case 'week':
      interval = 'day'
      break
    case 'month':
      interval = 'day'
      break
    case 'quarter':
      interval = 'week'
      break
    case 'year':
      interval = 'month'
      break
    default:
      interval = 'day'
  }

  // Generate date labels based on the interval
  const labels = generateDateLabels(startDate, endDate, interval)

  // Generate data points based on the chart type and interval
  let datasets = []

  switch (chartType) {
    case 'revenue':
      datasets = await generateRevenueChartData(
        professionalId,
        startDate,
        endDate,
        interval,
        labels
      )
      break
    case 'clients':
      datasets = await generateClientsChartData(
        professionalId,
        startDate,
        endDate,
        interval,
        labels
      )
      break
    case 'retention':
      datasets = await generateRetentionChartData(
        professionalId,
        startDate,
        endDate,
        interval,
        labels
      )
      break
    case 'ratings':
      datasets = await generateRatingsChartData(
        professionalId,
        startDate,
        endDate,
        interval,
        labels
      )
      break
    default:
      datasets = await generateRevenueChartData(
        professionalId,
        startDate,
        endDate,
        interval,
        labels
      )
  }

  return {
    labels,
    datasets,
  }
}

/**
 * Generate date labels based on the interval
 */
function generateDateLabels(
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month'
) {
  const labels = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    let label

    switch (interval) {
      case 'day':
        label = currentDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })
        currentDate.setDate(currentDate.getDate() + 1)
        break
      case 'week':
        label = `Semana ${Math.ceil((currentDate.getDate() + currentDate.getDay()) / 7)}`
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case 'month':
        label = currentDate.toLocaleDateString('pt-BR', { month: 'short' })
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
    }

    labels.push(label)
  }

  return labels
}

/**
 * Generate revenue chart data
 */
async function generateRevenueChartData(
  professionalId: string,
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month',
  labels: string[]
) {
  // In a real implementation, you would query the database to get revenue data
  // For now, we'll generate random data
  const totalRevenueData = labels.map(() => Math.floor(Math.random() * 5000) + 1000)
  const recurringRevenueData = labels.map(() => Math.floor(Math.random() * 3000) + 500)

  return [
    {
      label: 'Receita Total',
      data: totalRevenueData,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
    {
      label: 'Receita Recorrente',
      data: recurringRevenueData,
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
    },
  ]
}

/**
 * Generate clients chart data
 */
async function generateClientsChartData(
  professionalId: string,
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month',
  labels: string[]
) {
  // In a real implementation, you would query the database to get client data
  // For now, we'll generate random data
  const totalClientsData = labels.map(() => Math.floor(Math.random() * 20) + 10)
  const newClientsData = labels.map(() => Math.floor(Math.random() * 5) + 1)

  return [
    {
      label: 'Total de Clientes',
      data: totalClientsData,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
    {
      label: 'Novos Clientes',
      data: newClientsData,
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
    },
  ]
}

/**
 * Generate retention chart data
 */
async function generateRetentionChartData(
  professionalId: string,
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month',
  labels: string[]
) {
  // In a real implementation, you would query the database to get retention data
  // For now, we'll generate random data
  const retentionRateData = labels.map(() => Math.floor(Math.random() * 30) + 70)
  const churnRateData = labels.map((_label, index) => 100 - retentionRateData[index])

  return [
    {
      label: 'Taxa de Retenção',
      data: retentionRateData,
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
    },
    {
      label: 'Taxa de Churn',
      data: churnRateData,
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
    },
  ]
}

/**
 * Generate ratings chart data
 */
async function generateRatingsChartData(
  professionalId: string,
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month',
  labels: string[]
) {
  // In a real implementation, you would query the database to get ratings data
  // For now, we'll generate random data
  const averageRatingData = labels.map(() => Math.random() * 1.5 + 3.5)

  // Distribution of ratings (1-5 stars)
  const distributionData = [
    Math.floor(Math.random() * 5) + 1, // 1 star
    Math.floor(Math.random() * 10) + 5, // 2 stars
    Math.floor(Math.random() * 15) + 10, // 3 stars
    Math.floor(Math.random() * 25) + 20, // 4 stars
    Math.floor(Math.random() * 30) + 30, // 5 stars
  ]

  return [
    {
      label: 'Avaliação Média',
      data: averageRatingData,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
    {
      label: 'Distribuição de Avaliações',
      data: distributionData,
      backgroundColor: [
        'rgba(239, 68, 68, 0.5)', // 1 star - red
        'rgba(245, 158, 11, 0.5)', // 2 stars - amber
        'rgba(252, 211, 77, 0.5)', // 3 stars - yellow
        'rgba(132, 204, 22, 0.5)', // 4 stars - lime
        'rgba(16, 185, 129, 0.5)', // 5 stars - green
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(245, 158, 11)',
        'rgb(252, 211, 77)',
        'rgb(132, 204, 22)',
        'rgb(16, 185, 129)',
      ],
      borderWidth: 1,
    },
  ]
}
