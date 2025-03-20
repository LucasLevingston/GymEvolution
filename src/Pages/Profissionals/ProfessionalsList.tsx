import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, UserRound, MapPin, Star, ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useUser from '@/hooks/user-hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Professional } from '@/types/ProfessionalType';

export default function ProfessionalsList() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const { getNutritionists, getTrainers } = useUser();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);

        const nutritionists = await getNutritionists();
        const trainers = await getTrainers();
        console.log(nutritionists);
        const nutritionistsData = nutritionists.map((nutritionist) => ({
          id: nutritionist.id,
          name: nutritionist.name || 'Unknown',
          specialty: 'Nutritionist',
          location: nutritionist.city || nutritionist.state || 'Remote',
          rating: nutritionist.rating || 4.5,
          imageUrl: nutritionist.imageUrl || '',
          experience: nutritionist.experience || 3,
          available: nutritionist.available !== false,
          specialties: nutritionist.specialties || ['Nutrition', 'Diet Planning'],
        }));

        const trainersData = trainers.map((trainer) => ({
          id: trainer.id,
          name: trainer.name || 'Unknown',
          specialty: 'Personal Trainer',
          location: trainer.city || trainer.state || 'Remote',
          rating: trainer.rating || 4.5,
          imageUrl: trainer.imageUrl || '',
          experience: trainer.experience || 3,
          available: trainer.available !== false,
          specialties: trainer.specialties || ['Fitness', 'Strength Training'],
        }));

        const combinedData = [...nutritionistsData, ...trainersData];

        setProfessionals(combinedData);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Filter professionals based on search term and specialty
  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = specialty === 'all' || professional.specialty === specialty;

    return matchesSearch && matchesSpecialty;
  });

  const specialties = ['all', ...new Set(professionals.map((p) => p.specialty))];

  return (
    <>
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Our Professional Team
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Connect with our expert trainers, nutritionists, and fitness specialists to help
          you achieve your health and fitness goals.
        </p>
      </section>

      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search professionals..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec === 'all' ? 'All Specialties' : spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : filteredProfessionals.length === 0 ? (
        <div className="rounded-lg bg-primary/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No professionals found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <Card
              key={professional.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <div className="aspect-video bg-muted relative">
                {professional.imageUrl ? (
                  <img
                    src={professional.imageUrl || '/placeholder.svg'}
                    alt={professional.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10">
                    <UserRound className="h-16 w-16 text-primary/50" />
                  </div>
                )}
                {professional.available && (
                  <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                    Available
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{professional.name}</h3>
                    <p className="text-muted-foreground">{professional.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.rating?.toFixed(1)}</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{professional.location}</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {professional.experience} years of experience
                  </p>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {professional.specialties?.map((spec, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link to={`/professionals/${professional.id}`}>
                    View Profile
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <section className="mt-16 rounded-lg bg-primary/10 p-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-primary">
          Join Our Professional Team
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
          Are you a fitness professional looking to expand your client base? Join our
          platform and connect with motivated clients.
        </p>
        <Button asChild size="lg">
          <Link to="/apply">Apply as a Professional</Link>
        </Button>
      </section>
    </>
  );
}
