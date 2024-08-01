import React from 'react';
import { Input } from '@/components/ui/input'; // Ajuste o caminho conforme necessário
import { Button } from '@/components/ui/button'; // Ajuste o caminho conforme necessário
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { UserSchema } from '@/schemas/UserSchema';
import { z } from 'zod';
type UserFormValues = z.infer<typeof UserSchema>;

interface DataCardProps {
	fieldName: keyof UserFormValues;
	fieldLabel: string;
	register: UseFormRegister<UserFormValues>;
	setValue: UseFormSetValue<UserFormValues>;
	editMode: { [key: string]: boolean };
	handleEditClick: (field: keyof UserFormValues) => void;
	errors: FieldErrors<UserFormValues>;
}

const DataCard: React.FC<DataCardProps> = ({
	fieldName,
	fieldLabel,
	register,
	setValue,
	editMode,
	handleEditClick,
	errors,
}) => {
	return (
		<div className="h-13 w-[40%] rounded bg-gray-200 p-2">
			<h1 className="text-xs font-bold">{fieldLabel}</h1>
			<div className="flex items-center justify-between">
				<Input
					{...register(fieldName)}
					onChange={(e) => setValue(fieldName, e.target.value)}
					disabled={!editMode[fieldName]}
					className={`rounded border p-1 ${editMode[fieldName] ? 'bg-white' : 'bg-gray-200'} ${errors[fieldName] ? 'border-red-500' : ''}`}
				/>
				<Button
					type="button"
					onClick={() => handleEditClick(fieldName)}
					className="ml-2"
				>
					{editMode[fieldName] ? 'Save' : 'Edit'}
				</Button>
			</div>
			{errors[fieldName] && (
				<span className="text-xs text-red-500">
					{errors[fieldName]?.message}
				</span>
			)}
		</div>
	);
};

export default DataCard;
