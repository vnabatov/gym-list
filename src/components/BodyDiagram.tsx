import { useState } from 'react';
import Body, { type ExtendedBodyPart, type Slug } from 'react-muscle-highlighter';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import type { Muscle, MuscleView } from '../data/types';

interface BodyDiagramProps {
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  view: MuscleView;
  onViewChange: (view: MuscleView) => void;
  onToggleMuscles: (muscleIds: string[]) => void;
}

const frontSlugToMuscleIds: Partial<Record<Slug, string[]>> = {
  neck: ['neck'],
  trapezius: ['traps'],
  chest: ['chest'],
  deltoids: ['shoulders_front'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  forearm: ['forearms'],
  abs: ['abs'],
  obliques: ['obliques'],
  quadriceps: ['quads'],
  adductors: ['adductors'],
  calves: ['calves'],
};

const backSlugToMuscleIds: Partial<Record<Slug, string[]>> = {
  trapezius: ['traps'],
  deltoids: ['shoulders_back'],
  triceps: ['triceps'],
  'upper-back': ['upper_back', 'lats'],
  'lower-back': ['lower_back'],
  gluteal: ['glutes'],
  hamstring: ['hamstrings'],
  calves: ['calves'],
};

const muscleIdToSlug = new Map<string, Slug>([
  ['neck', 'neck'],
  ['traps', 'trapezius'],
  ['shoulders_front', 'deltoids'],
  ['shoulders_back', 'deltoids'],
  ['chest', 'chest'],
  ['lats', 'upper-back'],
  ['upper_back', 'upper-back'],
  ['triceps', 'triceps'],
  ['biceps', 'biceps'],
  ['forearms', 'forearm'],
  ['abs', 'abs'],
  ['obliques', 'obliques'],
  ['lower_back', 'lower-back'],
  ['glutes', 'gluteal'],
  ['quads', 'quadriceps'],
  ['adductors', 'adductors'],
  ['hamstrings', 'hamstring'],
  ['calves', 'calves'],
]);

export function BodyDiagram({ muscles, selectedMuscleIds, view, onViewChange, onToggleMuscles }: BodyDiagramProps) {
  const activeMap = view === 'front' ? frontSlugToMuscleIds : backSlugToMuscleIds;
  const [hoveredSlug, setHoveredSlug] = useState<Slug | null>(null);

  const muscleById = new Map(muscles.map((muscle) => [muscle.id, muscle]));

  const highlightedBySlug = new Map<Slug, ExtendedBodyPart>();

  selectedMuscleIds.forEach((muscleId) => {
    const slug = muscleIdToSlug.get(muscleId);
    const muscle = muscleById.get(muscleId);

    if (!slug || !muscle) {
      return;
    }

    if (!activeMap[slug]) {
      return;
    }

    if (!highlightedBySlug.has(slug)) {
      highlightedBySlug.set(slug, {
        slug,
        color: muscle.color,
        styles: {
          stroke: muscle.color,
          strokeWidth: 2,
        },
      });
    }
  });

  if (hoveredSlug && activeMap[hoveredSlug] && !highlightedBySlug.has(hoveredSlug)) {
    const hoverMuscleId = activeMap[hoveredSlug]?.[0];
    const hoverMuscle = hoverMuscleId ? muscleById.get(hoverMuscleId) : undefined;

    highlightedBySlug.set(hoveredSlug, {
      slug: hoveredSlug,
      color: hoverMuscle?.color ?? '#60a5fa',
      styles: {
        stroke: hoverMuscle?.color ?? '#3b82f6',
        strokeWidth: 2,
      },
    });
  }

  const bodyData = [...highlightedBySlug.values()];

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2} alignItems="center" sx={{ height: '100%', minHeight: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Тело
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Используется стандартная библиотека тела. Нажмите на область мышцы для фильтрации.
          </Typography>
        </Box>

        <Tabs
          value={view}
          onChange={(_, nextValue: MuscleView) => onViewChange(nextValue)}
          variant="fullWidth"
          sx={{ width: '100%' }}
        >
          <Tab value="front" label="Спереди" />
          <Tab value="back" label="Сзади" />
        </Tabs>

        <Box
          sx={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            borderRadius: 4,
            overflow: 'auto',
            background: 'linear-gradient(180deg, #f8fbfc 0%, #edf4f7 100%)',
            p: 1.5,
            display: 'grid',
            placeItems: 'center',
            '& svg path[id]': {
              transition: 'opacity 120ms ease, filter 120ms ease',
            },
            '& svg path[id]:hover': {
              opacity: 0.82,
              filter: 'brightness(1.08)',
            },
          }}
          onMouseOver={(event) => {
            const element = event.target as HTMLElement;
            const path = element.closest('path[id]') as SVGPathElement | null;

            if (!path) {
              return;
            }

            const slug = path.id as Slug;
            if (!activeMap[slug] || activeMap[slug]!.length === 0) {
              setHoveredSlug(null);
              return;
            }

            setHoveredSlug(slug);
          }}
          onMouseLeave={() => setHoveredSlug(null)}
        >
          <Body
            data={bodyData}
            side={view}
            gender="male"
            scale={1.08}
            border="none"
            defaultFill="#dae4ea"
            defaultStroke="#c5d0d8"
            defaultStrokeWidth={1}
            onBodyPartPress={(part) => {
              const muscleIds = activeMap[part.slug as Slug] ?? [];
              onToggleMuscles(muscleIds);
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
