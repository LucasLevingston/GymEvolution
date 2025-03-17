import { useState } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import type { UserType } from '@/types/userType';
import { UserSchema } from '@/schemas/UserSchema';
import DataCard from '@/components/DataCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SiedbarComponent from '@/components/sidebar/SiedbarComponent';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import HistoryButton from '@/components/HistoryButton';

type UserFormValues = z.infer<typeof UserSchema>;

const userFields = [
  'name',
  'email',
  'street',
  'number',
  'zipCode',
  'city',
  'state',
  'sex',
  'phone',
  'birthDate',
  'currentWeight',
];

export default function MyInformations() {
  const { updateUser, user } = useUser();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      street: user?.street || '',
      number: user?.number || '',
      zipCode: user?.zipCode || '',
      city: user?.city || '',
      state: user?.state || '',
      sex: user?.sex || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      currentWeight: user?.currentWeight || '',
    },
    mode: 'onChange',
  });

  const handleEditClick = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data: UserFormValues) => {
    if (!user) return;

    setIsSubmitting(true);

    const updatedUser: UserType = {
      ...user,
      ...data,
    };

    try {
      await updateUser(updatedUser);
      toast.success('Your information has been updated.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiedbarComponent>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            My Information
            <HistoryButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userFields.map((fieldName) => (
                <DataCard
                  key={fieldName}
                  fieldName={fieldName}
                  fieldLabel={fieldName.split(/(?=[A-Z])/).join(' ')}
                  register={register}
                  editMode={editMode}
                  handleEditClick={() => handleEditClick(fieldName)}
                  errors={errors}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SiedbarComponent>
  );
}
