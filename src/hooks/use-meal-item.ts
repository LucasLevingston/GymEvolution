'use client'

import api from '@/lib/api'
import { useState, useCallback } from 'react'
import useUser from './user-hooks'

// Types for the FatSecret API data
export interface FoodSearchResult {
  food_id: string
  food_name: string
  food_description?: string
  brand_name?: string
  food_type?: string
  food_url?: string
}

export interface ServingInfo {
  serving_id: string
  serving_description?: string
  serving_url?: string
  metric_serving_amount?: string
  metric_serving_unit?: string
  measurement_description?: string
  number_of_units?: number
  serving_size?: string
  serving_weight?: number
  calories: number
  carbohydrate: number
  protein: number
  fat: number
  saturated_fat?: number
  polyunsaturated_fat?: number
  monounsaturated_fat?: number
  trans_fat?: number
  cholesterol?: number
  sodium?: number
  potassium?: number
  fiber?: number
  sugar?: number
  vitamin_a?: number
  vitamin_c?: number
  calcium?: number
  iron?: number
}

export interface FoodDetails {
  food_id: string
  food_name: string
  food_type?: string
  brand_name?: string
  food_url?: string
  servings: ServingInfo[]
}

export interface NutritionData {
  food_id: string
  food_name: string
  brand_name?: string
  servingDescription: string
  servingAmount: string
  servingUnit: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  servingId: string
}

export interface MealItemData {
  id?: string
  name: string
  quantity: string
  quantityType: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  mealId?: string
  foodId?: string
  servingId?: string
  substitutions?: MealItemData[]
}

export function useMealItem() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([])
  const [selectedFood, setSelectedFood] = useState<FoodDetails | null>(null)
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [recentFoods, setRecentFoods] = useState<FoodSearchResult[]>([])
  const [popularFoods, setPopularFoods] = useState<FoodSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const { token } = useUser()

  // Search for foods
  const searchFoods = useCallback(
    async (query: string, page = 0, maxResults = 10) => {
      if (query.length < 2) return

      setIsLoading(true)
      setError(null)

      try {
        const { data } = await api.get(
          `/fatsecret/foods/search?query=${encodeURIComponent(query)}&page=${page}&maxResults=${maxResults}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!data) {
          throw new Error(`Search failed: ${data}`)
        }

        // Handle the FatSecret API data format
        if (data.foods.food) {
          // FatSecret API returns a single object if there's only one result
          // and an array if there are multiple results
          const foodArray = Array.isArray(data.foods.food)
            ? data.foods.food
            : [data.foods.food]

          setSearchResults(foodArray)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Error searching foods:', error)
        setError('Failed to search foods. Please try again.')
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  // Get food details
  const getFoodDetails = useCallback(
    async (foodId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data } = await api.get(`/fatsecret/foods/${foodId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!data || !data.food) {
          throw new Error(`Failed to get food details: ${data}`)
        }

        // Process the FatSecret API data
        const foodData = data.food

        // Handle servings - FatSecret API returns a single object if there's only one serving
        // and an array if there are multiple servings
        const servingsArray = foodData.servings.serving
          ? Array.isArray(foodData.servings.serving)
            ? foodData.servings.serving
            : [foodData.servings.serving]
          : []

        const foodDetails: FoodDetails = {
          food_id: foodData.food_id,
          food_name: foodData.food_name,
          food_type: foodData.food_type,
          brand_name: foodData.brand_name,
          food_url: foodData.food_url,
          servings: servingsArray,
        }

        setSelectedFood(foodDetails)

        // Set default nutrition data from the first serving if available
        if (foodDetails.servings && foodDetails.servings.length > 0) {
          const firstServing = foodDetails.servings[0]

          setNutritionData({
            food_id: foodDetails.food_id,
            food_name: foodDetails.food_name,
            brand_name: foodDetails.brand_name,
            servingDescription: firstServing.serving_description || 'Standard Serving',
            servingAmount:
              firstServing.metric_serving_amount || firstServing.serving_size || '1',
            servingUnit: firstServing.metric_serving_unit || 'g',
            calories: Number(firstServing.calories),
            protein: Number(firstServing.protein),
            carbohydrates: Number(firstServing.carbohydrate),
            fat: Number(firstServing.fat),
            servingId: '0',
          })
        }

        return foodDetails
      } catch (error) {
        console.error('Error getting food details:', error)
        setError('Failed to get food details. Please try again.')
        setSelectedFood(null)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  // Change serving size
  const changeServing = useCallback(
    (servingIndex: number) => {
      if (
        !selectedFood ||
        !selectedFood.servings ||
        servingIndex >= selectedFood.servings.length
      )
        return

      const serving = selectedFood.servings[servingIndex]

      setNutritionData({
        food_id: selectedFood.food_id,
        food_name: selectedFood.food_name,
        brand_name: selectedFood.brand_name,
        servingDescription: serving.serving_description || 'Standard Serving',
        servingAmount: serving.metric_serving_amount || serving.serving_size || '1',
        servingUnit: serving.metric_serving_unit || 'g',
        calories: Number(serving.calories),
        protein: Number(serving.protein),
        carbohydrates: Number(serving.carbohydrate),
        fat: Number(serving.fat),
        servingId: '0',
      })
    },
    [selectedFood]
  )

  // Get recent foods
  const getRecentFoods = useCallback(
    async (maxResults = 10) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data } = await api.get(
          `/fatsecret/foods/recent?maxResults=${maxResults}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!data) {
          throw new Error(`Failed to get recent foods: ${data}`)
        }

        if (data.foods.food) {
          // FatSecret API returns a single object if there's only one result
          // and an array if there are multiple results
          const foodArray = Array.isArray(data.foods.food)
            ? data.foods.food
            : [data.foods.food]

          setRecentFoods(foodArray)
        } else {
          setRecentFoods([])
        }
      } catch (error) {
        console.error('Error getting recent foods:', error)
        setError('Failed to get recent foods. Please try again.')
        setRecentFoods([])
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  // Get popular foods
  const getPopularFoods = useCallback(
    async (maxResults = 10) => {
      setIsLoading(true)
      setError(null)

      try {
        const { data } = await api.get(
          `/fatsecret/foods/popular?maxResults=${maxResults}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!data) {
          throw new Error(`Failed to get popular foods: ${data}`)
        }

        // Handle the FatSecret API data format
        if (data.foods.food) {
          // FatSecret API returns a single object if there's only one result
          // and an array if there are multiple results
          const foodArray = Array.isArray(data.foods.food)
            ? data.foods.food
            : [data.foods.food]

          setPopularFoods(foodArray)
        } else {
          setPopularFoods([])
        }
      } catch (error) {
        console.error('Error getting popular foods:', error)
        setError('Failed to get popular foods. Please try again.')
        setPopularFoods([])
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  // Convert food details to meal item data
  const convertToMealItem = useCallback(
    (food: FoodDetails, servingIndex: number): MealItemData | null => {
      if (!food.servings || servingIndex >= food.servings.length) return null

      const serving = food.servings[servingIndex]

      return {
        name: food.food_name,
        quantity: serving.metric_serving_amount || serving.serving_size || '1',
        quantityType: serving.metric_serving_unit || 'g',
        calories: Number(serving.calories),
        protein: Number(serving.protein),
        carbohydrates: Number(serving.carbohydrate),
        fat: Number(serving.fat),
        foodId: food.food_id,
        servingId: serving.serving_id,
      }
    },
    []
  )

  // Reset selected food
  const resetSelection = useCallback(() => {
    setSelectedFood(null)
    setNutritionData(null)
  }, [])

  // CRUD operations for meal items
  const deleteMealItem = useCallback(async (id: string) => {
    try {
      const { data } = await api.delete(`/meal-items/${id}`)

      if (!data) {
        throw new Error(`Failed to delete meal item: ${data}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting meal item:', error)
      throw new Error('Failed to delete meal item')
    }
  }, [])

  return {
    isLoading,
    error,
    searchResults,
    selectedFood,
    nutritionData,
    recentFoods,
    popularFoods,
    searchFoods,
    getFoodDetails,
    changeServing,
    getRecentFoods,
    getPopularFoods,
    convertToMealItem,
    deleteMealItem,
    resetSelection,
  }
}
