import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getRelativeTime = (dateString?: string | Date) => {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
  } catch (error) {
    return '';
  }
};
