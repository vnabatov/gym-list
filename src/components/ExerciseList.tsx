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
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { alpha } from '@mui/material/styles';
import type { Exercise, Muscle } from '../data/types';

interface ExerciseListProps {
  exercises: Exercise[];
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  selectedExerciseId: string | null;
  selectedExerciseIds: Set<string>;
  multiExerciseSelection: boolean;
  starredExerciseIds: Set<string>;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectExercise: (exerciseId: string) => void;
  onToggleExerciseSelection: (exerciseId: string) => void;
  onToggleExerciseStar: (exerciseId: string) => void;
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
  starredExerciseIds,
  search,
  onSearchChange,
  onSelectExercise,
  onToggleExerciseSelection,
  onToggleExerciseStar,
  onResetMultiExerciseSelection,
  onShowExerciseMuscles,
}: ExerciseListProps) {
  const visibleMuscles = muscles.filter((muscle) => selectedMuscleIds.has(muscle.id));
  const multiSelectedExercises = exercises.filter((exercise) => selectedExerciseIds.has(exercise.id));
  const baseOrder = new Map(exercises.map((exercise, index) => [exercise.id, index]));
  const orderedExercises = [...exercises].sort((left, right) => {
    const leftStarred = starredExerciseIds.has(left.id) ? 1 : 0;
    const rightStarred = starredExerciseIds.has(right.id) ? 1 : 0;

    if (leftStarred !== rightStarred) {
      return rightStarred - leftStarred;
    }

    return (baseOrder.get(left.id) ?? 0) - (baseOrder.get(right.id) ?? 0);
  });

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
              {orderedExercises.map((exercise) => {
                const selected = multiExerciseSelection ? selectedExerciseIds.has(exercise.id) : selectedExerciseId === exercise.id;
                const starred = starredExerciseIds.has(exercise.id);
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
                      pl: 1.25,
                      borderRadius: 2,
                      border: 1,
                      borderColor: selected ? 'primary.main' : 'divider',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            aria-label={starred ? 'Убрать из избранного' : 'Добавить в избранное'}
                            onClick={(event) => {
                              event.stopPropagation();
                              onToggleExerciseStar(exercise.id);
                            }}
                            sx={{ ml: -0.5 }}
                          >
                            {starred ? <StarIcon fontSize="small" color="warning" /> : <StarBorderIcon fontSize="small" color="disabled" />}
                          </IconButton>
                          <Box component="span">{exercise.nameRu}</Box>
                        </Box>
                      }
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