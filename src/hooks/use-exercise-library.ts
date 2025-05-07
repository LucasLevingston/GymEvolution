'use client'

import { useState, useEffect, useMemo } from 'react'

// Local exercise database
export interface Exercise {
  id: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  secondaryMuscles?: string[]
}

// Sample exercise data in Portuguese
const exercisesData: Exercise[] = [
  // Peito (Chest) exercises
  {
    id: '0001',
    name: 'Supino Reto',
    bodyPart: 'peito',
    target: 'peitoral',
    equipment: 'barra',
  },
  {
    id: '0002',
    name: 'Supino Inclinado',
    bodyPart: 'peito',
    target: 'peitoral superior',
    equipment: 'barra',
  },
  {
    id: '0003',
    name: 'Supino Declinado',
    bodyPart: 'peito',
    target: 'peitoral inferior',
    equipment: 'barra',
  },
  {
    id: '0004',
    name: 'Crucifixo com Halteres',
    bodyPart: 'peito',
    target: 'peitoral',
    equipment: 'halteres',
  },
  {
    id: '0005',
    name: 'Crossover no Cabo',
    bodyPart: 'peito',
    target: 'peitoral',
    equipment: 'cabo',
  },
  {
    id: '0006',
    name: 'Flexão de Braço',
    bodyPart: 'peito',
    target: 'peitoral',
    equipment: 'peso corporal',
  },

  // Costas (Back) exercises
  {
    id: '0007',
    name: 'Barra Fixa',
    bodyPart: 'costas',
    target: 'latíssimo',
    equipment: 'peso corporal',
  },
  {
    id: '0008',
    name: 'Puxada na Frente',
    bodyPart: 'costas',
    target: 'latíssimo',
    equipment: 'cabo',
  },
  {
    id: '0009',
    name: 'Remada Curvada',
    bodyPart: 'costas',
    target: 'costas superior',
    equipment: 'barra',
  },
  {
    id: '0010',
    name: 'Remada Sentada no Cabo',
    bodyPart: 'costas',
    target: 'costas média',
    equipment: 'cabo',
  },
  {
    id: '0011',
    name: 'Levantamento Terra',
    bodyPart: 'costas',
    target: 'lombar',
    equipment: 'barra',
  },

  // Pernas (Legs) exercises
  {
    id: '0012',
    name: 'Agachamento',
    bodyPart: 'pernas',
    target: 'quadríceps',
    equipment: 'barra',
  },
  {
    id: '0013',
    name: 'Leg Press',
    bodyPart: 'pernas',
    target: 'quadríceps',
    equipment: 'máquina',
  },
  {
    id: '0014',
    name: 'Extensão de Pernas',
    bodyPart: 'pernas',
    target: 'quadríceps',
    equipment: 'máquina',
  },
  {
    id: '0015',
    name: 'Flexão de Pernas',
    bodyPart: 'pernas',
    target: 'isquiotibiais',
    equipment: 'máquina',
  },
  {
    id: '0016',
    name: 'Elevação de Panturrilha',
    bodyPart: 'pernas',
    target: 'panturrilhas',
    equipment: 'máquina',
  },

  // Ombros (Shoulders) exercises
  {
    id: '0017',
    name: 'Desenvolvimento com Barra',
    bodyPart: 'ombros',
    target: 'deltoides',
    equipment: 'barra',
  },
  {
    id: '0018',
    name: 'Elevação Lateral',
    bodyPart: 'ombros',
    target: 'deltoides laterais',
    equipment: 'halteres',
  },
  {
    id: '0019',
    name: 'Elevação Frontal',
    bodyPart: 'ombros',
    target: 'deltoides anteriores',
    equipment: 'halteres',
  },
  {
    id: '0020',
    name: 'Crucifixo Invertido',
    bodyPart: 'ombros',
    target: 'deltoides posteriores',
    equipment: 'halteres',
  },

  // Braços (Arms) exercises - Bíceps
  {
    id: '0021',
    name: 'Rosca Direta',
    bodyPart: 'bíceps',
    target: 'bíceps',
    equipment: 'halteres',
  },
  {
    id: '0022',
    name: 'Rosca Martelo',
    bodyPart: 'bíceps',
    target: 'bíceps',
    equipment: 'halteres',
  },
  {
    id: '0023',
    name: 'Rosca Scott',
    bodyPart: 'bíceps',
    target: 'bíceps',
    equipment: 'barra',
  },
  {
    id: '0024',
    name: 'Rosca Concentrada',
    bodyPart: 'bíceps',
    target: 'bíceps',
    equipment: 'halteres',
  },

  // Braços (Arms) exercises - Tríceps
  {
    id: '0025',
    name: 'Tríceps Pulley',
    bodyPart: 'tríceps',
    target: 'tríceps',
    equipment: 'cabo',
  },
  {
    id: '0026',
    name: 'Tríceps Francês',
    bodyPart: 'tríceps',
    target: 'tríceps',
    equipment: 'halteres',
  },
  {
    id: '0027',
    name: 'Tríceps Testa',
    bodyPart: 'tríceps',
    target: 'tríceps',
    equipment: 'barra',
  },
  {
    id: '0028',
    name: 'Mergulho no Banco',
    bodyPart: 'tríceps',
    target: 'tríceps',
    equipment: 'peso corporal',
  },

  // Abdômen (Core) exercises
  {
    id: '0029',
    name: 'Abdominal Tradicional',
    bodyPart: 'abdômen',
    target: 'abdominais',
    equipment: 'peso corporal',
  },
  {
    id: '0030',
    name: 'Prancha',
    bodyPart: 'abdômen',
    target: 'abdominais',
    equipment: 'peso corporal',
  },
  {
    id: '0031',
    name: 'Rotação Russa',
    bodyPart: 'abdômen',
    target: 'oblíquos',
    equipment: 'peso corporal',
  },
  {
    id: '0032',
    name: 'Elevação de Pernas',
    bodyPart: 'abdômen',
    target: 'abdominais inferiores',
    equipment: 'peso corporal',
  },
]

// Get all unique body parts for filtering
export const bodyParts = Array.from(
  new Set(exercisesData.map((exercise) => exercise.bodyPart))
)

export function useExerciseLibrary(
  initialExerciseName = '',
  muscleGroups: string[] = []
) {
  const [searchTerm, setSearchTerm] = useState<string>(initialExerciseName)
  const [suggestions, setSuggestions] = useState<Exercise[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  // Memoize the parsed muscle muscleGroups to prevent unnecessary re-renders
  const parsedMuscleGroups = useMemo(() => {
    if (!muscleGroups || muscleGroups.length === 0) return []

    // If it's already an array, use it directly
    if (Array.isArray(muscleGroups)) return muscleGroups

    // Otherwise, parse the string
    return []
  }, [muscleGroups])

  // Search exercises based on name and muscle muscleGroups
  const searchExercises = (term: string, muscleGroupsInput: string[] = []) => {
    setIsSearching(true)

    try {
      // Filter exercises based on muscle muscleGroups first
      let filteredExercises = [...exercisesData]

      if (muscleGroupsInput.length > 0) {
        filteredExercises = filteredExercises.filter((exercise) =>
          muscleGroupsInput.some(
            (muscleGroup) => exercise.bodyPart.toLowerCase() === muscleGroup.toLowerCase()
          )
        )
      }

      // Then filter by search term if provided
      if (term && term.length >= 2) {
        filteredExercises = filteredExercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(term.toLowerCase())
        )
      }

      // Limit to 20 results for better performance
      const results = filteredExercises.slice(0, 20)
      setSuggestions(results)
      return results
    } catch (err) {
      console.error('Error searching exercises:', err)
      setSuggestions([])
      return []
    } finally {
      setIsSearching(false)
    }
  }

  // Select a specific exercise
  const selectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setSuggestions([])
    return exercise
  }

  // Effect to search when search term or muscle muscleGroups change
  useEffect(() => {
    const timer = setTimeout(() => {
      searchExercises(searchTerm, parsedMuscleGroups)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, parsedMuscleGroups])

  // Initial search if an exercise name is provided
  useEffect(() => {
    if (initialExerciseName && initialExerciseName.length >= 2) {
      setSearchTerm(initialExerciseName)
      searchExercises(initialExerciseName, parsedMuscleGroups)

      // Find the exercise in our data
      const exercise = exercisesData.find(
        (ex) => ex.name.toLowerCase() === initialExerciseName.toLowerCase()
      )

      if (exercise) {
        setSelectedExercise(exercise)
      }
    } else if (parsedMuscleGroups.length > 0) {
      // If no exercise name but muscle muscleGroups are provided, search by muscle muscleGroups
      searchExercises('', parsedMuscleGroups)
    }
  }, [initialExerciseName, parsedMuscleGroups])

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isSearching,
    searchExercises,
    selectExercise,
    selectedExercise,
    bodyParts,
  }
}
