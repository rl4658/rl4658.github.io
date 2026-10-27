import { useEffect, type ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type ArticleProps = {
  title: string;
  category: string;
  description: string;
  readingTime: string;
  sections: readonly (readonly [string, string])[];
  metrics: readonly (readonly [string, string])[];
  children: ReactNode;
};

export default function EngineeringArticle({
  title,
  category,
  description,
  readingTime,
  sections,
  metrics,
  children,
}: ArticleProps) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100">
      <Helmet>
        <title>{title} | Raymond Li</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`https://rl4658.github.io${pathname === "/projects/spotify-playlist-generator" ? "/projects/spotify" : pathname}`}
        />
      </Helmet>
      <header className="editorial-header flex-wrap">
        <Link to="/projects" className="editorial-back">
          <ArrowLeft size={15} /> Back to projects
        </Link>
        <span className="editorial-eyebrow">Engineering blog · {category}</span>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <article>
          <div className="max-w-5xl">
            <p className="editorial-eyebrow mb-6">
              Field notes / Engineering in practice
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.13] font-light text-balance">
              {title}
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-8 text-neutral-400 max-w-3xl">
              {description}
            </p>
            <p className="mt-8 text-sm text-neutral-500">
              By <span className="text-neutral-200">Raymond Li</span> ·{" "}
              {readingTime} min read · Technical project notes
            </p>
          </div>
          <nav
            aria-label="On this page"
            className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/10 py-5"
          >
            {sections.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-xs leading-6 text-neutral-400 hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="grid sm:grid-cols-3 gap-4 my-10">
            {metrics.map(([value, label]) => (
              <div key={label} className="editorial-card p-6">
                <p className="text-3xl font-light">{value}</p>
                <p className="editorial-eyebrow mt-3">{label}</p>
              </div>
            ))}
          </div>
          {children}
        </article>
        <footer className="mt-20 border-t border-white/10 pt-8 flex flex-wrap justify-between gap-4 text-sm text-neutral-500">
          <span>Raymond Li / Engineering notebook</span>
          <Link to="/projects" className="editorial-back">
            Explore more projects <ArrowUpRight size={16} />
          </Link>
        </footer>
      </main>
    </div>
  );
}

export function ArticleSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="research-section">
      <p className="editorial-eyebrow mb-4">{number} / Engineering notes</p>
      <h2 className="research-heading max-w-4xl">{title}</h2>
      {children}
    </section>
  );
}

export function SourceLink({
  href,
  label,
  meta,
  children,
}: {
  href: string;
  label?: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-neutral-200 underline underline-offset-4 hover:text-white"
    >
      {children ? (
        children
      ) : (
        <span>
          {label}
          {meta ? (
            <span className="text-neutral-400 font-normal ml-1.5">({meta})</span>
          ) : null}
        </span>
      )}
      <ArrowUpRight size={15} className="shrink-0" />
    </a>
  );
}
