'use client';

import type React from 'react';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/user-store';
import { ContainerRoot } from '@/components/Container';
import { usePlans } from '@/hooks/use-plans';

export default function CreatePlan() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createPlan, isLoading } = usePlans();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [feature, setFeature] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!price.trim()) newErrors.price = 'Preço é obrigatório';
    else if (isNaN(Number.parseFloat(price)) || Number.parseFloat(price) <= 0)
      newErrors.price = 'Preço deve ser um valor positivo';

    if (!duration.trim()) newErrors.duration = 'Duração é obrigatória';
    else if (isNaN(Number.parseInt(duration)) || Number.parseInt(duration) <= 0)
      newErrors.duration = 'Duração deve ser um número inteiro positivo';

    if (features.length === 0)
      newErrors.features = 'Adicione pelo menos um recurso ao plano';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFeature = () => {
    if (!feature.trim()) return;

    setFeatures([...features, feature]);
    setFeature('');

    // Clear feature error if it exists
    if (errors.features) {
      const { features, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const planData = {
      name,
      description,
      price: Number.parseFloat(price),
      duration: Number.parseInt(duration),
      features,
      professionalId: user.id,
    };

    const result = await createPlan(planData);

    if (result) {
      navigate(`/professional-plans/${user.id}`);
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

  if (user.role === 'STUDENT') {
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

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/professional-plans/${user.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Planos
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Criar Novo Plano</h1>
      <p className="text-muted-foreground mb-8">
        Defina os detalhes do plano que você oferecerá aos seus clientes
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
            <CardDescription>Preencha os detalhes básicos do seu plano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (dias)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recursos do Plano</CardTitle>
            <CardDescription>
              Adicione os recursos que estão incluídos neste plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Consulta inicial detalhada"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className={errors.features ? 'border-red-500' : ''}
              />
              <Button type="button" onClick={handleAddFeature}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            {errors.features && <p className="text-red-500 text-sm">{errors.features}</p>}

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
              onClick={() => navigate(`/professional-plans/${user.id}`)}
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
                  Salvar Plano
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
