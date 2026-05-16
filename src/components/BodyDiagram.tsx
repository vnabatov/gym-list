import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Muscle, MuscleView } from '../data/types';

interface BodyDiagramProps {
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  view: MuscleView;
  onViewChange: (view: MuscleView) => void;
  onToggleMuscle: (muscleId: string) => void;
}

type RegionShape =
  | { id: string; type: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { id: string; type: 'circle'; cx: number; cy: number; r: number }
  | { id: string; type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { id: string; type: 'polygon'; points: string };

const figureFill = '#dbe4ea';

const frontRegions: RegionShape[] = [
  { id: 'neck', type: 'ellipse', cx: 100, cy: 36, rx: 10, ry: 12 },
  { id: 'shoulders_front', type: 'ellipse', cx: 100, cy: 78, rx: 54, ry: 24 },
  { id: 'chest', type: 'rect', x: 68, y: 80, width: 64, height: 58, rx: 18 },
  { id: 'biceps', type: 'rect', x: 34, y: 90, width: 26, height: 72, rx: 13 },
  { id: 'forearms', type: 'rect', x: 24, y: 164, width: 24, height: 66, rx: 12 },
  { id: 'abs', type: 'rect', x: 76, y: 140, width: 48, height: 72, rx: 16 },
  { id: 'obliques', type: 'polygon', points: '64,150 74,140 74,208 54,208 50,172' },
  { id: 'quads', type: 'rect', x: 72, y: 214, width: 28, height: 88, rx: 12 },
  { id: 'quads', type: 'rect', x: 100, y: 214, width: 28, height: 88, rx: 12 },
  { id: 'adductors', type: 'polygon', points: '82,216 98,216 94,286 78,286' },
  { id: 'calves', type: 'rect', x: 72, y: 304, width: 26, height: 70, rx: 12 },
  { id: 'calves', type: 'rect', x: 102, y: 304, width: 26, height: 70, rx: 12 },
];

const backRegions: RegionShape[] = [
  { id: 'traps', type: 'ellipse', cx: 100, cy: 74, rx: 54, ry: 22 },
  { id: 'shoulders_back', type: 'ellipse', cx: 100, cy: 82, rx: 58, ry: 22 },
  { id: 'upper_back', type: 'rect', x: 68, y: 82, width: 64, height: 48, rx: 18 },
  { id: 'lats', type: 'polygon', points: '56,96 70,88 70,168 52,164 46,120' },
  { id: 'lats', type: 'polygon', points: '144,96 130,88 130,168 148,164 154,120' },
  { id: 'triceps', type: 'rect', x: 30, y: 100, width: 28, height: 74, rx: 14 },
  { id: 'triceps', type: 'rect', x: 142, y: 100, width: 28, height: 74, rx: 14 },
  { id: 'lower_back', type: 'rect', x: 78, y: 140, width: 44, height: 72, rx: 16 },
  { id: 'glutes', type: 'rect', x: 72, y: 212, width: 60, height: 58, rx: 18 },
  { id: 'hamstrings', type: 'rect', x: 76, y: 268, width: 24, height: 88, rx: 12 },
  { id: 'hamstrings', type: 'rect', x: 100, y: 268, width: 24, height: 88, rx: 12 },
  { id: 'rear_calves', type: 'rect', x: 74, y: 356, width: 22, height: 48, rx: 10 },
  { id: 'rear_calves', type: 'rect', x: 104, y: 356, width: 22, height: 48, rx: 10 },
];

const regionToMuscle = (id: string, muscles: Muscle[], view: MuscleView) => muscles.find((muscle) => muscle.id === id && muscle.view === view);

function Region({ region, muscle, selected, onToggle }: { region: RegionShape; muscle?: Muscle; selected: boolean; onToggle: () => void }) {
  const fill = muscle ? (selected ? muscle.color : alpha(muscle.color, 0.18)) : alpha('#94a3b8', 0.16);
  const stroke = muscle ? (selected ? muscle.color : alpha(muscle.color, 0.45)) : alpha('#64748b', 0.28);
  const commonProps = {
    onClick: onToggle,
    role: 'button',
    tabIndex: 0,
    cursor: 'pointer',
    onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle();
      }
    },
  };

  if (region.type === 'rect') {
    return <rect {...commonProps} x={region.x} y={region.y} width={region.width} height={region.height} rx={region.rx ?? 0} fill={fill} stroke={stroke} strokeWidth={2} />;
  }

  if (region.type === 'circle') {
    return <circle {...commonProps} cx={region.cx} cy={region.cy} r={region.r} fill={fill} stroke={stroke} strokeWidth={2} />;
  }

  if (region.type === 'ellipse') {
    return <ellipse {...commonProps} cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} fill={fill} stroke={stroke} strokeWidth={2} />;
  }

  return <polygon {...commonProps} points={region.points} fill={fill} stroke={stroke} strokeWidth={2} />;
}

export function BodyDiagram({ muscles, selectedMuscleIds, view, onViewChange, onToggleMuscle }: BodyDiagramProps) {
  const regions = view === 'front' ? frontRegions : backRegions;
  const title = view === 'front' ? 'Передняя поверхность' : 'Задняя поверхность';

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            Тело
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Нажмите на мышцу на силуэте или выберите её слева.
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

        <Box sx={{ width: '100%', borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(180deg, #f8fbfc 0%, #edf4f7 100%)', p: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
            {title}
          </Typography>

          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <Box component="svg" viewBox="0 0 200 420" sx={{ width: '100%', height: 'auto', display: 'block' }} aria-label={`Силуэт человека ${title.toLowerCase()}`}>
              <circle cx="100" cy="28" r="20" fill={figureFill} />
              <rect x="77" y="48" width="46" height="122" rx="22" fill={figureFill} />
              <rect x="42" y="68" width="24" height="108" rx="12" fill={figureFill} />
              <rect x="134" y="68" width="24" height="108" rx="12" fill={figureFill} />
              <rect x="80" y="164" width="20" height="118" rx="10" fill={figureFill} />
              <rect x="100" y="164" width="20" height="118" rx="10" fill={figureFill} />
              <rect x="73" y="278" width="24" height="104" rx="11" fill={figureFill} />
              <rect x="103" y="278" width="24" height="104" rx="11" fill={figureFill} />

              {regions.map((region, index) => {
                const muscle = regionToMuscle(region.id, muscles, view);
                return (
                  <g key={`${region.id}-${index}`}>
                    <Region
                      region={region}
                      muscle={muscle}
                      selected={Boolean(muscle && selectedMuscleIds.has(muscle.id))}
                      onToggle={() => muscle && onToggleMuscle(muscle.id)}
                    />
                  </g>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}