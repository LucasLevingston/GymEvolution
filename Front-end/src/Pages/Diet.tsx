import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Container from '@/components/Container';

interface DietPlanType {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	meals: {
		name: string;
		items: string[];
	}[];
}

// This would typically come from your API
const fetchDietPlan = async (): Promise<DietPlanType> => {
	// Simulating API call
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return {
		calories: 2500,
		protein: 150,
		carbs: 300,
		fat: 80,
		meals: [
			{
				name: 'Breakfast',
				items: ['Oatmeal with berries', 'Greek yogurt', 'Almonds'],
			},
			{
				name: 'Lunch',
				items: ['Grilled chicken breast', 'Brown rice', 'Steamed vegetables'],
			},
			{ name: 'Dinner', items: ['Baked salmon', 'Quinoa', 'Roasted broccoli'] },
			{ name: 'Snacks', items: ['Apple with peanut butter', 'Protein shake'] },
		],
	};
};

export default function DietPlan() {
	const {
		data: dietPlan,
		isLoading,
		error,
	} = useQuery<DietPlanType, Error>({
		queryKey: ['dietPlan'],
		queryFn: fetchDietPlan,
	});

	if (isLoading) {
		return (
			<div className="container mx-auto p-4">
				<Skeleton className="mb-4 h-[20px] w-[250px]" />
				<Skeleton className="h-[300px] w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Failed to load diet plan. Please try again later.
				</AlertDescription>
			</Alert>
		);
	}

	if (!dietPlan) {
		return (
			<Alert>
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>No Data</AlertTitle>
				<AlertDescription>
					No diet plan data available. Please check back later.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="container mx-auto p-4">
					<h1 className="mb-6 text-2xl font-bold">Your Diet Plan</h1>
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Daily Nutritional Goals</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="font-semibold">Calories</p>
										<p>{dietPlan.calories} kcal</p>
									</div>
									<div>
										<p className="font-semibold">Protein</p>
										<p>{dietPlan.protein}g</p>
									</div>
									<div>
										<p className="font-semibold">Carbs</p>
										<p>{dietPlan.carbs}g</p>
									</div>
									<div>
										<p className="font-semibold">Fat</p>
										<p>{dietPlan.fat}g</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Meal Plan</CardTitle>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue={dietPlan.meals[0]?.name.toLowerCase()}>
									<TabsList className="grid w-full grid-cols-4">
										{dietPlan.meals.map((meal) => (
											<TabsTrigger
												key={meal.name}
												value={meal.name.toLowerCase()}
											>
												{meal.name}
											</TabsTrigger>
										))}
									</TabsList>
									{dietPlan.meals.map((meal) => (
										<TabsContent
											key={meal.name}
											value={meal.name.toLowerCase()}
										>
											<ul className="list-disc pl-5">
												{meal.items.map((item, index) => (
													<li key={index}>{item}</li>
												))}
											</ul>
										</TabsContent>
									))}
								</Tabs>
							</CardContent>
						</Card>
					</div>
				</div>
			</Container>
		</div>
	);
}
