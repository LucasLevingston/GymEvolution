'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Clock, TrendingUp, Check } from 'lucide-react'
import {
  useMealItem,
  type FoodSearchResult,
  type NutritionData,
} from '@/hooks/use-meal-item'

interface FoodSearchProps {
  onSelectFood: (nutritionData: NutritionData) => void
  onCancel: () => void
}

export function FoodSearch({ onSelectFood, onCancel }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('search')
  const [selectedServingIndex, setSelectedServingIndex] = useState(0)

  const {
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
  } = useMealItem()

  // Load recent and popular foods on mount
  useEffect(() => {
    getRecentFoods()
    getPopularFoods()
  }, [getRecentFoods, getPopularFoods])

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      searchFoods(query)
    }
  }

  // Handle search button click
  const handleSearchClick = () => {
    if (searchQuery.length >= 2) {
      searchFoods(searchQuery)
    }
  }

  // Handle food selection
  const handleSelectFood = async (food: FoodSearchResult) => {
    await getFoodDetails(food.food_id)
    setSelectedServingIndex(0)
  }

  // Handle serving selection
  const handleServingChange = (index: number) => {
    setSelectedServingIndex(index)
    changeServing(index)
  }

  // Handle final selection
  const handleConfirmSelection = () => {
    if (nutritionData) {
      onSelectFood(nutritionData)
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                />
              </div>
              <Button onClick={handleSearchClick} disabled={searchQuery.length < 2}>
                Search
              </Button>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </TabsTrigger>
                <TabsTrigger value="recent">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search">
                <ScrollArea className="h-[300px] pr-4">
                  {error && (
                    <div className="text-center py-4 text-destructive">{error}</div>
                  )}

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
              </TabsContent>

              <TabsContent value="recent">
                <ScrollArea className="h-[300px] pr-4">
                  {recentFoods.length > 0 ? (
                    <div className="space-y-2">{recentFoods.map(renderFoodItem)}</div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent foods found.
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="popular">
                <ScrollArea className="h-[300px] pr-4">
                  {popularFoods.length > 0 ? (
                    <div className="space-y-2">{popularFoods.map(renderFoodItem)}</div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No popular foods found.
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
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
                {selectedFood.servings &&
                  selectedFood.servings.map((serving, index) => (
                    <div
                      key={serving.serving_id || index}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedServingIndex === index
                          ? 'border-primary bg-primary/5'
                          : ''
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

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection} className="flex-1">
                Select Food
              </Button>
            </div>
          </div>
        )}

        {!selectedFood && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
