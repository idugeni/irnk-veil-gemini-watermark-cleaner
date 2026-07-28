export interface Settings {
  enabled: boolean;
  alphaThreshold: number;
  maxAlpha: number;
  debug: boolean;
}

export interface LastImageStats {
  size: number | null;
  source: string;
  alphaGain: number;
  decisionTier: string | null;
}

export interface Stats {
  total_images: number;
  last_processed: number;
  last_image_stats: LastImageStats | null;
}

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}
