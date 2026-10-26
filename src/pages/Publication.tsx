import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Copy, Check } from "lucide-react";
import { publication } from "@/data/profile";

const repositoryUrl = "https://irdash.must.ac.ug/server/api/core/bitstreams/89b1f03c-59bc-4f0f-bc9a-03324582ce6c/content";
const sections = [["abstract", "Abstract & context"], ["hardware", "CAD & hardware"], ["method", "The mathematics"], ["findings", "Findings"], ["contributions", "My contributions"], ["citation", "Citation"]];
const hardware = [
  ["Compute", "Raspberry Pi 3B", "Coordinates acquisition; reconstruction implemented in Python 3.10."],
  ["Illumination", "196-LED matrix", "Pimoroni Unicorn HAT HD, 14 × 14 LEDs; 3.3 mm spacing, 530 nm green illumination."],
  ["Imaging", "Raspberry Pi V2 NOIR camera", "1.12 μm pixels, 3.0 mm lens, 2.6× magnification."],
  ["Structure", "3D-printed PLA body", "Modeled in OpenSCAD and fabricated on a consumer Dremel 3045 printer."],
];
function Figure({ file, alt, caption, isCad }: { file: string; alt: string; caption: string; isCad?: boolean }) {
  return (
    <figure className="research-figure">
      <img src={`/images/publication/${file}`} alt={alt} loading="lazy"
        className={`block w-full h-auto object-contain ${isCad ? "bg-transparent" : ""}`} />
      <figcaption className="research-caption">{caption}</figcaption>
    </figure>
  );
}
export default function Publication() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  async function copyCitation() {
    try { await navigator.clipboard.writeText(publication.bibtex); setCopyState("copied"); }
    catch { setCopyState("error"); }
  }
  return <div className="min-h-screen bg-[#050505] text-neutral-100">
    <Helmet><title>Low-Cost Computational Microscopy | Raymond Li</title><meta name="description" content="Research notes on a Raspberry Pi Fourier ptychography microscope: CAD, optical reconstruction, MTF measurements, and a 1.8× resolution improvement." /><link rel="canonical" href="https://rl4658.github.io/publication" /></Helmet>
    <header className="editorial-header"><Link to="/" className="editorial-back"><ArrowLeft size={15} /> Home</Link><span className="editorial-eyebrow">Raymond Li / Research notes</span></header>
    <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="max-w-4xl">
        <span className="inline-block rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 editorial-eyebrow">SPIE BiOS · 2024 · Global health imaging</span>
        <p className="editorial-eyebrow mt-10 mb-5">Research story / 01</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.13] font-light">{publication.title}</h1>
        <p className="mt-8 text-lg text-neutral-300 leading-8">{publication.authors.map((author, i) => <span key={author}>{i > 0 && ", "}{author === "Raymond Li" ? <strong className="font-medium text-white">{author}</strong> : author}{author === "William Wasswa" && <sup>1</sup>}</span>)}</p>
        <p className="mt-4 text-sm text-neutral-500 leading-6">Imaging Research Laboratories, Robarts Research Institute, Western University, London, Canada<br /><sup>1</sup> Mbarara University of Science and Technology, Mbarara, Uganda</p>
        <a href={publication.url} target="_blank" rel="noopener noreferrer" className="editorial-back mt-6 underline underline-offset-4">Read the published paper <ArrowUpRight size={15} /></a>
      </div>
      <nav aria-label="On this page" className="mt-12 flex gap-x-6 gap-y-3 flex-wrap border-y border-white/10 py-5">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="text-xs text-neutral-400 hover:text-white">{label}</a>)}</nav>
      <div className="grid md:grid-cols-3 gap-4 my-10">{publication.metrics?.map(m => <div key={m.label} className="editorial-card p-6"><p className="text-3xl font-light">{m.value}</p><p className="editorial-eyebrow mt-3">{m.label}</p></div>)}</div>
      <Figure file="fig1_prototype.png" alt="Assembled prototype Fourier ptychography microscope" caption="The prototype: inexpensive components housed in a printed structure, with programmable illumination beneath the specimen." />

      <section id="abstract" className="research-section">
        <p className="editorial-eyebrow mb-4">01 / The question</p><h2 className="research-heading">Affordable hardware. Measurable resolution.</h2>
        <div className="grid md:grid-cols-[1fr_260px] gap-10">
          <div className="research-prose"><h3 className="text-xl text-neutral-200">Abstract — a reading summary</h3><p>{publication.abstract}</p><p className="text-sm">Adapted from the paper’s abstract. The <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-neutral-200">full original abstract and paper</a> are available in the university repository.</p>
            <h3 className="text-xl text-neutral-200 pt-5">Why this matters</h3><p>The motivation is point-of-care malaria diagnosis in places where conventional laboratory equipment is difficult to access. Low component cost is a starting point; image quality still needs a repeatable measurement. This study connects the two through a test target and a measured transfer function.</p><p>The blood-cell images demonstrate biological imaging. They do not establish clinical diagnostic accuracy or a validated malaria screening system.</p></div>
          <aside className="editorial-card p-7 self-start"><p className="editorial-eyebrow">A useful distinction</p><blockquote className="mt-5 text-2xl font-serif italic leading-relaxed text-neutral-300">More pixels aren’t the same thing as more resolved detail.</blockquote><p className="text-sm leading-6 text-neutral-500 mt-5">MTF asks how much contrast survives as features get finer.</p></aside>
        </div>
      </section>
      <section id="hardware" className="research-section">
        <p className="editorial-eyebrow mb-4">02 / From CAD to the bench</p><h2 className="research-heading">A small instrument, built in layers.</h2>
        <div className="research-prose max-w-3xl mb-8"><p>The printed structure holds the optical path together. The stage supports the specimen; the mount holder and camera mount locate the imaging assembly, while spacers set the separation between components. These parts make the design reproducible with consumer fabrication tools.</p></div>
        <div className="grid md:grid-cols-3 gap-6">
          <Figure isCad file="microscope_cad_view_2.png" alt="Isometric CAD view of the printed microscope structure" caption="Isometric view — stage and supporting printed structure." />
          <Figure isCad file="microscope_cad_view_3.png" alt="Rear CAD view of the microscope mount holder and camera assembly" caption="Rear view — mount holder and camera mount alignment." />
          <Figure isCad file="microscope_cad_view_4.png" alt="Side CAD view showing the microscope structure and spacing" caption="Side view — component spacing and stacked assembly." />
        </div>
        <h3 className="mt-10 mb-5 text-xl font-light">Bill of materials & hardware breakdown</h3>
        <div className="overflow-x-auto editorial-card"><table className="w-full min-w-[580px] text-sm text-left"><caption className="sr-only">Core components of the microscope; total component cost below $200 USD.</caption><thead className="border-b border-white/10 text-neutral-300"><tr><th className="p-5">Subsystem</th><th className="p-5">Component</th><th className="p-5">Details</th></tr></thead><tbody>{hardware.map(([role, name, detail]) => <tr key={role} className="border-b border-white/5"><th className="p-5 font-normal text-neutral-500">{role}</th><td className="p-5 text-neutral-200">{name}</td><td className="p-5 text-neutral-400 leading-6">{detail}</td></tr>)}</tbody></table></div>
        <p className="mt-4 text-sm text-neutral-500">Total component cost reported in the paper: less than $200 USD. Individual part prices are not itemized here.</p>
      </section>
      <section id="method" className="research-section">
        <p className="editorial-eyebrow mb-4">03 / Computational optics</p><h2 className="research-heading">Recovering detail from changing angles.</h2>
        <div className="research-prose max-w-3xl"><p>Each LED illuminates the specimen from a different direction. That shifts the portion of the specimen’s spatial-frequency spectrum admitted by the pupil. Overlapping measurements let an iterative phase-retrieval algorithm combine these regions into a larger synthetic aperture.</p></div>
        <div role="math" aria-label="The intensity for illumination j equals the squared magnitude of the inverse Fourier transform of the pupil times the shifted object spectrum" className="research-formula font-serif"><var>I</var><sub>j</sub>(<var>x</var>) = | ℱ<sup>−1</sup> {'{'} <var>P</var>(<var>k</var>) · <var>O</var>(<var>k</var> − <var>k</var><sub>j</sub>) {'}'} |<sup>2</sup></div>
        <p className="research-prose max-w-3xl">Here O is the object spectrum, P is the pupil, and k<sub>j</sub> is the illumination shift. Reconstruction alternates between matching the recorded image amplitudes and updating the shared Fourier-domain estimate. This is an explanatory forward model, using simplified notation.</p>
        <div className="mt-8"><Figure file="fig2_reconstruction.png" alt="Schematic of Fourier ptychography reconstruction and overlapping Fourier regions" caption="Fourier-domain synthesis: shifted measurements contribute overlapping information to a shared reconstruction." /></div>
        <h3 className="mt-10 text-2xl font-light mb-5">Measuring the modulation transfer function</h3>
        <p className="research-prose max-w-3xl">Profiles through the USAF square-wave bars contain a fundamental frequency and odd harmonics. A least-squares fit estimates their amplitudes rather than relying on a single bright or dark pixel. Normalizing the fitted response against larger uniform regions yields the contrast-transfer measurement.</p>
        <div role="math" aria-label="Least squares minimizes the sum of squared differences between measured profiles and a fitted odd harmonic model" className="research-formula font-serif space-y-4">
          <p>θ̂ = arg min<sub>θ</sub> Σ<sub>i</sub> [<var>y</var><sub>i</sub> − <var>g</var>(<var>x</var><sub>i</sub>; θ)]<sup>2</sup></p>
          <p><var>g</var>(<var>x</var>; θ) = <var>b</var> + Σ<sub>n = 1, 3, 5, …</sub> <var>a</var><sub>n</sub> cos(2π<var>nfx</var> + φ<sub>n</sub>)</p>
          <p>MTF(<var>f</var>) = |<var>H</var>(<var>f</var>)| / |<var>H</var>(0)|</p>
        </div>
        <p className="text-sm text-neutral-500 leading-7 max-w-3xl">These equations summarize the method rather than reproduce the paper’s notation. The parameters θ include the offset b and harmonic amplitudes and phases; f is spatial frequency. H denotes the optical transfer function. The 10% MTF frequency marks where normalized contrast falls to 0.1.</p>
      </section>
      <section id="findings" className="research-section">
        <p className="editorial-eyebrow mb-4">04 / What the measurements show</p><h2 className="research-heading">From 300 to 550 cycles per millimetre.</h2>
        <div className="research-prose max-w-3xl mb-8"><p>At a numerical aperture of 0.15 and wavelength of 530 nm, the pupil’s theoretical diffraction limit was 280 cycles/mm. The on-axis image reached 10% MTF at 300 cycles/mm. Fourier ptychography pushed that measurement to 550 cycles/mm: approximately 1.8× the on-axis result, approaching the roughly 667–670 cycles/mm Nyquist sampling limit.</p></div>
        <Figure file="fig8_9_mtf_results.png" alt="USAF resolution target comparisons and measured MTF curves" caption="USAF target images and MTF curves quantify the resolution improvement. The reported result is a spatial-frequency measurement at 10% MTF." />
        <div className="mt-8"><Figure file="fig3_blood_cells.png" alt="Comparison of Wright’s-stained red blood cells before and after Fourier ptychography reconstruction" caption="Wright’s-stained red blood cells provide a biological example of the reconstructed imagery, in the context of low-cost microscopy for malaria diagnostics." /></div>
      </section>
      <section id="contributions" className="research-section">
        <p className="editorial-eyebrow mb-4">05 / My part in the work</p><h2 className="research-heading">Software that meets an optical instrument.</h2>
        <div className="research-prose max-w-3xl"><p>At Robarts Research Institute, my engineering work connected imaging software with Raspberry Pi hardware. My contributions included modular Python pipelines, C++ firmware work, and debugging hardware integration. This project led to a co-authored SPIE publication in 2024.</p><p>The CAD design, reconstruction method, and optical measurements described above are outcomes of the research team. The paper lists co-authors without assigning each task to an individual.</p></div>
        <ol className="grid md:grid-cols-3 gap-5 mt-8">{[["2023–2024", "Research engineering", "Python pipeline development and firmware integration at Robarts."], ["Prototype", "Hardware & software", "Contributed to the Raspberry Pi instrument’s integration and debugging."], ["2024", "Publication", "Co-authored the paper reporting measured optical resolution and MTF."]].map(([date, title, detail]) => <li key={title} className="editorial-card p-7"><p className="editorial-eyebrow">{date}</p><h3 className="text-lg mt-5 mb-3">{title}</h3><p className="text-sm text-neutral-400 leading-7">{detail}</p></li>)}</ol>
      </section>
      <section id="citation" className="research-section">
        <p className="editorial-eyebrow mb-4">06 / Reference</p><h2 className="research-heading">Cite the work.</h2>
        <p className="text-neutral-400 leading-7 mb-6">{publication.venue}. Proceedings of SPIE, volume 12832, article 1283205 (2024). <a className="underline underline-offset-4" href={publication.url}>doi:{publication.doi}</a></p>
        <div className="editorial-card overflow-hidden"><div className="px-6 py-4 flex justify-between items-center gap-4 border-b border-white/10"><span className="editorial-eyebrow">BibTeX</span><button onClick={copyCitation} className="editorial-back">{copyState === "copied" ? <Check size={16} /> : <Copy size={16} />} {copyState === "copied" ? "Copied" : "Copy citation"}</button></div><pre className="p-6 overflow-x-auto text-xs sm:text-sm leading-7 text-neutral-400"><code>{publication.bibtex}</code></pre></div>
        <p role="status" className="text-sm text-neutral-400 mt-3">{copyState === "error" ? "Clipboard unavailable. Select and copy the citation above." : copyState === "copied" ? "Citation copied to clipboard." : ""}</p>
        <p className="mt-8 text-sm text-neutral-500 leading-7">Source: <a className="underline underline-offset-4" href={repositoryUrl} target="_blank" rel="noopener noreferrer">University-hosted paper</a>. Figures and CAD views are from the supplied research materials.</p>
      </section>
      <footer className="border-t border-white/10 mt-16 pt-8"><Link to="/projects" className="editorial-back">Explore my engineering projects <ArrowUpRight size={16} /></Link></footer>
    </main>
  </div>;
}
