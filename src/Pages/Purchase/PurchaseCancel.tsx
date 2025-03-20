'use client';

import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { toast } from 'sonner';
import useUser from '@/hooks/user-hooks';

export default function PurchaseCancel() {
  const navigate = useNavigate();
  const { relationshipId } = useParams();
  const { addNotification } = useNotifications();
  const { updateRelationship } = useUser();
  const [reason, setReason] = useState('');
  const [cancelReason, setCancelReason] = useState('change_mind');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated data - in a real app, you would fetch this from your API
  const professionalName = 'Dr. Sarah Johnson';
  const planName = 'Standard Nutrition Plan';
  const planPrice = 149;

  const handleCancel = async () => {
    if (!relationshipId) {
      toast.error('ID da relação não encontrado');
      return;
    }

    try {
      setIsSubmitting(true);

      // Update relationship status to REJECTED
      await updateRelationship(relationshipId, { status: 'REJECTED' });

      // Add notification
      addNotification({
        title: 'Compra Cancelada',
        message: `Você cancelou a contratação do plano ${planName} com ${professionalName}.`,
        type: 'info',
      });

      toast.success('Compra cancelada com sucesso');
      navigate('/relationships');
    } catch (error) {
      console.error('Error canceling purchase:', error);
      toast.error('Erro ao cancelar a compra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/relationships">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Meus Profissionais
        </Link>
      </Button>

      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Cancelar Compra</h1>
        <p className="text-muted-foreground max-w-md">
          Você está prestes a cancelar sua contratação. Esta ação não pode ser desfeita.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detalhes da Compra</CardTitle>
          <CardDescription>Informações sobre o plano que será cancelado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Profissional:</span>
            <span>{professionalName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Plano:</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Valor:</span>
            <span className="font-bold">R$ {planPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Status:</span>
            <span className="text-amber-600 font-medium">Aguardando aprovação</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Motivo do Cancelamento</CardTitle>
          <CardDescription>
            Ajude-nos a entender por que você está cancelando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="change_mind" id="change_mind" />
              <Label htmlFor="change_mind">Mudei de ideia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found_another" id="found_another" />
              <Label htmlFor="found_another">Encontrei outro profissional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="too_expensive" id="too_expensive" />
              <Label htmlFor="too_expensive">Preço muito alto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no_response" id="no_response" />
              <Label htmlFor="no_response">Profissional não respondeu</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Outro motivo</Label>
            </div>
          </RadioGroup>

          <div>
            <Label htmlFor="reason">Comentários adicionais (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Conte-nos mais sobre o motivo do cancelamento..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processando...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Confirmar Cancelamento
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
