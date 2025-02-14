import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Container from '@/components/Container';
import { DietComponent } from '@/components/DietComponent';
import useUser from '@/hooks/user-hooks';
import type { Diet } from '@/types/DietType';
import { ClipboardIcon } from 'lucide-react';

export default function PastDiets() {
	const { user } = useUser();
	const navigate = useNavigate();
	const [selectedDietId, setSelectedDietId] = useState<string | null>(null);

	if (!user || user.diets.length === 0) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<Container>
					<div className="container mx-auto p-4">
						<h1 className="mb-6 text-3xl font-bold">Past Diets</h1>
						<p>No past diets available.</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => navigate('/current-diet')}
						>
							<ClipboardIcon className="mr-2 h-4 w-4" />
							View Current Diet
						</Button>
					</div>
				</Container>
			</div>
		);
	}

	const selectedDiet =
		user.diets.find((diet) => diet.id === selectedDietId) || user.diets[0];

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<Container>
				<div className="container mx-auto p-4">
					<div className="mb-6 flex items-center justify-between">
						<h1 className="text-3xl font-bold">Past Diets</h1>
						<Button variant="outline" onClick={() => navigate('/diet')}>
							<ClipboardIcon className="mr-2 h-4 w-4" />
							View Current Diet
						</Button>
					</div>
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Select a Diet Plan</CardTitle>
						</CardHeader>
						<CardContent>
							<Select
								onValueChange={(value) => setSelectedDietId(value)}
								defaultValue={selectedDiet.id}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a diet plan" />
								</SelectTrigger>
								<SelectContent>
									{user.diets.map((diet: Diet) => (
										<SelectItem key={diet.id} value={diet.id}>
											Week {diet.weekNumber} -{' '}
											{new Date(diet.createdAt).toLocaleDateString()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</Card>
					<DietComponent diet={selectedDiet} />
				</div>
			</Container>
		</div>
	);
}
