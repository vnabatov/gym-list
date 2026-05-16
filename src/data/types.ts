export type MuscleView = 'front' | 'back';

export interface Muscle {
  id: string;
  nameRu: string;
  aliases: string[];
  groupRu: string;
  view: MuscleView;
  color: string;
  descriptionRu: string;
}

export interface Exercise {
  id: string;
  nameRu: string;
  aliases: string[];
  categoryRu: string;
  equipmentRu: string;
  difficultyRu: string;
  descriptionRu: string;
  instructionsRu: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  reference?: {
    labelRu: string;
    url: string;
  };
}