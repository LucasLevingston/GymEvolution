import {
  ContainerContent,
  ContainerHeader,
  ContainerRoot,
  ContainerTitle,
} from '@/components/Container';
import { TrainingWeekCard } from '@/components/training/training-week-card';
import { Button } from '@/components/ui/button';
import { ClipboardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateTraining() {
  const navigate = useNavigate();

  return (
    <>
      <ContainerHeader>
        <ContainerTitle>Create a new Training</ContainerTitle>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/workout-week')} variant="secondary">
            View current training
            <ClipboardIcon className="h-4 w-4" />
          </Button>
        </div>
      </ContainerHeader>
      <ContainerContent>
        <TrainingWeekCard isCreating={true} />
      </ContainerContent>
    </>
  );
}
