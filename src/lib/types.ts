export type ResourceKind = "notes" | "video" | "pyq";

export interface Course {
  slug: string;
  name: string;
  fullName: string;
  description: string;
}

export interface University {
  slug: string;
  courseSlug: string;
  name: string;
  shortName: string;
}

export interface SubjectCounts {
  notes: number;
  videos: number;
  pyqs: number;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  semester: number;
  courseSlug: string;
  universitySlug: string;
  description: string;
  /** true only for demo data shown when Supabase is not connected */
  isSample: boolean;
  counts: SubjectCounts;
  downloads: number;
}

export interface Resource {
  id: string;
  subjectId: string;
  kind: ResourceKind;
  category: string;
  title: string;
  description: string;
  unit?: number;
  year?: number;
  pages?: number;
  youtubeUrl?: string;
  downloads: number;
  addedAt: string;
  hue: number;
  isSample: boolean;
}

export interface ResourceWithSubject extends Resource {
  subject: Subject;
  href: string;
}
