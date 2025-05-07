import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Star } from 'lucide-react'

type ReviewsMetricsProps = {
  data: {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
      rating: number
      count: number
    }[]
    recentReviews: {
      id: string
      rating: number
      comment: string
      clientName: string
      date: string
    }[]
  }
}
const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

export default function ReviewsMetrics({ data }: ReviewsMetricsProps) {
  console.log(data)
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Reviews & Feedback</CardTitle>
        <CardDescription>Client satisfaction and feedback analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{data.averageRating}</p>
                <Star className="ml-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{data.totalReviews}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Rating Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.ratingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="rating"
                  label={({ rating }) => `${rating}★`}
                >
                  {data.ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.rating - 1]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} reviews`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Recent Reviews
            </h4>
            <div className="space-y-3">
              {data.recentReviews.slice(0, 2).map((review) => (
                <div key={review.id} className="rounded-lg border p-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{review.clientName}</p>
                    <div className="flex items-center">
                      <p className="mr-1">{review.rating}</p>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
