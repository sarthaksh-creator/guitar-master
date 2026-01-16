const A4 = 440;
const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Standard Guitar Tuning Frequencies
export const GUITAR_STRINGS = [
  { note: "E", notation: "E2", frequency: 82.41 },
  { note: "A", notation: "A2", frequency: 110.00 },
  { note: "D", notation: "D3", frequency: 146.83 },
  { note: "G", notation: "G3", frequency: 196.00 },
  { note: "B", notation: "B3", frequency: 246.94 },
  { note: "e", notation: "E4", frequency: 329.63 },
];

// 1. Get Nearest Note (Auto Mode)
export function getNote(frequency) {
  if (!frequency) return null;
  const noteNum = 12 * (Math.log(frequency / A4) / Math.log(2));
  const midi = Math.round(noteNum) + 69;
  return SEMITONES[midi % 12];
}

// 2. Get Cents relative to NEAREST note (Auto Mode)
export function getCents(frequency, targetNote) {
  if (!frequency) return 0;
  const noteNum = 12 * (Math.log(frequency / A4) / Math.log(2));
  const nearestNoteNum = Math.round(noteNum);
  return Math.floor((noteNum - nearestNoteNum) * 100);
}

// 3. NEW: Get Cents relative to a SPECIFIC target (Manual Mode)
export function getCentsFromTarget(frequency, targetFreq) {
  if (!frequency || !targetFreq) return 0;
  // Calculate cents difference: 1200 * log2(f1 / f2)
  const cents = 1200 * Math.log2(frequency / targetFreq);
  return Math.floor(cents);
}