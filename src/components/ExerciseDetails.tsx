import { useEffect, useState } from 'react';
import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Exercise, Muscle } from '../data/types';

interface ExerciseDetailsProps {
  exercise: Exercise | null;
  muscles: Muscle[];
  sx?: SxProps<Theme>;
}

export function ExerciseDetails({ exercise, muscles, sx }: ExerciseDetailsProps) {
  if (!exercise) {
    return (
      <Paper elevation={0} sx={[{ p: 2.25, border: 1, borderColor: 'divider', overflow: 'auto' }, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Typography variant="h6" gutterBottom>
          Описание упражнения
        </Typography>
        <Typography color="text.secondary">
          Выберите упражнение из списка, чтобы увидеть технику, описание и целевые мышцы.
        </Typography>
      </Paper>
    );
  }

  const resolvedMuscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles]
    .map((muscleId) => muscles.find((muscle) => muscle.id === muscleId))
    .filter((muscle): muscle is Muscle => Boolean(muscle));

  const [reference, setReference] = useState<{ labelRu: string; url: string }>({
    labelRu: 'Поиск техники в Google',
    url: `https://www.google.com/search?q=${encodeURIComponent(`${exercise.nameRu} техника`)}`,
  });

  useEffect(() => {
    let cancelled = false;

    const fallbackReference = {
      labelRu: 'Поиск техники в Google',
      url: `https://www.google.com/search?q=${encodeURIComponent(`${exercise.nameRu} техника`)}`,
    };

    const resolveReference = async () => {
      try {
        const response = await fetch(
          `https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(exercise.nameRu)}&srlimit=1&format=json&origin=*`,
        );

        if (!response.ok) {
          if (!cancelled) {
            setReference(fallbackReference);
          }
          return;
        }

        const data = (await response.json()) as {
          query?: {
            search?: Array<{ title?: string }>;
          };
        };

        const title = data.query?.search?.[0]?.title;
        if (!title) {
          if (!cancelled) {
            setReference(fallbackReference);
          }
          return;
        }

        if (!cancelled) {
          setReference({
            labelRu: 'Статья в Википедии',
            url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
          });
        }
      } catch {
        if (!cancelled) {
          setReference(fallbackReference);
        }
      }
    };

    void resolveReference();

    return () => {
      cancelled = true;
    };
  }, [exercise.id, exercise.nameRu]);

  return (
    <Paper elevation={0} sx={[{ p: 2.25, border: 1, borderColor: 'divider', overflow: 'auto' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {exercise.nameRu}
          </Typography>
          <Typography color="text.secondary">
            {exercise.categoryRu} · {exercise.equipmentRu} · {exercise.difficultyRu}
          </Typography>
        </Box>

        <Typography>{exercise.descriptionRu}</Typography>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Какие мышцы работают
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resolvedMuscles.map((muscle) => muscle.nameRu).join(', ')}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Ключевые шаги
          </Typography>
          <Stack component="ol" spacing={1} sx={{ pl: 2.5, m: 0 }}>
            {exercise.instructionsRu.map((step) => (
              <Typography key={step} component="li" variant="body2" color="text.secondary">
                {step}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Справка
          </Typography>
          <Link href={reference.url} target="_blank" rel="noreferrer">
            {reference.labelRu}
          </Link>
        </Box>
      </Stack>
    </Paper>
  );
}