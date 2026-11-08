import type { Course, Resource, Subject, University } from "./types";
import { hashString, slugify } from "./utils";

/**
 * DEMO DATA: only shown when Supabase is NOT connected yet.
 * Once NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
 * the site reads real data from the database and this file is not used.
 * Subject names here are generic samples, NOT the official SGBAU syllabus.
 */

export const courses: Course[] = [
  {
    slug: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    description: "Semester-wise notes, videos and previous year questions for BCA students.",
  },
];

export const universities: University[] = [
  { slug: "sgbau", courseSlug: "bca", name: "Sant Gadge Baba Amravati University", shortName: "SGBAU" },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6] as const;

const sampleSubjectNames: Record<number, string[]> = {
  1: ["Programming Basics", "Mathematics Foundations", "Computer Fundamentals", "Communication Skills"],
  2: ["Data Structures", "Database Concepts", "Web Basics", "Statistics"],
  3: ["Object-Oriented Programming", "Operating Systems", "Networking Basics", "Software Engineering"],
  4: ["Java Programming", "Web Development", "Computer Graphics"],
  5: ["Python Programming", "Mobile App Development"],
  6: [],
};

const BASE_DATE = Date.UTC(2026, 9, 1);

function makeResources(subjectId: string, subjectName: string): Resource[] {
  const out: Resource[] = [];
  const add = (kind: Resource["kind"], i: number, category: string, title: string, extra: Partial<Resource>) => {
    const key = `${subjectId}-${kind}-${i}`;
    const h = hashString(key);
    out.push({
      id: key,
      subjectId,
      kind,
      category,
      title,
      description: `${category} for ${subjectName}. Sample entry that shows how this will look once real content is added.`,
      downloads: h % 120,
      addedAt: new Date(BASE_DATE + (h % 38) * 86_400_000).toISOString(),
      hue: h % 4,
      isSample: true,
      ...extra,
    });
  };
  let i = 0;
  for (const unit of [1, 2, 3, 4]) add("notes", i++, "Unit-wise notes", `Unit ${unit} notes`, { unit, pages: 8 + (hashString(subjectId + unit) % 30) });
  add("notes", i++, "Short notes", "Quick revision sheet", { pages: 8 });
  add("notes", i++, "Detailed notes", "Complete detailed notes", { pages: 52 });
  add("notes", i++, "Handwritten notes", "Handwritten notes", { pages: 28 });
  add("notes", i++, "Important questions", "Important questions with answers", { pages: 12 });
  i = 0;
  for (const unit of [1, 2, 3, 4]) add("video", i++, "Topic lesson", `Unit ${unit}, Lesson 1`, { unit });
  add("video", i++, "Exam revision", "Last-minute revision", {});
  i = 0;
  for (const year of [2019, 2020, 2021, 2022, 2023]) add("pyq", i++, "Question paper", `${year} question paper`, { year, pages: 3 });
  for (const year of [2022, 2023]) add("pyq", i++, "Solved paper", `${year} solved paper`, { year, pages: 10 });
  add("pyq", i++, "Important questions", "Most repeated questions", { pages: 6 });
  return out;
}

export const resources: Resource[] = [];

export const subjects: Subject[] = Object.entries(sampleSubjectNames).flatMap(([sem, names]) =>
  names.map((name) => {
    const id = `s${sem}-${slugify(name)}`;
    const own = makeResources(id, name);
    resources.push(...own);
    return {
      id,
      slug: slugify(name),
      name,
      semester: Number(sem),
      courseSlug: "bca",
      universitySlug: "sgbau",
      description: `Sample subject page for ${name}.`,
      isSample: true,
      counts: {
        notes: own.filter((r) => r.kind === "notes").length,
        videos: own.filter((r) => r.kind === "video").length,
        pyqs: own.filter((r) => r.kind === "pyq").length,
      },
      downloads: own.reduce((a, r) => a + r.downloads, 0),
    } satisfies Subject;
  }),
);
