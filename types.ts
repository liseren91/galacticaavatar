export interface ProcessedItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  resultUrl?: string;
  errorMsg?: string;
  characterRole?: string; // e.g. Jedi, Sith, Mandalorian
}

export enum CharacterRole {
  JEDI = 'Jedi Knight',
  SITH = 'Sith Lord',
  PILOT = 'X-Wing Pilot',
  MANDALORIAN = 'Mandalorian Bounty Hunter',
  STORMTROOPER = 'Stormtrooper Commander'
}
