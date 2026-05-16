import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Exercise, Muscle } from '../data/types';

interface ExerciseListProps {
  exercises: Exercise[];
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  selectedExerciseId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectExercise: (exerciseId: string) => void;
}

export function ExerciseList({
  exercises,
  muscles,
  selectedMuscleIds,
  selectedExerciseId,
  search,
  onSearchChange,
  onSelectExercise,
}: ExerciseListProps) {
  const visibleMuscles = muscles.filter((muscle) => selectedMuscleIds.has(muscle.id));

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2}>
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

        <Divider />

        <Box sx={{ maxHeight: { xs: 380, lg: 'calc(100vh - 260px)' }, overflow: 'auto', pr: 0.5 }}>
          {exercises.length === 0 ? (
            <Typography color="text.secondary">Ничего не найдено. Попробуйте другой запрос или снимите фильтр мышц.</Typography>
          ) : (
            <List disablePadding>
              {exercises.map((exercise) => {
                const selected = selectedExerciseId === exercise.id;
                return (
                  <ListItemButton
                    key={exercise.id}
                    onClick={() => onSelectExercise(exercise.id)}
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
                            {exercise.categoryRu} · {exercise.equipmentRu} · {exercise.difficultyRu}
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