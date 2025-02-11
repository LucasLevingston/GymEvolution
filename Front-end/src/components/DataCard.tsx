import type React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon } from 'lucide-react';

interface DataCardProps {
	fieldName: string;
	fieldLabel: string;
	register: any;
	editMode: { [key: string]: boolean };
	handleEditClick: () => void;
	errors: any;
}

const DataCard: React.FC<DataCardProps> = ({
	fieldName,
	fieldLabel,
	register,
	editMode,
	handleEditClick,
	errors,
}) => {
	return (
		<div className="relative rounded-md border border-input bg-background p-4 shadow-sm transition-all duration-200 hover:shadow-md">
			<Label
				htmlFor={fieldName}
				className="mb-1 block text-sm font-medium text-foreground"
			>
				{fieldLabel}
			</Label>
			<div className="flex items-center space-x-2">
				<Input
					{...register(fieldName)}
					id={fieldName}
					disabled={!editMode[fieldName]}
					className={`flex-grow ${editMode[fieldName] ? 'bg-background' : 'bg-muted'}`}
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={handleEditClick}
					className="h-8 w-8 shrink-0"
				>
					{editMode[fieldName] ? (
						<CheckIcon className="h-4 w-4" />
					) : (
						<PencilIcon className="h-4 w-4" />
					)}
				</Button>
			</div>
			{errors[fieldName] && (
				<p className="mt-1 text-xs text-destructive">
					{errors[fieldName].message}
				</p>
			)}
		</div>
	);
};

export default DataCard;
