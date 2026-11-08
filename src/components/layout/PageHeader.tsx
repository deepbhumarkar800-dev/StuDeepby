import { Breadcrumbs } from "./Breadcrumbs";
import { Flower, Leaf } from "@/components/brand/Botanicals";

interface Props {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHeader({ title, description, crumbs, children }: Props) {
  return (
    <section className="container-x pt-8 sm:pt-12">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="panel on-dark relative rounded-[2rem] px-6 py-8 sm:px-10 sm:py-11">
        <Flower className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rotate-12 opacity-95 sm:h-40 sm:w-40" />
        <Leaf tone="emerald" className="pointer-events-none absolute bottom-0 right-24 hidden h-16 w-24 opacity-40 sm:block" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-display text-[1.65rem] font-bold leading-tight text-silver sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-[15px] leading-relaxed text-ivory/90 sm:text-base">{description}</p>}
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </section>
  );
}
