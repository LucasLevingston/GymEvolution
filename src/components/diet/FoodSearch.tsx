'use client'

import type React from 'react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Check, Plus, Minus } from 'lucide-react'
import {
  useMealItem,
  type FoodSearchResult,
  type NutritionData,
} from '@/hooks/use-meal-item'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FoodSearchProps {
  onSelectFood: (nutritionData: NutritionData) => void
  onCancel: () => void
}

export function FoodSearch({ onSelectFood, onCancel }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedServingIndex, setSelectedServingIndex] = useState(0)
  const [customQuantity, setCustomQuantity] = useState(1)
  const [quantityUnit, setQuantityUnit] = useState<string>('serving')

  const {
    isLoading,
    error,
    searchResults,
    selectedFood,
    nutritionData,
    searchFoods,
    getFoodDetails,
    changeServing,
  } = useMealItem()

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      searchFoods(query)
    }
  }

  // Handle search button click
  const handleSearchClick = (e: React.MouseEvent) => {
    // Prevent event propagation to stop it from triggering parent handlers
    e.preventDefault()
    e.stopPropagation()

    if (searchQuery.length >= 2) {
      searchFoods(searchQuery)
    }
  }

  // Handle food selection
  const handleSelectFood = async (food: FoodSearchResult) => {
    await getFoodDetails(food.food_id)
    setSelectedServingIndex(0)
    setCustomQuantity(1)
  }

  // Handle serving selection
  const handleServingChange = (index: number) => {
    setSelectedServingIndex(index)
    changeServing(index)

    // Reset quantity when changing serving
    setCustomQuantity(1)

    // Set default unit based on serving
    if (selectedFood?.servings[index]) {
      const serving = selectedFood.servings[index]
      if (serving.metric_serving_unit) {
        setQuantityUnit(serving.metric_serving_unit)
      } else if (serving.serving_weight) {
        setQuantityUnit('g')
      } else {
        setQuantityUnit('serving')
      }
    }
  }

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    setCustomQuantity(value)

    // Update nutrition data with new quantity
    if (nutritionData) {
      const updatedNutrition = {
        ...nutritionData,
        calories: Math.round(nutritionData.calories * value),
        protein: Number.parseFloat((nutritionData.protein * value).toFixed(1)),
        carbohydrate: Number.parseFloat((nutritionData.calories * value).toFixed(1)),
        fat: Number.parseFloat((nutritionData.fat * value).toFixed(1)),
        quantity: value,
      }

      // This assumes your changeServing function can handle custom quantities
      // You might need to modify your hook to support this
      changeServing(selectedServingIndex, value)
    }
  }

  // Handle increment/decrement quantity
  const incrementQuantity = () => handleQuantityChange(customQuantity + 0.5)
  const decrementQuantity = () => {
    if (customQuantity > 0.5) {
      handleQuantityChange(customQuantity - 0.5)
    }
  }

  // Handle final selection
  const handleConfirmSelection = () => {
    if (nutritionData) {
      // Include custom quantity in the nutrition data
      const finalNutritionData = {
        ...nutritionData,
        quantity: customQuantity,
        unit: quantityUnit,
      }
      onSelectFood(finalNutritionData)
    }
  }

  // Render food item
  const renderFoodItem = (food: FoodSearchResult) => (
    <div
      key={food.food_id}
      className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
      onClick={() => handleSelectFood(food)}
    >
      <div className="font-medium">{food.food_name}</div>
      {food.brand_name && (
        <div className="text-sm text-muted-foreground">Brand: {food.brand_name}</div>
      )}
      {food.food_description && (
        <div className="text-sm text-muted-foreground truncate">
          {food.food_description}
        </div>
      )}
    </div>
  )

  // Get available units for the selected serving
  const getAvailableUnits = () => {
    if (!selectedFood || !selectedFood.servings[selectedServingIndex]) {
      return ['serving']
    }

    const serving = selectedFood.servings[selectedServingIndex]
    const units = []

    if (serving.metric_serving_unit) {
      units.push(serving.metric_serving_unit)
    }

    if (serving.serving_weight) {
      units.push('g')
    }

    units.push('serving')

    return units
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Database Search</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedFood ? (
          <>
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a food..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (searchQuery.length >= 2) {
                        searchFoods(searchQuery)
                      }
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={handleSearchClick}
                disabled={searchQuery.length < 2}
              >
                Search
              </Button>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              {error && <div className="text-center py-4 text-destructive">{error}</div>}

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border rounded-md">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">{searchResults.map(renderFoodItem)}</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery.length > 0
                    ? 'No foods found. Try a different search term.'
                    : 'Type at least 2 characters to search for foods.'}
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{selectedFood.food_name}</h3>
              {selectedFood.brand_name && (
                <p className="text-sm text-muted-foreground">
                  Brand: {selectedFood.brand_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Select Serving Size:</h4>
              <div className="space-y-2">
                {selectedFood.servings.map((serving, index) => (
                  <div
                    key={serving.serving_id || index}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedServingIndex === index ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleServingChange(index)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {serving.serving_description ||
                          serving.measurement_description ||
                          'Standard Serving'}
                      </div>
                      {selectedServingIndex === index && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="text-sm">
                      {serving.metric_serving_amount
                        ? `${serving.metric_serving_amount} ${serving.metric_serving_unit || 'g'}`
                        : serving.serving_size
                          ? `${serving.serving_size} ${serving.serving_weight ? 'g' : 'serving'}`
                          : '1 serving'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {serving.calories} cal • {serving.protein}g protein •{' '}
                      {serving.carbohydrate}g carbs • {serving.fat}g fat
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Quantity Selection */}
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-medium">Quantity:</h4>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    decrementQuantity()
                  }}
                  disabled={customQuantity <= 0.5}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[customQuantity]}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onValueChange={(values) => handleQuantityChange(values[0])}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    incrementQuantity()
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <div className="w-20">
                  <Input
                    type="number"
                    value={customQuantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    min={0.5}
                    step={0.5}
                    className="text-center"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="w-24">
                  <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                    <SelectTrigger onClick={(e) => e.stopPropagation()}>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableUnits().map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {nutritionData && (
                <div className="bg-muted/50 p-3 rounded-md mt-2">
                  <Label className="font-medium">
                    Nutrition (for {customQuantity} {quantityUnit}):
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    <div className="text-center p-2 bg-background rounded-md">
                      <div className="text-sm text-muted-foreground">Calories</div>
                      <div className="font-medium">
                        {Math.round(nutritionData.calories * customQuantity)}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-background rounded-md">
                      <div className="text-sm text-muted-foreground">Protein</div>
                      <div className="font-medium">
                        {(nutritionData.protein * customQuantity).toFixed(1)}g
                      </div>
                    </div>
                    <div className="text-center p-2 bg-background rounded-md">
                      <div className="text-sm text-muted-foreground">Carbs</div>
                      <div className="font-medium">
                        {(nutritionData.carbohydrates * customQuantity).toFixed(1)}g
                      </div>
                    </div>
                    <div className="text-center p-2 bg-background rounded-md">
                      <div className="text-sm text-muted-foreground">Fat</div>
                      <div className="font-medium">
                        {(nutritionData.fat * customQuantity).toFixed(1)}g
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onCancel()
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleConfirmSelection()
                }}
                className="flex-1"
              >
                Select Food
              </Button>
            </div>
          </div>
        )}

        {!selectedFood && (
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onCancel()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
