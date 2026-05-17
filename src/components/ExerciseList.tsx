import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { alpha } from '@mui/material/styles';
import type { Exercise, Muscle } from '../data/types';

interface ExerciseListProps {
  exercises: Exercise[];
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  selectedExerciseId: string | null;
  selectedExerciseIds: Set<string>;
  multiExerciseSelection: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectExercise: (exerciseId: string) => void;
  onToggleExerciseSelection: (exerciseId: string) => void;
  onResetMultiExerciseSelection: () => void;
  onShowExerciseMuscles: (muscleIds: string[]) => void;
}

export function ExerciseList({
  exercises,
  muscles,
  selectedMuscleIds,
  selectedExerciseId,
  selectedExerciseIds,
  multiExerciseSelection,
  search,
  onSearchChange,
  onSelectExercise,
  onToggleExerciseSelection,
  onResetMultiExerciseSelection,
  onShowExerciseMuscles,
}: ExerciseListProps) {
  const visibleMuscles = muscles.filter((muscle) => selectedMuscleIds.has(muscle.id));
  const multiSelectedExercises = exercises.filter((exercise) => selectedExerciseIds.has(exercise.id));

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Упражнения
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Поиск по названию, снаряду, уровню и описанию. При выборе мышц список сужается автоматически.
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Поиск упражнений"
          placeholder="Например: присед, тяга, пресс"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" aria-label="Очистить поиск упражнений" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />

        {visibleMuscles.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {visibleMuscles.map((muscle) => (
              <Chip
                key={muscle.id}
                label={muscle.nameRu}
                size="small"
                sx={{ bgcolor: alpha(muscle.color, 0.16), fontWeight: 700 }}
              />
            ))}
          </Box>
        )}

        {multiExerciseSelection && multiSelectedExercises.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              Выбрано по множественному выбору:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {multiSelectedExercises.map((exercise) => (
                <Chip key={exercise.id} label={exercise.nameRu} size="small" sx={{ bgcolor: alpha('#8b5cf6', 0.16), fontWeight: 700 }} />
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        <Box sx={{ flex: 1, minHeight: { xs: 260, xl: 0 }, overflowY: 'scroll', scrollbarGutter: 'stable', pr: 0.5 }}>
          {exercises.length === 0 ? (
            <Typography color="text.secondary">Ничего не найдено. Попробуйте другой запрос или снимите фильтр мышц.</Typography>
          ) : (
            <List disablePadding>
              {exercises.map((exercise) => {
                const selected = multiExerciseSelection ? selectedExerciseIds.has(exercise.id) : selectedExerciseId === exercise.id;
                return (
                  <ListItemButton
                    key={exercise.id}
                    onClick={() => {
                      if (multiExerciseSelection) {
                        onToggleExerciseSelection(exercise.id);
                        return;
                      }

                      onSelectExercise(exercise.id);
                    }}
                    onDoubleClick={() => {
                      if (multiExerciseSelection) {
                        onResetMultiExerciseSelection();
                        return;
                      }

                      onShowExerciseMuscles([...exercise.primaryMuscles, ...exercise.secondaryMuscles]);
                    }}
                    selected={selected}
                    sx={{
                      mb: 0.75,
                      borderRadius: 2,
                      border: 1,
                      borderColor: selected ? 'primary.main' : 'divider',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={exercise.nameRu}
                      secondary={
                        <Stack spacing={0.75} sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.categoryRu}{exercise.isIsolation ? ' (изоляция)' : ''} · {exercise.equipmentRu} · {exercise.difficultyRu}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.descriptionRu}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {[...exercise.primaryMuscles, ...exercise.secondaryMuscles]
                              .map((muscleId) => muscles.find((muscle) => muscle.id === muscleId))
                              .filter(Boolean)
                              .map((muscle) => (
                                <Chip key={muscle!.id} size="small" label={muscle!.nameRu} sx={{ bgcolor: alpha(muscle!.color, 0.12) }} />
                              ))}
                          </Box>
                        </Stack>
                      }
                      primaryTypographyProps={{ fontWeight: 800 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}