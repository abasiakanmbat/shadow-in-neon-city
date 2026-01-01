
export interface Stats {
  logic: number;
  intuition: number;
  charisma: number;
  reputation: number;
}

export interface Choice {
  text: string;
  next: string;
  effect?: Partial<Stats>;
  requirement?: {
    stat: keyof Stats;
    value: number;
  };
}

export interface Scene {
  id: string;
  narration: string;
  imageUrl?: string;
  choices: Choice[];
  checkpoint?: boolean;
}

export interface GameState {
  currentSceneId: string;
  stats: Stats;
  history: string[];
  lastCheckpointId: string;
}
