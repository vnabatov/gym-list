import type { Dispatch, SetStateAction } from 'react';
import {
  Box,
  Checkbox,
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
  Tooltip,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { alpha } from '@mui/material/styles';
import type { Muscle } from '../data/types';

interface MuscleListProps {
  muscles: Muscle[];
  selectedMuscleIds: Set<string>;
  search: string;
  onSearchChange: Dispatch<SetStateAction<string>>;
  onToggleMuscle: (muscleId: string) => void;
}

export function MuscleList({ muscles, selectedMuscleIds, search, onSearchChange, onToggleMuscle }: MuscleListProps) {
  const grouped = muscles.reduce<Record<string, Muscle[]>>((accumulator, muscle) => {
    const key = muscle.groupRu;
    accumulator[key] ??= [];
    accumulator[key].push(muscle);
    return accumulator;
  }, {});

  return (
    <Paper elevation={0} sx={{ p: 2.25, border: 1, borderColor: 'divider', height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Мышцы
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Выбирайте несколько мышц сразу. Карточки и силуэт синхронизируются.
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Поиск мышц"
          placeholder="Например: грудь, пресс, спина"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" aria-label="Очистить поиск мышц" onClick={() => onSearchChange('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedMuscleIds.size > 0 ? (
            [...selectedMuscleIds].map((muscleId) => {
              const muscle = muscles.find((item) => item.id === muscleId);
              if (!muscle) {
                return null;
              }

              return (
                <Chip
                  key={muscle.id}
                  label={muscle.nameRu}
                  onDelete={() => onToggleMuscle(muscle.id)}
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 700 }}
                />
              );
            })
          ) : (
            <Typography variant="caption" color="text.secondary">
              Ничего не выбрано
            </Typography>
          )}
        </Box>

        <Divider />

        <Box sx={{ flex: 1, minHeight: { xs: 260, xl: 0 }, overflowY: 'scroll', scrollbarGutter: 'stable', pr: 0.5 }}>
          {Object.entries(grouped).map(([groupName, items]) => (
            <Box key={groupName} sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                {groupName}
              </Typography>

              <List disablePadding>
                {items.map((muscle) => {
                  const selected = selectedMuscleIds.has(muscle.id);

                  return (
                    <ListItemButton
                      key={muscle.id}
                      onClick={() => onToggleMuscle(muscle.id)}
                      selected={selected}
                      sx={{
                        mb: 0.75,
                        borderRadius: 2,
                        border: 1,
                        borderColor: selected ? muscle.color : 'divider',
                        backgroundColor: selected ? alpha(muscle.color, 0.12) : 'transparent',
                        '& .muscle-help': {
                          opacity: 0,
                          pointerEvents: 'none',
                          transition: 'opacity 140ms ease',
                        },
                        '&:hover .muscle-help': {
                          opacity: 1,
                          pointerEvents: 'auto',
                        },
                      }}
                    >
                      <Checkbox edge="start" checked={selected} tabIndex={-1} disableRipple />
                      <ListItemText
                        primary={muscle.nameRu}
                        primaryTypographyProps={{ fontWeight: 700 }}
                      />
                      <Tooltip
                        title={muscle.descriptionRu}
                        placement="right"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: 'offset',
                                options: {
                                  offset: [0, 0],
                                },
                              },
                            ],
                          },
                          tooltip: {
                            sx: {
                              bgcolor: '#f8fbfc',
                              color: '#1f2937',
                              fontSize: 13,
                              lineHeight: 1.4,
                              borderRadius: 1.5,
                              px: 2.5,
                              py: 0.9,
                              border: '1px solid',
                              borderColor: 'divider',
                              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                            },
                          },
                        }}
                      >
                        <IconButton
                          size="small"
                          className="muscle-help"
                          aria-label={`Описание мышцы ${muscle.nameRu}`}
                          onClick={(event) => event.stopPropagation()}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            color: 'text.secondary',
                            width: 22,
                            height: 22,
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          ?
                        </IconButton>
                      </Tooltip>
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}