'use client';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/user-store';
import { ContainerRoot } from '@/components/Container';
import { usePlans } from '@/hooks/use-plans';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().optional(),
  price: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val);
      return num && num > 0;
    },
    { message: 'Preço deve ser um valor positivo' }
  ),
  duration: z.string().refine(
    (val) => {
      const num = Number.parseInt(val);
      return num && num > 0;
    },
    { message: 'Duração deve ser um número inteiro positivo' }
  ),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditPlan() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();
  const { getPlanById, updatePlan, isLoading } = usePlans();

  const [feature, setFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featuresError, setFeaturesError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      duration: '',
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;

      const plan = await getPlanById(id);
      if (plan) {
        // Set form values
        form.reset({
          name: plan.name,
          description: plan.description || '',
          price: plan.price.toString(),
          duration: plan.duration.toString(),
          isActive: plan.isActive,
        });

        // Set features
        setFeatures(plan.features);
      } else {
        navigate('/professional-plans');
      }

      setIsInitialLoading(false);
    };

    fetchPlan();
  }, [id, getPlanById, navigate, form]);

  const handleAddFeature = () => {
    if (!feature.trim()) return;

    setFeatures([...features, feature]);
    setFeature('');
    setFeaturesError(null);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    // Validate features
    if (features.length === 0) {
      setFeaturesError('Adicione pelo menos um recurso ao plano');
      return;
    }

    if (!id || !user) {
      if (!user) navigate('/login');
      return;
    }

    const planData = {
      name: values.name,
      description: values.description,
      price: Number.parseFloat(values.price),
      duration: Number.parseInt(values.duration),
      features,
      isActive: values.isActive,
    };

    const result = await updatePlan(id, planData);

    if (result) {
      navigate(`/professional-plans/${result.professionalId}`);
    }
  };

  if (!user) {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Por favor, faça login</h2>
          <p className="text-muted-foreground mb-8">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  if (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER') {
    return (
      <ContainerRoot>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-8">
            Esta área é exclusiva para nutricionistas e personal trainers.
          </p>
          <Button asChild>
            <Link to="/register-professional">Cadastrar como Profissional</Link>
          </Button>
        </div>
      </ContainerRoot>
    );
  }

  if (isInitialLoading) {
    return (
      <ContainerRoot>
        <LoadingSpinner />
      </ContainerRoot>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/professional-plans">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Planos
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Editar Plano</h1>
      <p className="text-muted-foreground mb-8">Atualize os detalhes do seu plano</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Plano</CardTitle>
              <CardDescription>Atualize os detalhes básicos do seu plano</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Plano ativo</FormLabel>
                      <FormDescription>Disponível para contratação</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recursos do Plano</CardTitle>
              <CardDescription>
                Atualize os recursos que estão incluídos neste plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Consulta inicial detalhada"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className={featuresError ? 'border-red-500' : ''}
                />
                <Button type="button" onClick={handleAddFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              {featuresError && <p className="text-red-500 text-sm">{featuresError}</p>}

              <div className="flex flex-wrap gap-2 mt-4">
                {features.map((feat, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5">
                    {feat}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/professional-plans')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
