import type { ResourceKind } from "./types";

export const categoriesByKind: Record<ResourceKind, string[]> = {
  notes: ["Unit-wise notes", "Short notes", "Detailed notes", "Handwritten notes", "Important questions"],
  video: ["Topic lesson", "Exam revision"],
  pyq: ["Question paper", "Solved paper", "Unit-wise questions", "Important questions"],
};

export const kindLabel: Record<ResourceKind, string> = {
  notes: "Notes",
  video: "Video",
  pyq: "PYQ",
};
