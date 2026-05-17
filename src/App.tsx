import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Collapse, Container, Stack, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { exercises as exerciseCatalog } from './data/exercises';
import { muscles } from './data/muscles';
import { BodyDiagram } from './components/BodyDiagram';
import { ExerciseDetails } from './components/ExerciseDetails';
import { ExerciseList } from './components/ExerciseList';
import { MuscleList } from './components/MuscleList';
import { useCatalogFilters } from './hooks/useCatalogFilters';

export default function App() {
  const {
    muscleSearch,
    setMuscleSearch,
    exerciseSearch,
    setExerciseSearch,
    isolationOnly,
    setIsolationOnly,
    allSelectedMusclesOnly,
    setAllSelectedMusclesOnly,
    selectedMuscleIds,
    setSelectedMuscleIds,
    selectedExerciseId,
    setSelectedExerciseId,
    filteredMuscles,
    visibleExercises,
    selectedExercise,
  } = useCatalogFilters();
  const [multiExerciseSelection, setMultiExerciseSelection] = useState(false);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<Set<string>>(new Set());
  const [starredExerciseIds, setStarredExerciseIds] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (visibleExercises.length === 0) {
      setSelectedExerciseId(null);
      return;
    }

    if (!selectedExerciseId || !visibleExercises.some((exercise) => exercise.id === selectedExerciseId)) {
      setSelectedExerciseId(visibleExercises[0].id);
    }
  }, [selectedExerciseId, setSelectedExerciseId, visibleExercises]);

  useEffect(() => {
    if (selectedMuscleIds.size !== 1 && isolationOnly) {
      setIsolationOnly(false);
    }
  }, [isolationOnly, selectedMuscleIds, setIsolationOnly]);

  useEffect(() => {
    if (selectedMuscleIds.size <= 1 && allSelectedMusclesOnly) {
      setAllSelectedMusclesOnly(false);
    }
  }, [allSelectedMusclesOnly, selectedMuscleIds, setAllSelectedMusclesOnly]);

  const toggleMuscle = (muscleId: string) => {
    setSelectedMuscleIds((current) => {
      const next = new Set(current);
      if (next.has(muscleId)) {
        next.delete(muscleId);
      } else {
        next.add(muscleId);
      }
      return next;
    });
  };

  const toggleMuscleGroup = (muscleIds: string[]) => {
    if (muscleIds.length === 0) {
      return;
    }

    setSelectedMuscleIds((current) => {
      const next = new Set(current);
      const allSelected = muscleIds.every((id) => next.has(id));

      muscleIds.forEach((id) => {
        if (allSelected) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });

      return next;
    });
  };

  const showExerciseMuscles = (muscleIds: string[]) => {
    const unique = [...new Set(muscleIds)];
    setSelectedMuscleIds(new Set(unique));
  };

  const resetMultiExerciseSelection = () => {
    setMultiExerciseSelection(false);
    setSelectedExerciseIds(new Set());
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExerciseIds((current) => {
      const next = new Set(current);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });

    setSelectedExerciseId(exerciseId);
  };

  const toggleExerciseStar = (exerciseId: string) => {
    setStarredExerciseIds((current) => {
      const next = new Set(current);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!multiExerciseSelection && selectedExerciseIds.size > 0) {
      setSelectedExerciseIds(new Set());
    }
  }, [multiExerciseSelection, selectedExerciseIds]);

  const exercisesForList = useMemo(() => {
    if (!multiExerciseSelection || selectedExerciseIds.size === 0) {
      return visibleExercises;
    }

    const merged = new Map(visibleExercises.map((exercise) => [exercise.id, exercise]));

    exerciseCatalog
      .filter((exercise) => selectedExerciseIds.has(exercise.id))
      .forEach((exercise) => merged.set(exercise.id, exercise));

    return [...merged.values()];
  }, [multiExerciseSelection, selectedExerciseIds, visibleExercises]);

  const multiSelectedMuscleIds = useMemo(() => {
    if (!multiExerciseSelection || selectedExerciseIds.size === 0) {
      return new Set<string>();
    }

    const ids = new Set<string>();
    exerciseCatalog
      .filter((exercise) => selectedExerciseIds.has(exercise.id))
      .forEach((exercise) => {
        [...exercise.primaryMuscles, ...exercise.secondaryMuscles].forEach((muscleId) => ids.add(muscleId));
      });

    return ids;
  }, [multiExerciseSelection, selectedExerciseIds]);

  return (
    <Box sx={{ minHeight: '100dvh', py: { xs: 2, md: 3 }, background: 'linear-gradient(180deg, #eaf3f5 0%, #f7fafc 35%, #f4f7f9 100%)' }}>
      <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 3 } }}>
        <Stack spacing={2.5} sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <FitnessCenterIcon />
              </Box>
              <Box>
                <Typography variant="h4">Атлас упражнений</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  pl: 0.5,
                  cursor: selectedMuscleIds.size === 1 ? 'pointer' : 'default',
                }}
              >
                <Checkbox
                  checked={isolationOnly}
                  disabled={selectedMuscleIds.size !== 1}
                  onChange={(event) => setIsolationOnly(event.target.checked)}
                />
                <Typography color={selectedMuscleIds.size !== 1 ? 'text.disabled' : 'text.primary'}>
                  Только изолирующие упражнения
                </Typography>
              </Box>

              <Box
                component="label"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  pl: 0.5,
                  cursor: selectedMuscleIds.size > 1 ? 'pointer' : 'default',
                }}
              >
                <Checkbox
                  checked={allSelectedMusclesOnly}
                  disabled={selectedMuscleIds.size <= 1}
                  onChange={(event) => setAllSelectedMusclesOnly(event.target.checked)}
                />
                <Typography color={selectedMuscleIds.size <= 1 ? 'text.disabled' : 'text.primary'}>
                  Только упражнения со всеми выбранными мышцами
                </Typography>
              </Box>

              <Box component="label" sx={{ display: 'flex', alignItems: 'center', mr: 1, pl: 0.5, cursor: 'pointer' }}>
                <Checkbox checked={multiExerciseSelection} onChange={(event) => setMultiExerciseSelection(event.target.checked)} />
                <Typography>Множественный выбор упражнений</Typography>
              </Box>

              <Button variant="outlined" onClick={() => setShowHelp((current) => !current)} sx={{ minWidth: 40, px: 1.25 }}>
                ?
              </Button>

              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  setSelectedMuscleIds(new Set());
                  setMuscleSearch('');
                  setExerciseSearch('');
                  setIsolationOnly(false);
                  setAllSelectedMusclesOnly(false);
                  resetMultiExerciseSelection();
                }}
              >
                Сбросить фильтры
              </Button>
            </Stack>
          </Stack>

          <Collapse in={showHelp}>
            <Typography variant="body1" color="text.secondary" maxWidth={920}>
              Выберите мышцы слева или на силуэте, чтобы увидеть только подходящие упражнения. Описание выбранного упражнения показывается ниже списка.
            </Typography>
          </Collapse>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(0, 1.2fr) minmax(0, 1.1fr)' },
            alignItems: 'stretch',
            minHeight: { xs: 'auto', xl: 'calc(100dvh - 178px)' },
            height: { xs: 'auto', xl: 'calc(100dvh - 178px)' },
          }}
        >
          <Box sx={{ minHeight: 0 }}>
            <MuscleList
              muscles={filteredMuscles}
              selectedMuscleIds={selectedMuscleIds}
              search={muscleSearch}
              onSearchChange={setMuscleSearch}
              onToggleMuscle={toggleMuscle}
            />
          </Box>

          <Box sx={{ minHeight: 0 }}>
            <BodyDiagram
              muscles={muscles}
              selectedMuscleIds={selectedMuscleIds}
              extraHighlightedMuscleIds={multiSelectedMuscleIds}
              onToggleMuscles={toggleMuscleGroup}
            />
          </Box>

          <Box sx={{ minHeight: 0 }}>
            <ExerciseList
              exercises={exercisesForList}
              muscles={muscles}
              selectedMuscleIds={selectedMuscleIds}
              selectedExerciseId={selectedExerciseId}
              selectedExerciseIds={selectedExerciseIds}
              multiExerciseSelection={multiExerciseSelection}
              starredExerciseIds={starredExerciseIds}
              search={exerciseSearch}
              onSearchChange={setExerciseSearch}
              onSelectExercise={setSelectedExerciseId}
              onToggleExerciseSelection={toggleExerciseSelection}
              onToggleExerciseStar={toggleExerciseStar}
              onResetMultiExerciseSelection={resetMultiExerciseSelection}
              onShowExerciseMuscles={showExerciseMuscles}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2.5 }}>
          <ExerciseDetails exercise={selectedExercise} muscles={muscles} />
        </Box>
      </Container>
    </Box>
  );
}