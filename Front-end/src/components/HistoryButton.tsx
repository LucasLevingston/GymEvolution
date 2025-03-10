import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { BsJournalText } from 'react-icons/bs';
import { useHistory } from '@/hooks/history-hooks';
import useUser from '@/hooks/user-hooks';
import { useEffect, useState } from 'react';
import type { HistoryType } from '@/types/userType';
import { formatDate } from '@/estatico';

export default function ShowHistoryButton() {
	const { user } = useUser();
	const { getHistory } = useHistory();
	const [history, setHistory] = useState<HistoryType[]>([]);

	useEffect(() => {
		const fetchHistory = async () => {
			if (user) {
				const userHistory = await getHistory(user.id);
				setHistory(userHistory);
			}
		};

		fetchHistory();
	}, [user, getHistory]);

	if (!user) return null;

	return (
		<div>
			{history.length > 0 && (
				<Sheet>
					<SheetTrigger className="flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
						<span>History</span>
						<BsJournalText className="h-5 w-5" />
					</SheetTrigger>
					<SheetContent className="w-[400px] sm:w-[540px]">
						<SheetHeader>
							<SheetTitle className="text-gray-800 text-2xl font-bold">
								History
							</SheetTitle>
							<div className="max-h-[calc(90vh-100px)] overflow-y-auto">
								{history.map((eventItem, index) => (
									<SheetDescription
										key={index}
										className="mb-4 rounded-lg bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
									>
										<span className="text-gray-800 block text-lg font-semibold">
											{eventItem.event}
										</span>
										<span className="text-gray-600 text-sm">
											{formatDate(eventItem.date)}
										</span>
									</SheetDescription>
								))}
							</div>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			)}
		</div>
	);
}
