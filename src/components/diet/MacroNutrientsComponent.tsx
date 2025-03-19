import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Dumbbell, Wheat, Droplet, Flame } from 'lucide-react';
import useUser from '@/hooks/user-hooks';

interface MacroNutrientsCardProps {
  diet: {
    totalProtein?: number;
    totalCarbohydrates?: number;
    totalFat?: number;
    totalCalories?: number;
  };
}

export function MacroNutrientsCard({ diet }: MacroNutrientsCardProps) {
  const { getBasalMetabolicRate } = useUser();
  const bmr = getBasalMetabolicRate();

  const macroData = [
    { name: 'Protein', value: diet.totalProtein || 0, color: '#FF6384' },
    { name: 'Carbs', value: diet.totalCarbohydrates || 0, color: '#36A2EB' },
    { name: 'Fat', value: diet.totalFat || 0, color: '#FFCE56' },
  ].filter((item) => item.value > 0);

  const totalMacros = macroData.reduce((sum, item) => sum + item.value, 0);
  const macroPercentages = macroData.map((item) => ({
    ...item,
    percentage: totalMacros > 0 ? Math.round((item.value / totalMacros) * 100) : 0,
  }));
  const caloriePercentage = bmr ? (diet.totalCalories! / bmr) * 100 : 0;

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="mr-2 h-5 w-5 text-primary" />
          Macronutrient Distribution
        </CardTitle>
        <CardDescription>Your daily macro targets</CardDescription>
      </CardHeader>
      <CardContent>
        {macroData.length > 0 ? (
          <>
            <CardContent>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {macroData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {macroPercentages.map((macro) => (
                  <div key={macro.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {macro.name === 'Protein' && (
                          <Dumbbell className="mr-2 h-4 w-4 text-indigo-600" />
                        )}
                        {macro.name === 'Carbs' && (
                          <Wheat className="mr-2 h-4 w-4 text-emerald-600" />
                        )}
                        {macro.name === 'Fat' && (
                          <Droplet className="mr-2 h-4 w-4 text-amber-500" />
                        )}
                        <span className="font-medium">{macro.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {macro.value}g
                        </span>
                        <Badge variant="outline" className="ml-1">
                          {macro.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={macro.percentage}
                      className={`h-2 ${
                        macro.name === 'Protein'
                          ? 'bg-indigo-600'
                          : macro.name === 'Carbs'
                            ? 'bg-emerald-600'
                            : 'bg-amber-500'
                      }`}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Flame className="mr-2 h-4 w-4 text-red" />
                      <span className="font-medium">Calories</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {bmr ? Math.round(caloriePercentage) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress value={caloriePercentage} className="h-2 bg-red" />
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-center">
            <div className="max-w-md space-y-2">
              <p className="text-muted-foreground">No macronutrient data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
