
export interface AudioFile {
  id: string;
  name: string;
  duration: string;
  durationInSeconds: number;
  size: string;
  lastModified: number;
  isDuplicate?: boolean;
}

export type SortOption = 'date-desc' | 'date-asc' | 'alpha-asc';
