'use client';

import { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function HiringFlow() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      title: 'Encontre um profissional',
      description:
        'Navegue pela lista de profissionais e encontre o que melhor atende às suas necessidades.',
      content: (
        <div className="space-y-4">
          <p>Na página de profissionais, você pode:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Filtrar por especialidade (Nutricionista ou Personal Trainer)</li>
            <li>Pesquisar por nome ou especialidade específica</li>
            <li>Ver avaliações e experiência de cada profissional</li>
          </ul>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <p className="text-sm">
              <strong>Dica:</strong> Verifique as especialidades e certificações para
              encontrar um profissional que atenda às suas necessidades específicas.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Visualize o perfil detalhado',
      description:
        'Acesse o perfil completo do profissional para conhecer melhor suas qualificações.',
      content: (
        <div className="space-y-4">
          <p>No perfil do profissional, você encontrará:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Biografia profissional completa</li>
            <li>Formação acadêmica e certificações</li>
            <li>Especialidades e áreas de atuação</li>
            <li>Disponibilidade de horários</li>
            <li>Avaliações detalhadas de outros clientes</li>
          </ul>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <p className="text-sm">
              <strong>Dica:</strong> Leia as avaliações de outros clientes para ter uma
              ideia da qualidade do atendimento e resultados obtidos.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Escolha um plano',
      description:
        'Selecione o plano que melhor se adapta às suas necessidades e orçamento.',
      content: (
        <div className="space-y-4">
          <p>
            Ao contratar um profissional, você poderá escolher entre diferentes planos:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Plano Básico:</strong> Ideal para quem está começando
            </li>
            <li>
              <strong>Plano Padrão:</strong> Nossa opção mais popular, com acompanhamento
              regular
            </li>
            <li>
              <strong>Plano Premium:</strong> Acompanhamento completo e personalizado
            </li>
          </ul>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <p className="text-sm">
              <strong>Dica:</strong> Cada plano oferece diferentes níveis de suporte e
              acompanhamento. Escolha aquele que melhor se adapta à sua rotina e
              objetivos.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Envie sua solicitação',
      description:
        'Finalize o processo enviando uma solicitação ao profissional escolhido.',
      content: (
        <div className="space-y-4">
          <p>Para finalizar a contratação:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Adicione uma mensagem personalizada explicando seus objetivos</li>
            <li>Revise os detalhes do plano selecionado</li>
            <li>Envie sua solicitação ao profissional</li>
          </ul>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <p className="text-sm">
              <strong>Dica:</strong> Seja específico sobre seus objetivos e expectativas
              na mensagem inicial para que o profissional possa avaliar melhor como
              ajudá-lo.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Acompanhe sua solicitação',
      description:
        'Monitore o status da sua solicitação e inicie o trabalho quando for aceita.',
      content: (
        <div className="space-y-4">
          <p>Após enviar sua solicitação:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Você receberá uma notificação quando o profissional responder</li>
            <li>Você pode acompanhar o status na página "Meus Profissionais"</li>
            <li>
              Quando aceita, você poderá iniciar a comunicação direta com o profissional
            </li>
          </ul>
          <div className="rounded-lg bg-muted p-4 mt-4">
            <p className="text-sm">
              <strong>Dica:</strong> A maioria dos profissionais responde em até 48 horas.
              Se não receber resposta, você pode cancelar a solicitação e escolher outro
              profissional.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Como Contratar um Profissional</h1>
        <p className="text-muted-foreground">
          Siga os passos abaixo para contratar um nutricionista ou personal trainer
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                currentStep > index + 1
                  ? 'border-primary bg-primary text-primary-foreground'
                  : currentStep === index + 1
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {currentStep > index + 1 ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-10 ${currentStep > index + 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {steps[currentStep - 1].content}

          <Separator className="my-6" />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            <Button onClick={handleNext} disabled={currentStep === steps.length}>
              {currentStep < steps.length ? (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Concluir'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 rounded-lg bg-primary/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Perguntas Frequentes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Posso cancelar uma solicitação?</h3>
            <p className="text-muted-foreground">
              Sim, você pode cancelar uma solicitação a qualquer momento antes que ela
              seja aceita pelo profissional.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Como funciona o pagamento?</h3>
            <p className="text-muted-foreground">
              O pagamento é feito diretamente ao profissional após a aceitação da
              solicitação, seguindo o método acordado entre as partes.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Posso trocar de profissional?</h3>
            <p className="text-muted-foreground">
              Sim, você pode encerrar um relacionamento profissional a qualquer momento e
              contratar outro profissional que melhor atenda às suas necessidades.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
