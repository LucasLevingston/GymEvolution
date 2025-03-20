'use client';

import { useState, useEffect } from 'react';
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
import { ContainerRoot } from '@/components/Container';
import { usePurchases } from '@/hooks/purchase-hooks';
import type { Purchase } from '@/types/PurchaseType';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PurchaseCancel() {
  const navigate = useNavigate();
  const { relationshipId } = useParams();
  const { addNotification } = useNotifications();
  const { getPurchaseById, cancelPurchase, isLoading } = usePurchases();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [reason, setReason] = useState('');
  const [cancelReason, setCancelReason] = useState('change_mind');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!relationshipId) return;

      // In a real app, you would fetch the purchase by relationship ID
      // For now, we'll simulate this by fetching all purchases and finding the one with the matching relationship ID
      const purchaseData = await getPurchaseById(relationshipId);
      if (purchaseData) {
        setPurchase(purchaseData);
      }
    };

    fetchPurchase();
  }, [relationshipId, getPurchaseById]);

  const handleCancel = async () => {
    if (!relationshipId || !purchase) {
      toast.error('ID da relação não encontrado');
      return;
    }

    try {
      setIsSubmitting(true);

      // Cancel the purchase
      const result = await cancelPurchase(purchase.id, {
        reason: cancelReason,
        comment: reason,
      });

      if (result) {
        // Add notification
        addNotification({
          title: 'Compra Cancelada',
          message: `Você cancelou a contratação do plano ${purchase.planName}.`,
          type: 'info',
        });

        toast.success('Compra cancelada com sucesso');
        navigate('/relationships');
      } else {
        throw new Error('Falha ao cancelar a compra');
      }
    } catch (error) {
      console.error('Error canceling purchase:', error);
      toast.error('Erro ao cancelar a compra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ContainerRoot>
        <LoadingSpinner />
      </ContainerRoot>
    );
  }

  if (!purchase && !isLoading) {
    return (
      <ContainerRoot>
        <div className="py-12 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Compra não encontrada</h1>
            <p className="text-muted-foreground max-w-md">
              Não foi possível encontrar os detalhes da sua compra.
            </p>
            <Button asChild className="mt-6">
              <Link to="/relationships">Voltar para Meus Profissionais</Link>
            </Button>
          </div>
        </div>
      </ContainerRoot>
    );
  }

  return (
    <ContainerRoot>
      <div className="py-12 max-w-3xl mx-auto">
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

        {purchase && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detalhes da Compra</CardTitle>
              <CardDescription>
                Informações sobre o plano que será cancelado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Profissional:</span>
                <span>{purchase.professional?.name || 'Profissional'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Plano:</span>
                <span>{purchase.planName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Valor:</span>
                <span className="font-bold">R$ {purchase.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Status:</span>
                <span className="text-amber-600 font-medium">
                  {purchase.status === 'PENDING'
                    ? 'Aguardando aprovação'
                    : purchase.status === 'COMPLETED'
                      ? 'Concluída'
                      : purchase.status === 'CANCELLED'
                        ? 'Cancelada'
                        : 'Reembolsada'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

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
      </div>
    </ContainerRoot>
  );
}
