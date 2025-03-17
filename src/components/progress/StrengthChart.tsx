import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { StrengthData } from '@/types/progressTypes'

interface StrengthChartProps {
  data: StrengthData[]
}

export function StrengthChart({ data }: StrengthChartProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <ChartContainer
          config={{
            benchPress: {
              label: 'Bench Press',
              color: 'hsl(var(--chart-3))',
            },
            squat: {
              label: 'Squat',
              color: 'hsl(var(--chart-4))',
            },
            deadlift: {
              label: 'Deadlift',
              color: 'hsl(var(--chart-5))',
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="benchPress"
                stroke="var(--color-benchPress)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="squat"
                stroke="var(--color-squat)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="deadlift"
                stroke="var(--color-deadlift)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
