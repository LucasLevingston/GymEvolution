import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Utensils, Check } from 'lucide-react'
import type { Diet, Meal, MealItem } from '@/types/DietType'

interface DietComponentProps {
  diet: Diet
}

export function DietComponent({ diet }: DietComponentProps) {
  const macroData = [
    { name: 'Protein', value: diet.totalProtein, color: '#FF6384' },
    { name: 'Carbs', value: diet.totalCarbohydrates, color: '#36A2EB' },
    { name: 'Fat', value: diet.totalFat, color: '#FFCE56' },
  ]

  const calculateProgress = (current: number, total: number) =>
    (current / total) * 100

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Daily Nutritional Goals</CardTitle>
          <CardDescription>Track your macro and calorie intake</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="calories">
              <AccordionTrigger>Calories</AccordionTrigger>
              <AccordionContent>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">Total Calories</span>
                  <span>{diet.totalCalories} kcal</span>
                </div>
                <Progress value={75} className="h-2 w-full" />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="macros">
              <AccordionTrigger>Macronutrients</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-4">
                  {macroData.map(macro => (
                    <div key={macro.name}>
                      <p className="font-semibold">{macro.name}</p>
                      <p>{macro.value}g</p>
                      <Progress
                        value={calculateProgress(
                          macro.value,
                          diet.totalCalories
                        )}
                        className="h-2 w-full"
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="my-4" />
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Meal Plan - Week {diet.weekNumber}</CardTitle>
          <CardDescription>Your personalized meal schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={diet.meals[0]?.name?.toLowerCase() || ''}>
            <TabsList className="grid w-full grid-cols-4">
              {diet.meals.map((meal: Meal) => (
                <TabsTrigger
                  key={meal.id}
                  value={meal.name?.toLowerCase() || ''}
                  className="flex items-center justify-between"
                >
                  <span>{meal.name || 'Unnamed Meal'}</span>
                  {meal.isCompleted && <Check className="ml-2 h-4 w-4" />}
                </TabsTrigger>
              ))}
            </TabsList>
            {diet.meals.map((meal: Meal) => (
              <TabsContent key={meal.id} value={meal.name?.toLowerCase() || ''}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="mr-2 h-5 w-5" />
                        {meal.name || 'Unnamed Meal'}
                      </div>
                      <Badge
                        variant={meal.isCompleted ? 'default' : 'secondary'}
                      >
                        {meal.isCompleted ? 'Completed' : 'Not Completed'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Day {meal.day}, {meal.hour}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="nutrition">
                        <AccordionTrigger>
                          Nutritional Information
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                              <Badge variant="secondary">Calories</Badge>
                              <p className="mt-1">{meal.calories || 0} kcal</p>
                            </div>
                            <div>
                              <Badge variant="secondary">Protein</Badge>
                              <p className="mt-1">{meal.protein || 0}g</p>
                            </div>
                            <div>
                              <Badge variant="secondary">Carbs</Badge>
                              <p className="mt-1">{meal.carbohydrates || 0}g</p>
                            </div>
                            <div>
                              <Badge variant="secondary">Fat</Badge>
                              <p className="mt-1">{meal.fat || 0}g</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="details">
                        <AccordionTrigger>Meal Details</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-4">
                            <Badge variant="outline">Serving Size</Badge>
                            <p className="mt-1">{meal.servingSize || 'N/A'}</p>
                          </div>
                          <div className="mb-4">
                            <Badge variant="outline">Meal Type</Badge>
                            <p className="mt-1">{meal.mealType || 'N/A'}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="items">
                        <AccordionTrigger>Meal Items</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5">
                            {meal.mealItems?.map((item: MealItem) => (
                              <li key={item.id}>
                                {item.name} - {item.quantity} pcs
                                <Badge variant="secondary" className="ml-2">
                                  {item.calories !== undefined &&
                                    `${item.calories} kcal`}
                                </Badge>
                                {item.protein !== undefined && (
                                  <Badge variant="secondary" className="ml-2">
                                    {item.protein}g protein
                                  </Badge>
                                )}
                                {item.carbohydrates !== undefined && (
                                  <Badge variant="secondary" className="ml-2">
                                    {item.carbohydrates}g carbs
                                  </Badge>
                                )}
                              </li>
                            )) || <li>No items available</li>}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
