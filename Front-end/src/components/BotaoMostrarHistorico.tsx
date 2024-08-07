// @jsx BotaoMostrarHistorico

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { BsJournalText } from 'react-icons/bs';
import { formatarData } from '@/estatico';
import { History, UserType } from '@/types/userType';
import { useEffect, useState } from 'react';
import { useHistory } from '@/hooks/history-hooks';
import useUser from '@/hooks/user-hooks';

export default function BotaoMostrarHistorico() {
	const [user, setUser] = useState<UserType | null>(null);
	const [historico, setHistorico] = useState<History[] | null>(null);

	const { getHistory } = useHistory();
	const { getUser } = useUser();

	useEffect(() => {
		const fetchUser = async () => {
			const fetchedUser: UserType = await getUser();
			setUser(fetchedUser);

			const historicoAtual = await getHistory(fetchedUser?.id);
			if (historicoAtual) setHistorico(historicoAtual);
		};
		fetchUser();
	}, [getUser]);

	return (
		<div className="rounded-lg bg-cinza">
			{historico && user && (
				<Sheet>
					<SheetTrigger className="text-xm flex items-center justify-center space-x-2 p-2 px-3 text-preto ">
						<div>History</div>
						<BsJournalText />
					</SheetTrigger>
					<SheetContent className="">
						<SheetHeader>
							<SheetTitle>Histórico</SheetTitle>
							<SheetDescription className="max-h-[90vh] overflow-y-auto">
								{historico.map((acontecimento, index) => (
									<div
										key={index}
										className="space-y-1 border-b py-2 text-preto"
									>
										<p>Ocorrido: {acontecimento.event}</p>
										<p>Data: {formatarData(acontecimento.date)}</p>
									</div>
								))}
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			)}
		</div>
	);
}
