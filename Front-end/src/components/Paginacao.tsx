import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacaoProps {
   onChangePage: (page: number) => void;
}

const Paginacao: React.FC<PaginacaoProps> = ({ onChangePage }) => {
   const [pagina, setPagina] = useState<number>(1);

   const handlePreviousPage = (paginaAtual: number) => {
      onChangePage(paginaAtual);
   };

   const handleNextPage = (paginaAtual: number) => {
      onChangePage(paginaAtual);
   };

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               {pagina === 1 ? (
                  <Button disabled className="gap-1 pl-2.5">
                     <ChevronLeft className="h-4 w-4" />
                     Voltar
                  </Button>
               ) : (
                  <PaginationPrevious
                     onClick={() => {
                        handlePreviousPage(1);
                        setPagina(pagina - 1);
                     }}
                  />
               )}
            </PaginationItem>
            <PaginationItem>
               {pagina === 1 ? (
                  <Button className="border">1</Button>
               ) : (
                  <Button
                     onClick={() => {
                        setPagina(1);
                        handlePreviousPage(1);
                     }}
                  >
                     1
                  </Button>
               )}
            </PaginationItem>
            <PaginationItem>
               {pagina === 2 ? (
                  <Button className="border">2</Button>
               ) : (
                  <Button
                     onClick={() => {
                        handlePreviousPage(2);

                        setPagina(2);
                     }}
                  >
                     2
                  </Button>
               )}
            </PaginationItem>
            <PaginationItem>
               {pagina === 2 ? (
                  <Button disabled className="gap-1 pl-2.5">
                     Proximo
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               ) : (
                  <PaginationNext
                     onClick={() => {
                        handleNextPage(2);
                        setPagina(pagina + 1);
                     }}
                  />
               )}
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
};

export default Paginacao;