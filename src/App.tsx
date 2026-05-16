import { useEffect } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { muscles } from './data/muscles';
import { BodyDiagram } from './components/BodyDiagram';
import { ExerciseDetails } from './components/ExerciseDetails';
import { ExerciseList } from './components/ExerciseList';
import { MuscleList } from './components/MuscleList';
import { useCatalogFilters } from './hooks/useCatalogFilters';

export default function App() {
  const {
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
  } = useCatalogFilters();

  useEffect(() => {
    if (visibleExercises.length === 0) {
      setSelectedExerciseId(null);
      return;
    }

    if (!selectedExerciseId || !visibleExercises.some((exercise) => exercise.id === selectedExerciseId)) {
      setSelectedExerciseId(visibleExercises[0].id);
    }
  }, [selectedExerciseId, setSelectedExerciseId, visibleExercises]);

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
                <Typography color="text.secondary">
                  Мышцы, силуэт и упражнения синхронизированы на одном экране.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  setSelectedMuscleIds(new Set());
                  setMuscleSearch('');
                  setExerciseSearch('');
                  setIsolationOnly(false);
                }}
              >
                Сбросить фильтры
              </Button>
              <Button variant="contained" onClick={() => setBodyView(bodyView === 'front' ? 'back' : 'front')}>
                Показать {bodyView === 'front' ? 'спину' : 'перед'}
              </Button>
            </Stack>
          </Stack>

          <Typography variant="body1" color="text.secondary" maxWidth={920}>
            Выберите мышцы слева или на силуэте, чтобы увидеть только подходящие упражнения. Описание выбранного упражнения показывается ниже списка.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(0, 1.2fr) minmax(0, 1.1fr)' },
            alignItems: 'stretch',
            height: { xs: 'auto', xl: 'calc(100dvh - 236px)' },
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
              view={bodyView}
              onViewChange={setBodyView}
              onToggleMuscles={toggleMuscleGroup}
            />
          </Box>

          <Box sx={{ minHeight: 0 }}>
            <Stack spacing={2.5} sx={{ height: '100%', minHeight: 0 }}>
              <ExerciseList
                exercises={visibleExercises}
                muscles={muscles}
                selectedMuscleIds={selectedMuscleIds}
                selectedExerciseId={selectedExerciseId}
                search={exerciseSearch}
                isolationOnly={isolationOnly}
                onIsolationOnlyChange={setIsolationOnly}
                onSearchChange={setExerciseSearch}
                onSelectExercise={setSelectedExerciseId}
              />
              <ExerciseDetails exercise={selectedExercise} muscles={muscles} sx={{ flexShrink: 0, maxHeight: { xs: 320, xl: '40%' } }} />
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}