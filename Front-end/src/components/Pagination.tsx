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
	const [page, setPagina] = useState<number>(1);

	const handlePreviousPage = (pageAtual: number) => {
		onChangePage(pageAtual);
	};

	const handleNextPage = (pageAtual: number) => {
		onChangePage(pageAtual);
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					{page === 1 ? (
						<Button disabled className="gap-1 pl-2.5">
							<ChevronLeft className="h-4 w-4" />
							Back
						</Button>
					) : (
						<PaginationPrevious
							onClick={() => {
								handlePreviousPage(1);
								setPagina(page - 1);
							}}
						/>
					)}
				</PaginationItem>
				<PaginationItem>
					{page === 1 ? (
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
					{page === 2 ? (
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
					{page === 2 ? (
						<Button disabled className="gap-1 pl-2.5">
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					) : (
						<PaginationNext
							onClick={() => {
								handleNextPage(2);
								setPagina(page + 1);
							}}
						/>
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default Paginacao;
