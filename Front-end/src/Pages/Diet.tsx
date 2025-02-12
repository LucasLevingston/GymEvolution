'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Container from '@/components/Container';
import useUser from '@/hooks/user-hooks';
import type { Diet } from '@/types/DietType';
import { useState } from 'react';
import { DietComponent } from '@/components/DietComponent';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DietPlan() {
	const { user } = useUser();
	const [selectedDate, setSelectedDate] = useState(new Date());

	const latestDiet: Diet | undefined = user?.diets[user.diets.length - 1];

	if (!latestDiet) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<Container>
					<div className="container mx-auto p-4">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>No Diet Plan</AlertTitle>
							<AlertDescription>
								You do not have a diet plan available. Please create one to get
								started.
							</AlertDescription>
						</Alert>
						<Button className="mt-4">
							<Plus className="mr-2 h-4 w-4" /> Create Diet Plan
						</Button>
					</div>
				</Container>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="container mx-auto p-4">
					<div className="mb-6 flex flex-col items-center justify-between sm:flex-row">
						<h1 className="mb-4 text-3xl font-bold sm:mb-0">Your Diet Plan</h1>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									setSelectedDate(
										new Date(selectedDate.setDate(selectedDate.getDate() - 1))
									)
								}
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
							<Badge variant="secondary" className="px-4 py-2 text-lg">
								{selectedDate.toLocaleDateString()}
							</Badge>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									setSelectedDate(
										new Date(selectedDate.setDate(selectedDate.getDate() + 1))
									)
								}
							>
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<DietComponent diet={latestDiet} />
				</div>
			</Container>
		</div>
	);
}
