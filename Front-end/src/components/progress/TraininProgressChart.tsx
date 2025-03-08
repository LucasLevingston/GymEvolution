import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { TrainingWeekType } from '@/types/TrainingType'

interface TrainingProgressChartProps {
  trainingWeeks: TrainingWeekType[]
}

export function TrainingProgressChart({
  trainingWeeks,
}: TrainingProgressChartProps) {
  const chartData = trainingWeeks.map(week => ({
    week: `Week ${week.weekNumber}`,
    completed: week.done ? 1 : 0,
    inProgress: week.current ? 1 : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer
          config={{
            completed: {
              label: 'Completed',
              color: 'hsl(var(--chart-3))',
            },
            inProgress: {
              label: 'In Progress',
              color: 'hsl(var(--chart-4))',
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="var(--color-completed)"
              />
              <Bar
                dataKey="inProgress"
                stackId="a"
                fill="var(--color-inProgress)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
