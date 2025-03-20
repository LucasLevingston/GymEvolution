'use client';

import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MessageSquare, FileText, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNotifications } from '@/hooks/use-notifications';
import { useUserStore } from '@/store/user-store';

export default function PurchaseSuccess() {
  const navigate = useNavigate();
  const { professionalId, planId } = useParams();
  const { addNotification } = useNotifications();
  const { user } = useUserStore();

  // Simulated data - in a real app, you would fetch this from your API
  const professionalName = 'Dr. Sarah Johnson';
  const planName = 'Standard Nutrition Plan';
  const planPrice = 149;

  useEffect(() => {
    // Send a notification about the successful purchase
    if (user?.id) {
      addNotification({
        title: 'Compra Realizada com Sucesso',
        message: `Você contratou o plano ${planName} com ${professionalName}. Aguarde o contato do profissional.`,
        type: 'success',
        link: '/relationships',
      });
    }
  }, [user?.id, addNotification, planName, professionalName]);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Compra Realizada com Sucesso!</h1>
        <p className="text-muted-foreground max-w-md">
          Sua solicitação foi enviada ao profissional e você receberá uma notificação
          quando for aceita.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detalhes da Compra</CardTitle>
          <CardDescription>Informações sobre o plano contratado</CardDescription>
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
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Status:</span>
            <span className="text-amber-600 font-medium">Aguardando aprovação</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium">Data da compra:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>O que acontece agora?</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">Aguarde a confirmação</h3>
                <p className="text-muted-foreground text-sm">
                  O profissional irá analisar sua solicitação e aceitá-la em breve.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">Contato inicial</h3>
                <p className="text-muted-foreground text-sm">
                  Após a aceitação, o profissional entrará em contato para agendar uma
                  consulta inicial.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">Receba seu plano personalizado</h3>
                <p className="text-muted-foreground text-sm">
                  Após a consulta, você receberá seu plano personalizado e poderá começar
                  sua jornada.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" className="flex items-center justify-center" asChild>
          <Link to="/relationships">
            <Calendar className="mr-2 h-4 w-4" />
            Meus Profissionais
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center justify-center" asChild>
          <Link to={`/messages/${professionalId}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center justify-center" asChild>
          <Link to="/dashboard">
            <FileText className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/professionals">
            Explorar mais profissionais
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
