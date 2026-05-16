import { useMemo, useState } from 'react';
import { exercises } from '../data/exercises';
import { muscles } from '../data/muscles';
import type { Exercise } from '../data/types';

const normalize = (value: string) => value.trim().toLocaleLowerCase('ru-RU');

const includesText = (haystack: string, needle: string) => normalize(haystack).includes(needle);

const exerciseMatchesMuscles = (exercise: Exercise, selectedMuscleIds: Set<string>) => {
  if (selectedMuscleIds.size === 0) {
    return true;
  }

  const allMuscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
  return allMuscles.some((muscleId) => selectedMuscleIds.has(muscleId));
};

export function useCatalogFilters() {
  const [muscleSearch, setMuscleSearch] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [isolationOnly, setIsolationOnly] = useState(false);
  const [selectedMuscleIds, setSelectedMuscleIds] = useState<Set<string>>(new Set());
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(exercises[0]?.id ?? null);
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');

  const filteredMuscles = useMemo(() => {
    const query = normalize(muscleSearch);
    if (!query) {
      return muscles;
    }

    return muscles.filter((muscle) => {
      const searchable = [muscle.nameRu, muscle.groupRu, ...muscle.aliases, muscle.descriptionRu].join(' ');
      return includesText(searchable, query);
    });
  }, [muscleSearch]);

  const visibleExercises = useMemo(() => {
    const query = normalize(exerciseSearch);

    return exercises
      .filter((exercise) => exerciseMatchesMuscles(exercise, selectedMuscleIds))
      .filter((exercise) => (isolationOnly ? exercise.isIsolation : true))
      .filter((exercise) => {
        if (!query) {
          return true;
        }

        const searchable = [
          exercise.nameRu,
          exercise.categoryRu,
          exercise.equipmentRu,
          exercise.difficultyRu,
          exercise.descriptionRu,
          ...exercise.aliases,
          ...exercise.instructionsRu,
        ].join(' ');

        return includesText(searchable, query);
      })
      .sort((left, right) => {
        if (selectedMuscleIds.size === 0) {
          return left.nameRu.localeCompare(right.nameRu, 'ru');
        }

        const score = (exercise: Exercise) =>
          [...exercise.primaryMuscles, ...exercise.secondaryMuscles].filter((muscleId) => selectedMuscleIds.has(muscleId)).length;

        return score(right) - score(left) || left.nameRu.localeCompare(right.nameRu, 'ru');
      });
  }, [exerciseSearch, isolationOnly, selectedMuscleIds]);

  const selectedExercise = useMemo(
    () => visibleExercises.find((exercise) => exercise.id === selectedExerciseId) ?? visibleExercises[0] ?? null,
    [selectedExerciseId, visibleExercises],
  );

  return {
    bodyView,
    setBodyView,
    muscleSearch,
    setMuscleSearch,
    exerciseSearch,
    setExerciseSearch,
    isolationOnly,
    setIsolationOnly,
    selectedMuscleIds,
    setSelectedMuscleIds,
    selectedExerciseId,
    setSelectedExerciseId,
    filteredMuscles,
    visibleExercises,
    selectedExercise,
  };
}