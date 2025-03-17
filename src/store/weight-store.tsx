import type { WeightType } from '@/types/userType'

interface WeightStore {
  weights: WeightType[]
  isLoading: boolean
  error: string | null
}

class WeightStoreService {
  private store: WeightStore = {
    weights: [],
    isLoading: false,
    error: null,
  }

  private listeners: Set<() => void> = new Set()

  getState(): WeightStore {
    return this.store
  }

  setWeights(weights: WeightType[]) {
    this.setState({ weights })
  }

  setLoading(isLoading: boolean) {
    this.setState({ isLoading })
  }

  setError(error: string | null) {
    this.setState({ error })
  }

  private setState(newState: Partial<WeightStore>) {
    this.store = { ...this.store, ...newState }
    this.notify()
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const weightStore = new WeightStoreService()
