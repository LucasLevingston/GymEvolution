import type { UserType } from '@/types/userType'
import { useUserStore } from '@/store/user-store'
import api from '@/lib/api'
import { useEffect } from 'react'

export const useUser = () => {
  const {
    setUser,
    user,
    clearUser,
    updateUser: updateUserStore,
    token,
    setToken,
  } = useUserStore()

  useEffect(() => {
    const checkTokenAndLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const urlToken = urlParams.get('token')
      const urlUserId = urlParams.get('userId')

      if (urlToken) {
        setToken(urlToken)
      }

      if (token) {
        const isValid = await validateToken()
        if (isValid) {
          if (user?.id) {
            const userData = await getUser(user.id)
            setUser(userData)
          }
        } else {
          logout()
        }
      }
      if (urlToken && urlUserId) {
        const userData = await getUser(urlUserId)
        setUser(userData)
        window.location.href = '/'
      }
    }

    checkTokenAndLogin()
  }, [token])

  const validateToken = async (): Promise<boolean> => {
    try {
      if (!token) {
        return false
      }

      await api.post(
        '/auth/validate-token',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return true
    } catch (error: any) {
      if (error.response.data.message === 'Invalid token') {
        logout()
        return false
      }

      console.error('Token validation error:', error)
      return false
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { data } = await api.get('/auth/google', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!data.authUrl) {
        throw new Error(data.error || 'Failed to start Google authentication')
      }

      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error starting Google authentication:', error)
    }
  }

  const getUser = async (id: string): Promise<UserType> => {
    const { data } = await api.get<UserType>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!data) {
      throw new Error('No data received from server')
    }

    if (data.id === user?.id) {
      setUser(data)
    }

    return data
  }

  const login = async (loginData: {
    email: string
    password: string
  }): Promise<UserType> => {
    try {
      const { data } = await api.post('/auth/login', loginData)

      if (!data) throw new Error('Error on request to login')
      setUser(data.user)
      setToken(data.token)

      return data.user
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }

  const createUser = async (newUser: {
    name: string
    email: string
    password: string
  }): Promise<UserType> => {
    try {
      const { data } = await api.post('/auth/register', newUser)

      return data
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }

  const updateUser = async (updatedUser: Partial<UserType>) => {
    try {
      if (updatedUser.profilePictureFile && !updatedUser.useGooglePicture) {
        const formData = new FormData()

        Object.entries(updatedUser).map(([key, value]) => {
          if (key !== 'id' && key !== 'profilePictureFile') {
            if (value !== null && typeof value === 'object' && !(value instanceof File)) {
              formData.append(key, JSON.stringify(value))
            } else if (value !== undefined) {
              formData.append(key, value as string | Blob)
            }
          }
        })

        // Add the profile picture file if it exists
        if (updatedUser.profilePictureFile instanceof File) {
          formData.append('profilePictureFile', updatedUser.profilePictureFile)
        }

        const { data } = await api.put(`/users/${updatedUser.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        updateUserStore(data)
        return data
      } else if (updatedUser.useGooglePicture) {
        console.log(updatedUser.useGooglePicture)

        const { data } = await api.put(`/users/${updatedUser.id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        updateUserStore(data)
        return data
      }
    } catch (error: any) {
      console.log(error.response.data.error)
    }
  }

  const logout = () => {
    clearUser()
  }

  const passwordRecover = async (email: string) => {
    try {
      const { data } = await api.post('/auth/password-recover', { email })
      if (!data) {
        throw new Error('Error on request to password recover')
      }

      return data.message
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }
  const resetPassword = async (newPassword: { token: string; password: string }) => {
    try {
      const { data } = await api.post('/auth/reset-password', newPassword)
      if (!data) {
        throw new Error('Error on request to reset password')
      }

      return data.message
    } catch (error: any) {
      throw new Error(error.response.data.message)
    }
  }

  const getBasalMetabolicRate = (): number | null => {
    if (!user?.currentWeight || !user.height || !user.birthDate || !user.sex) {
      return null
    }

    const weight = Number.parseFloat(user.currentWeight)
    const height = Number.parseFloat(user.height)
    const birthDate = new Date(user.birthDate)
    const age = new Date().getFullYear() - birthDate.getFullYear()

    if (user.sex === 'male') {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    }

    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
  }

  interface RelationshipData {
    studentId: string
    nutritionistId?: string
    trainerId?: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  }
  const createRelationship = async (data: RelationshipData): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Relationship data:', data)
    return { success: true }
  }

  const getRelationships = async (userId: string): Promise<any[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Fetching relationships for user ID:', userId)
    return []
  }

  const updateRelationship = async (
    relationshipId: string,
    data: { status: 'PENDING' | 'ACCEPTED' | 'REJECTED' }
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(`Updating relationship ${relationshipId} with data:`, data)
  }

  return {
    user,
    login,
    logout,
    createUser,
    getUser,
    updateUser,
    passwordRecover,
    resetPassword,
    token,
    getBasalMetabolicRate,
    createRelationship,
    getRelationships,
    updateRelationship,
    loginWithGoogle,
  }
}

export default useUser
