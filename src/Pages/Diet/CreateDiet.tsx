'use client'

import { DietComponent } from '@/components/diet/DietComponent'

export default function CreateDiet() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Create Diet Plan</h1>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Diet Plan Builder</h2>
        <DietComponent isCreating={true} />
      </div>
    </div>
  )
}
