import type React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PencilIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { brazilianStates, capitalizeFirstLetter } from '@/estatico';

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
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	if (fieldName === 'state') {
		return (
			<div className="relative rounded-md border border-input bg-background p-4 shadow-sm transition-all duration-200 hover:shadow-md">
				<Label
					htmlFor={fieldName}
					className="mb-1 block text-sm font-medium text-foreground"
				>
					{fieldLabel}
				</Label>
				<div className="flex items-center space-x-2">
					<Popover open={open && editMode[fieldName]} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
								className="w-full justify-between"
								disabled={!editMode[fieldName]}
							>
								{value
									? brazilianStates.find((state) => state.value === value)
											?.label
									: 'Select state'}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0">
							<Command>
								<CommandInput placeholder="Search state..." />
								<CommandList>
									<CommandEmpty>No state found.</CommandEmpty>
									<CommandGroup>
										{brazilianStates.map((state) => (
											<CommandItem
												key={state.value}
												value={state.value}
												onSelect={(currentValue) => {
													setValue(
														fieldName || currentValue === value
															? ''
															: currentValue
													);
													setOpen(false);
												}}
											>
												<CheckIcon
													className={cn(
														'mr-2 h-4 w-4',
														value === state.value ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{state.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
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
	}
	return (
		<div className="relative rounded-md border border-input bg-background p-4 shadow-sm transition-all duration-200 hover:shadow-md">
			<Label
				htmlFor={fieldName}
				className="mb-1 block text-sm font-medium text-foreground"
			>
				{capitalizeFirstLetter(fieldLabel)}
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
