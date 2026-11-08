import { PageHeader } from "@/components/layout/PageHeader";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({ title, intro, sections, path }: { title: string; intro: string; sections: LegalSection[]; path: string }) {
  return (
    <>
      <PageHeader title={title} description={intro} crumbs={[{ label: "Home", href: "/" }, { label: title }]} />
      <article className="container-x mt-10" data-path={path}>
        <p className="mb-6 rounded-2xl border border-dashed border-sage bg-cream px-4 py-3 text-sm text-ink/85">
          Draft template: the site owner must review and edit this page, ideally with a legal professional, before launch.
        </p>
        <div className="max-w-3xl space-y-8 rounded-[2rem] border border-line bg-ivory p-6 shadow-soft sm:p-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-heading text-lg font-bold text-forest">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-2 text-[16px] leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
