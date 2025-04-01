import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

interface GoogleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function GoogleButton({ onClick, isLoading = false }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <FcGoogle className="h-5 w-5" />
      )}
      Continue with Google
    </Button>
  );
}
