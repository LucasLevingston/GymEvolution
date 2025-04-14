import { UserType } from '@/types/userType'

export function checkIsProfessional(user: UserType) {
  return user.role !== 'STUDENT'
}
