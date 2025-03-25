'use client';

import type React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Apple,
  Upload,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import useUser from '@/hooks/user-hooks';

interface FormData {
  role: 'NUTRITIONIST' | 'TRAINER';
  bio: string;
  experience: number;
  city: string;
  state: string;
  phone: string;
  specialties: string[];
  certifications: string[];
  education: string[];
  availability: string[];
}

export default function RegisterProfessional() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [certification, setCertification] = useState('');
  const [education, setEducation] = useState('');
  const [availabilityDay, setAvailabilityDay] = useState('');

  const [formData, setFormData] = useState<FormData>({
    role: 'NUTRITIONIST',
    bio: '',
    experience: 0,
    city: '',
    state: '',
    phone: '',
    specialties: [],
    certifications: [],
    education: [],
    availability: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  if (!user) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Você precisa estar logado</h2>
        <p className="text-muted-foreground mb-8">
          Faça login para se cadastrar como profissional.
        </p>
        <Button asChild>
          <a href="/login">Fazer Login</a>
        </Button>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number.parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: numValue }));

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: 'NUTRITIONIST' | 'TRAINER') => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const addSpecialty = () => {
    if (!specialty.trim()) return;

    if (!formData.specialties.includes(specialty)) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }));
    }

    setSpecialty('');

    // Clear error when user adds specialty
    if (errors.specialties) {
      setErrors((prev) => ({ ...prev, specialties: undefined }));
    }
  };

  const removeSpecialty = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== item),
    }));
  };

  const addCertification = () => {
    if (!certification.trim()) return;

    if (!formData.certifications.includes(certification)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certification],
      }));
    }

    setCertification('');
  };

  const removeCertification = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== item),
    }));
  };

  const addEducation = () => {
    if (!education.trim()) return;

    if (!formData.education.includes(education)) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, education],
      }));
    }

    setEducation('');
  };

  const removeEducation = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e !== item),
    }));
  };

  const addAvailability = () => {
    if (!availabilityDay) return;

    if (!formData.availability.includes(availabilityDay)) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, availabilityDay],
      }));
    }

    setAvailabilityDay('');
  };

  const removeAvailability = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((a) => a !== item),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = 'A biografia é obrigatória';
    }

    if (formData.experience <= 0) {
      newErrors.experience = 'A experiência deve ser maior que zero';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'A cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'O estado é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório';
    }

    if (formData.specialties.length === 0) {
      newErrors.specialties = 'Adicione pelo menos uma especialidade';
    }

    if (formData.certifications.length === 0) {
      newErrors.certifications = 'Adicione pelo menos uma certificação';
    }

    if (formData.availability.length === 0) {
      newErrors.availability = 'Adicione pelo menos um dia de disponibilidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsSubmitting(true);

      // Simulating API call to update user profile
      // In a real app, you would call your API to update the user's role and professional info
      await updateUser({
        ...user,
        role: formData.role,
        bio: formData.bio,
        experience: formData.experience,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        specialties: JSON.stringify(formData.specialties),
        certifications: JSON.stringify(formData.certifications),
        education: JSON.stringify(formData.education),
        availability: JSON.stringify(formData.availability),
      });

      toast.success('Cadastro realizado com sucesso!');
      addNotification({
        title: 'Cadastro Concluído',
        message: `Você agora é um ${formData.role === 'NUTRITIONIST' ? 'Nutricionista' : 'Treinador'} na plataforma.`,
        type: 'success',
      });

      // Redirect to professional dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Falha ao atualizar o perfil');
      addNotification({
        title: 'Erro no Cadastro',
        message: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Cadastro de Profissional</h1>
        <p className="text-muted-foreground">
          Preencha o formulário abaixo para se cadastrar como nutricionista ou treinador
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Escolha sua área de atuação e forneça suas informações profissionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base">Tipo de Profissional</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={handleRoleChange}
                className="flex flex-col space-y-3 mt-3"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="NUTRITIONIST" id="nutritionist" />
                  <Label
                    htmlFor="nutritionist"
                    className="flex items-center cursor-pointer"
                  >
                    <Apple className="mr-2 h-5 w-5 text-green-500" />
                    Nutricionista
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="TRAINER" id="trainer" />
                  <Label htmlFor="trainer" className="flex items-center cursor-pointer">
                    <Dumbbell className="mr-2 h-5 w-5 text-blue-500" />
                    Personal Trainer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="bio">Biografia Profissional</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Descreva sua experiência, abordagem e filosofia profissional..."
                className={`mt-1 min-h-[120px] ${errors.bio ? 'border-red-500' : ''}`}
                value={formData.bio}
                onChange={handleInputChange}
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experience">Anos de Experiência</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  className={`mt-1 ${errors.experience ? 'border-red-500' : ''}`}
                  value={formData.experience}
                  onChange={handleNumberChange}
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  name="city"
                  className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  name="state"
                  className={`mt-1 ${errors.state ? 'border-red-500' : ''}`}
                  value={formData.state}
                  onChange={handleInputChange}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input
                id="phone"
                name="phone"
                className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Especialidades e Qualificações</CardTitle>
            <CardDescription>
              Adicione suas especialidades, certificações e formação acadêmica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-2 block">Especialidades</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specialties.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(item)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    formData.role === 'NUTRITIONIST'
                      ? 'Ex: Nutrição Esportiva'
                      : 'Ex: Hipertrofia'
                  }
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={errors.specialties ? 'border-red-500' : ''}
                />
                <Button type="button" size="sm" onClick={addSpecialty}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              {errors.specialties && (
                <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>
              )}
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-2 block">Certificações</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.certifications.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeCertification(item)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    formData.role === 'NUTRITIONIST' ? 'Ex: CRN 12345' : 'Ex: CREF 12345'
                  }
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className={errors.certifications ? 'border-red-500' : ''}
                />
                <Button type="button" size="sm" onClick={addCertification}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              {errors.certifications && (
                <p className="text-red-500 text-sm mt-1">{errors.certifications}</p>
              )}
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-2 block">Formação Acadêmica</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.education.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeEducation(item)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Graduação em Nutrição - UFRJ"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
                <Button type="button" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Disponibilidade</CardTitle>
            <CardDescription>
              Informe os dias e horários em que você está disponível para atender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-base mb-2 block">Dias Disponíveis</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.availability.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1.5">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAvailability(item)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={availabilityDay} onValueChange={setAvailabilityDay}>
                  <SelectTrigger
                    className={`w-full ${errors.availability ? 'border-red-500' : ''}`}
                  >
                    <SelectValue placeholder="Selecione um dia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Segunda-feira">Segunda-feira</SelectItem>
                    <SelectItem value="Terça-feira">Terça-feira</SelectItem>
                    <SelectItem value="Quarta-feira">Quarta-feira</SelectItem>
                    <SelectItem value="Quinta-feira">Quinta-feira</SelectItem>
                    <SelectItem value="Sexta-feira">Sexta-feira</SelectItem>
                    <SelectItem value="Sábado">Sábado</SelectItem>
                    <SelectItem value="Domingo">Domingo</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" onClick={addAvailability}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar
                </Button>
              </div>
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Documentos e Verificação</CardTitle>
            <CardDescription>
              Envie documentos que comprovem sua formação e certificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="license">Carteira Profissional</Label>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">
                      Arraste e solte ou clique para fazer upload
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG ou PDF (máx. 5MB)
                    </p>
                    <Button type="button" variant="outline" size="sm" className="mt-4">
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="certificates">Certificados</Label>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">
                      Arraste e solte ou clique para fazer upload
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG ou PDF (máx. 5MB)
                    </p>
                    <Button type="button" variant="outline" size="sm" className="mt-4">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Termos e Condições</CardTitle>
            <CardDescription>
              Leia e aceite os termos para concluir seu cadastro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Ao se cadastrar como profissional em nossa plataforma, você concorda com
                  nossos Termos de Serviço e Política de Privacidade. Você confirma que
                  todas as informações fornecidas são verdadeiras e que possui as
                  qualificações necessárias para oferecer os serviços propostos.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Eu li e concordo com os Termos de Serviço e Política de Privacidade
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Concluir Cadastro
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
