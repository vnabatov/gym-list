import { useState } from 'react';
import Body, { type ExtendedBodyPart, type Slug } from 'react-muscle-highlighter';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { Muscle } from '../data/types';

interface BodyDiagramProps {
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  extraHighlightedMuscleIds?: Set<string>;
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

export function BodyDiagram({ muscles, selectedMuscleIds, extraHighlightedMuscleIds, onToggleMuscles }: BodyDiagramProps) {
  const [hoveredFrontSlug, setHoveredFrontSlug] = useState<Slug | null>(null);
  const [hoveredBackSlug, setHoveredBackSlug] = useState<Slug | null>(null);

  const muscleById = new Map(muscles.map((muscle) => [muscle.id, muscle]));

  const buildBodyData = (activeMap: Partial<Record<Slug, string[]>>, hoveredSlug: Slug | null) => {
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

    extraHighlightedMuscleIds?.forEach((muscleId) => {
      if (selectedMuscleIds.has(muscleId)) {
        return;
      }

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
          color: '#8b5cf6',
          styles: {
            stroke: '#6d28d9',
            strokeWidth: 3,
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

    return [...highlightedBySlug.values()];
  };

  const frontBodyData = buildBodyData(frontSlugToMuscleIds, hoveredFrontSlug);
  const backBodyData = buildBodyData(backSlugToMuscleIds, hoveredBackSlug);

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2} alignItems="center" sx={{ height: '100%', minHeight: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Тело
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          <Box
            sx={{
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
              if (!frontSlugToMuscleIds[slug] || frontSlugToMuscleIds[slug]!.length === 0) {
                setHoveredFrontSlug(null);
                return;
              }

              setHoveredFrontSlug(slug);
            }}
            onMouseLeave={() => setHoveredFrontSlug(null)}
          >
            <Body
              data={frontBodyData}
              side="front"
              gender="male"
              scale={1.08}
              border="none"
              defaultFill="#dae4ea"
              defaultStroke="#c5d0d8"
              defaultStrokeWidth={1}
              onBodyPartPress={(part) => {
                const muscleIds = frontSlugToMuscleIds[part.slug as Slug] ?? [];
                onToggleMuscles(muscleIds);
              }}
            />
          </Box>

          <Box
            sx={{
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
              if (!backSlugToMuscleIds[slug] || backSlugToMuscleIds[slug]!.length === 0) {
                setHoveredBackSlug(null);
                return;
              }

              setHoveredBackSlug(slug);
            }}
            onMouseLeave={() => setHoveredBackSlug(null)}
          >
            <Body
              data={backBodyData}
              side="back"
              gender="male"
              scale={1.08}
              border="none"
              defaultFill="#dae4ea"
              defaultStroke="#c5d0d8"
              defaultStrokeWidth={1}
              onBodyPartPress={(part) => {
                const muscleIds = backSlugToMuscleIds[part.slug as Slug] ?? [];
                onToggleMuscles(muscleIds);
              }}
            />
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
