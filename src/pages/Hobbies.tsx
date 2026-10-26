import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const chapters = [
  { title: "Fitness & Strength Training", note: "A practice in patience", paragraphs: [
    "Strength training gives my week a different kind of structure. There’s something satisfying about showing up, working through a session, and leaving the screen behind for a while. Progress is gradual, and that’s part of why I like it.",
    "Progressive overload is a useful reminder to build on what’s already there. A little more weight, a better movement, or a more consistent week adds up over time. Rest belongs in that process too. Physical recovery and mental recovery both make the next session better."] },
  { title: "Gaming & Storytelling Roots", note: "Where curiosity started", paragraphs: [
    "Games have always been a way for me to explore. I enjoy the worlds and stories, but I’m also drawn to the small decisions underneath them: how a mechanic is introduced, how a challenge teaches you something, and how a few simple rules can create surprising possibilities.",
    "That curiosity carries into how I think about software. A good system feels understandable even when there’s a lot happening beneath the surface. Away from work, though, sometimes a game is simply a good story and a chance to unwind."] },
  { title: "Craft, Coffee & Precision", note: "Paying attention to small things", paragraphs: [
    "I like making room for things that take a little care: a cup of coffee, a meal, or a small adjustment that makes something feel right. These are ordinary routines, but they give me a reason to slow down and pay attention.",
    "What I enjoy is the process of noticing. Changing one detail, seeing what happens, and learning a preference along the way. There doesn’t need to be a finished product to show anyone. Sometimes making something for yourself is enough."] },
  { title: "Balance & Longevity", note: "Leaving room for the rest of life", paragraphs: [
    "I want to keep enjoying the work I do for a long time. For me, that means having interests that don’t all happen at a keyboard. Training, playing, cooking, and taking a break give the day a different rhythm.",
    "Stepping away often makes it easier to return with a fresh perspective. But these interests matter on their own, too. They’re part of who I am outside of the projects and job titles on the rest of this site."] },
];

export default function Hobbies() {
  const { scrollYProgress } = useScroll();
  return <div className="min-h-screen bg-[#050505] text-neutral-100">
    <Helmet><title>Beyond the Code | Raymond Li</title><meta name="description" content="Notes on strength training, games, coffee, and life outside software." /></Helmet>
    <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 bg-neutral-300 origin-left" style={{ scaleX: scrollYProgress }} />
    <header className="editorial-header"><Link to="/" className="editorial-back"><ArrowLeft size={15} /> Home</Link><span className="editorial-eyebrow">Raymond Li / Personal notes</span></header>
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="max-w-3xl mb-16"><p className="editorial-eyebrow">Beyond the Code · A short personal essay</p>
        <h1 className="mt-6 text-5xl md:text-7xl tracking-tight leading-[1.08] font-light">Beyond the Terminal:<br /><span className="font-serif italic text-neutral-400">The Humans Behind the Code</span></h1>
        <p className="mt-8 text-lg leading-8 text-neutral-400 max-w-2xl">Most of this site is about what I build. This page is about the quieter parts of my week: lifting, getting lost in a game, making coffee, and finding a little balance along the way.</p></div>
      <article className="space-y-6">{chapters.map((chapter, i) => <section key={chapter.title} className="editorial-card grid md:grid-cols-[160px_1fr] gap-6 md:gap-10 p-7 md:p-12">
        <div><p className="font-mono text-sm text-neutral-500">0{i + 1} /</p><p className="mt-4 text-sm text-neutral-500">{chapter.note}</p></div>
        <div><h2 className="text-2xl md:text-3xl font-light mb-6">{chapter.title}</h2><div className="space-y-5 text-neutral-400 text-base md:text-lg leading-8">{chapter.paragraphs.map(p => <p key={p}>{p}</p>)}</div></div>
      </section>)}</article>
      <blockquote className="my-16 md:my-24 border-l border-neutral-600 pl-8 max-w-2xl text-3xl md:text-4xl font-serif italic leading-snug text-neutral-300">“There doesn’t need to be a finished product to show anyone.”</blockquote>
      <footer className="border-t border-white/10 pt-8 flex justify-between text-sm text-neutral-500"><span>A little more about me.</span><Link to="/projects" className="editorial-back">Back to the work <ArrowUpRight size={16} /></Link></footer>
    </main>
  </div>;
}
