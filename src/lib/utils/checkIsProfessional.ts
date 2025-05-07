import { UserType } from '@/types/userType'

export function checkIsProfessional(user: UserType | null) {
  return user
    ? user.role !== 'STUDENT' &&
        user.role !== 'ADMIN' &&
        user.approvalStatus === 'APPROVED'
    : null
}
