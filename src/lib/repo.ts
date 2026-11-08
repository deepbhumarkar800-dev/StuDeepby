import { courses as demoCourses, resources as demoResources, subjects as demoSubjects, universities as demoUnis, SEMESTERS } from "./data";
import { createPublicClient } from "./supabase/public";
import type { Course, Resource, ResourceWithSubject, Subject, University } from "./types";
import { hashString } from "./utils";

/**
 * DATA ACCESS LAYER
 * Pages read data only through these functions.
 * - Supabase connected: real data from the database (published rows only).
 * - Supabase not connected: demo data from data.ts so the design can still be previewed.
 */

export const semesterNumbers = SEMESTERS;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

function db() {
  return createPublicClient();
}

const toCourse = (r: Row): Course => ({ slug: r.slug, name: r.name, fullName: r.full_name, description: r.description });
const toUni = (r: Row): University => ({ slug: r.slug, courseSlug: r.course_slug, name: r.name, shortName: r.short_name });

function toResource(r: Row): Resource {
  return {
    id: r.id,
    subjectId: r.subject_id,
    kind: r.kind,
    category: r.category,
    title: r.title,
    description: r.description ?? "",
    unit: r.unit ?? undefined,
    year: r.year ?? undefined,
    pages: r.pages ?? undefined,
    youtubeUrl: r.youtube_url ?? undefined,
    downloads: r.download_count ?? 0,
    addedAt: r.created_at,
    hue: hashString(r.id) % 4,
    isSample: false,
  };
}

function toSubject(r: Row, own: Resource[]): Subject {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    semester: r.semester,
    courseSlug: r.course_slug,
    universitySlug: r.university_slug,
    description: r.description ?? "",
    isSample: false,
    counts: {
      notes: own.filter((x) => x.kind === "notes").length,
      videos: own.filter((x) => x.kind === "video").length,
      pyqs: own.filter((x) => x.kind === "pyq").length,
    },
    downloads: own.reduce((a, x) => a + x.downloads, 0),
  };
}

async function loadAll(): Promise<{ subjects: Subject[]; resources: Resource[] }> {
  const client = db();
  if (!client) return { subjects: demoSubjects, resources: demoResources };
  const [s, r] = await Promise.all([
    client.from("subjects").select("*").order("name"),
    client.from("resources").select("*").order("created_at", { ascending: false }),
  ]);
  const resources = (r.data ?? []).map(toResource);
  const subjects = (s.data ?? []).map((row: Row) => toSubject(row, resources.filter((x) => x.subjectId === row.id)));
  return { subjects, resources };
}

export async function getCourses(): Promise<Course[]> {
  const client = db();
  if (!client) return demoCourses;
  const { data } = await client.from("courses").select("*").order("name");
  return (data ?? []).map(toCourse);
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  return (await getCourses()).find((c) => c.slug === slug);
}

export async function getUniversities(courseSlug: string): Promise<University[]> {
  const client = db();
  if (!client) return demoUnis.filter((u) => u.courseSlug === courseSlug);
  const { data } = await client.from("universities").select("*").eq("course_slug", courseSlug).order("short_name");
  return (data ?? []).map(toUni);
}

export async function getUniversity(courseSlug: string, slug: string): Promise<University | undefined> {
  return (await getUniversities(courseSlug)).find((u) => u.slug === slug);
}

export async function getAllSubjects(): Promise<Subject[]> {
  return (await loadAll()).subjects;
}

export async function getSubjects(courseSlug: string, universitySlug: string, semester?: number): Promise<Subject[]> {
  const { subjects } = await loadAll();
  return subjects.filter(
    (s) => s.courseSlug === courseSlug && s.universitySlug === universitySlug && (semester === undefined || s.semester === semester),
  );
}

export async function getSubject(courseSlug: string, universitySlug: string, semester: number, slug: string): Promise<Subject | undefined> {
  const list = await getSubjects(courseSlug, universitySlug, semester);
  return list.find((s) => s.slug === slug);
}

export async function getResourcesForSubject(subjectId: string): Promise<Resource[]> {
  const client = db();
  if (!client) return demoResources.filter((r) => r.subjectId === subjectId);
  const { data } = await client.from("resources").select("*").eq("subject_id", subjectId).order("created_at", { ascending: false });
  return (data ?? []).map(toResource);
}

export function subjectHref(s: Subject): string {
  return `/courses/${s.courseSlug}/${s.universitySlug}/${s.semester}/${s.slug}`;
}

export async function getRecentResources(limit: number): Promise<ResourceWithSubject[]> {
  const { subjects, resources } = await loadAll();
  const out: ResourceWithSubject[] = [];
  for (const r of [...resources].sort((a, b) => b.addedAt.localeCompare(a.addedAt))) {
    const subject = subjects.find((s) => s.id === r.subjectId);
    if (!subject) continue;
    const tab = r.kind === "video" ? "videos" : r.kind === "pyq" ? "pyqs" : "notes";
    out.push({ ...r, subject, href: `${subjectHref(subject)}?tab=${tab}&r=${r.id}` });
    if (out.length >= limit) break;
  }
  return out;
}

/** Subjects with the most downloads, falling back to those with the most resources. */
export async function getPopularSubjects(limit: number): Promise<Subject[]> {
  const { subjects } = await loadAll();
  const total = (s: Subject) => s.counts.notes + s.counts.videos + s.counts.pyqs;
  return subjects
    .filter((s) => total(s) > 0)
    .sort((a, b) => b.downloads - a.downloads || total(b) - total(a))
    .slice(0, limit);
}
