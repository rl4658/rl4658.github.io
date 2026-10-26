import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { Check, Copy, Music2, Sparkles } from "lucide-react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/spotify-playlist-generator";
const sections = [
  ["overview", "01 / Overview"],
  ["acoustic-latent-space", "02 / Acoustic space"],
  ["interactive-studio", "03 / Interactive studio"],
  ["architecture", "04 / Architecture"],
  ["visual-interface", "05 / Visual interface"],
  ["source-code", "06 / Source code"],
] as const;
const dimensions = [
  "Energy",
  "Danceability",
  "Tempo",
  "Valence",
  "Acousticness",
  "Instrumentalness",
];
const profiles = {
  night: [0.78, 0.7, 118, 0.4, 0.12, 0.45],
  workout: [0.95, 0.8, 160, 0.7, 0.05, 0.15],
  study: [0.22, 0.35, 78, 0.45, 0.85, 0.88],
  summer: [0.8, 0.9, 120, 0.92, 0.15, 0.08],
  acoustic: [0.3, 0.45, 92, 0.5, 0.94, 0.1],
} as const;
type Mood = keyof typeof profiles;
const presets: [string, Mood][] = [
  ["Late night drive through Tokyo", "night"],
  ["An intense electronic workout", "workout"],
  ["Rainy coffee shop study session", "study"],
  ["Upbeat summer beach party", "summer"],
];
const catalog: [string, string, Mood][] = [
  ["Midnight City", "M83", "night"],
  ["Nightcall", "Kavinsky", "night"],
  ["Instant Crush", "Daft Punk", "night"],
  ["A Real Hero", "College & Electric Youth", "night"],
  ["Intro", "The xx", "night"],
  ["Resonance", "HOME", "night"],
  ["Sunset", "The Midnight", "night"],
  ["Days of Thunder", "The Midnight", "night"],
  ["Running in the Night", "FM-84", "night"],
  ["Something About Us", "Daft Punk", "night"],
  ["Titanium", "David Guetta & Sia", "workout"],
  ["Animals", "Martin Garrix", "workout"],
  ["Levels", "Avicii", "workout"],
  ["Harder, Better, Faster, Stronger", "Daft Punk", "workout"],
  ["Bangarang", "Skrillex", "workout"],
  ["Don't You Worry Child", "Swedish House Mafia", "workout"],
  ["Greyhound", "Swedish House Mafia", "workout"],
  ["One More Time", "Daft Punk", "workout"],
  ["Sandstorm", "Darude", "workout"],
  ["Strobe", "deadmau5", "workout"],
  ["Weightless", "Marconi Union", "study"],
  ["A Walk", "Tycho", "study"],
  ["Awake", "Tycho", "study"],
  ["First Breath After Coma", "Explosions in the Sky", "study"],
  ["Near Light", "Ólafur Arnalds", "study"],
  ["Saman", "Ólafur Arnalds", "study"],
  ["Ambre", "Nils Frahm", "study"],
  ["Says", "Nils Frahm", "study"],
  ["We Move Lightly", "Dustin O'Halloran", "study"],
  ["An Ending (Ascent)", "Brian Eno", "study"],
  ["Get Lucky", "Daft Punk & Pharrell Williams", "summer"],
  ["Levitating", "Dua Lipa", "summer"],
  ["September", "Earth, Wind & Fire", "summer"],
  ["Walking on a Dream", "Empire of the Sun", "summer"],
  ["Electric Feel", "MGMT", "summer"],
  ["Feel It Still", "Portugal. The Man", "summer"],
  ["Happy", "Pharrell Williams", "summer"],
  ["Treasure", "Bruno Mars", "summer"],
  ["Good Times", "CHIC", "summer"],
  ["Slide", "Calvin Harris", "summer"],
  ["Pink Moon", "Nick Drake", "acoustic"],
  ["Heartbeats", "José González", "acoustic"],
  ["Holocene", "Bon Iver", "acoustic"],
  ["Bloom", "The Paper Kites", "acoustic"],
  ["Cherry Wine", "Hozier", "acoustic"],
  ["Stay Alive", "José González", "acoustic"],
  [" re: Stacks", "Bon Iver", "acoustic"],
  ["The Stable Song", "Gregory Alan Isakov", "acoustic"],
  ["Featherstone", "The Paper Kites", "acoustic"],
  ["Naked as We Came", "Iron & Wine", "acoustic"],
];
const tracks = catalog.map(([name, artist, mood], i) => ({
  name: name.trim(),
  artist,
  features: profiles[mood].map((value, d) =>
    d === 2
      ? value + ((i % 7) - 3) * 3
      : Math.max(0, Math.min(1, value + ((i % 7) - 3) * 0.025)),
  ),
}));
const normalize = (vector: readonly number[]) =>
  vector.map((value, i) => (i === 2 ? (value - 60) / 120 : value));
function cosine(a: number[], b: number[]) {
  const denominator = Math.hypot(...a) * Math.hypot(...b);
  return denominator
    ? a.reduce((sum, value, i) => sum + value * b[i], 0) / denominator
    : 0;
}
function inferMood(prompt: string): Mood {
  if (/workout|gym|lifting|intense|run\b|fast|power/i.test(prompt))
    return "workout";
  if (/study|coffee|rain|focus|ambient|instrumental|quiet/i.test(prompt))
    return "study";
  if (/summer|beach|party|happy|dance|upbeat/i.test(prompt)) return "summer";
  if (/acoustic|folk|guitar|gentle/i.test(prompt)) return "acoustic";
  return "night";
}

function SynthesisStudio() {
  const [prompt, setPrompt] = useState(presets[0][0]);
  const [values, setValues] = useState<number[]>([...profiles.night]);
  const [seed, setSeed] = useState("");
  const [alpha, setAlpha] = useState(0.7);
  const [result, setResult] = useState<{
    vector: number[];
    prompt: string;
  } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const ranked = useMemo(
    () =>
      result
        ? tracks
            .map((track) => ({
              ...track,
              score: cosine(
                normalize(track.features),
                normalize(result.vector),
              ),
            }))
            .sort((a, b) => b.score - a.score)
        : [],
    [result],
  );
  function generate(event: FormEvent) {
    event.preventDefault();
    const seedVector = seed === "" ? null : tracks[Number(seed)].features;
    setResult({
      vector: values.map((v, i) =>
        seedVector ? alpha * v + (1 - alpha) * seedVector[i] : v,
      ),
      prompt,
    });
    setExpanded(false);
  }
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <p className="flex items-center gap-2 text-green-400 text-sm">
          <Sparkles size={16} /> Acoustic synthesis playground
        </p>
        <span className="editorial-eyebrow">
          Local simulation / No account needed
        </span>
      </div>
      <p className="text-sm text-neutral-400 leading-7 mt-5">
        Explore the mapping locally. Prompt keywords choose an illustrative
        vector; adjust all six dimensions, optionally blend a seed, then rank a
        50-track sample catalog by cosine similarity. Audio features here are
        synthetic examples, not Spotify measurements. No API calls or playlist
        saves occur.
      </p>
      <form onSubmit={generate} className="mt-6">
        <label htmlFor="music-prompt" className="text-sm text-neutral-200">
          Describe a moment
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <input
            id="music-prompt"
            required
            maxLength={300}
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setValues([...profiles[inferMood(event.target.value)]]);
            }}
            className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm focus-visible:outline-green-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-400 text-black font-medium px-5 py-3 text-sm hover:bg-green-300"
          >
            Synthesize playlist
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {presets.map(([text, mood]) => (
            <button
              type="button"
              key={mood}
              onClick={() => {
                setPrompt(text);
                setValues([...profiles[mood]]);
              }}
              className="border border-white/10 rounded-full px-3 py-2 text-xs text-neutral-400 hover:text-white hover:border-white/30"
            >
              {text}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 my-8">
          {dimensions.map((name, i) => (
            <div key={name}>
              <label
                htmlFor={`feature-${i}`}
                className="flex justify-between gap-3 text-sm text-neutral-300"
              >
                {name}
                <output className="font-mono text-green-400">
                  {i === 2 ? `${values[i]} BPM` : values[i].toFixed(2)}
                </output>
              </label>
              <input
                id={`feature-${i}`}
                type="range"
                min={i === 2 ? 60 : 0}
                max={i === 2 ? 180 : 1}
                step={i === 2 ? 1 : 0.01}
                value={values[i]}
                onChange={(event) =>
                  setValues((current) =>
                    current.map((value, n) =>
                      n === i ? Number(event.target.value) : value,
                    ),
                  )
                }
                className="w-full mt-3 accent-green-400"
              />
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-6 border-t border-white/10 pt-6">
          <div>
            <label
              htmlFor="seed-track"
              className="block text-sm mb-3 text-neutral-300"
            >
              Optional seed track
            </label>
            <select
              id="seed-track"
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-white/15 bg-neutral-900 px-3 py-3 text-sm"
            >
              <option value="">Prompt vector only</option>
              {[0, 10, 20, 30, 40].map((i) => (
                <option key={i} value={i}>
                  {tracks[i].name} — {tracks[i].artist}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="blend-alpha"
              className="flex justify-between gap-3 text-sm text-neutral-300"
            >
              Prompt weight α <output>{alpha.toFixed(2)}</output>
            </label>
            <input
              id="blend-alpha"
              disabled={seed === ""}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={alpha}
              onChange={(event) => setAlpha(Number(event.target.value))}
              className="w-full mt-5 accent-green-400 disabled:opacity-30"
            />
            <p className="text-xs text-neutral-500 mt-2">
              0 = seed only · 1 = prompt only
            </p>
          </div>
        </div>
      </form>
      <div aria-live="polite" className="mt-8 border-t border-white/10 pt-6">
        {result ? (
          <>
            <div className="flex flex-wrap justify-between gap-3">
              <h3 className="text-xl font-light">
                50-track simulated playlist
              </h3>
              <span className="text-xs text-green-400">
                Ranked by acoustic similarity
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-3">
              Generated for “{result.prompt}”. Change the controls and
              synthesize again to refresh.
            </p>
            <ol className="mt-5 divide-y divide-white/10">
              {ranked.slice(0, expanded ? 50 : 8).map((track, i) => (
                <li key={track.name} className="flex items-center gap-4 py-4">
                  <span className="text-xs font-mono text-neutral-600 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-400/10 text-green-400">
                    <Music2 size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-200 break-words">
                      {track.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-green-400 shrink-0">
                    {(track.score * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setExpanded((value) => !value)}
              className="text-sm text-neutral-300 underline underline-offset-4 mt-5"
            >
              {expanded ? "Show first 8 tracks" : "Show all 50 tracks"}
            </button>
          </>
        ) : (
          <p className="text-neutral-500 text-sm">
            Your playlist will appear here. Try a prompt, shape the vector, and
            synthesize.
          </p>
        )}
      </div>
    </div>
  );
}

const snippets = [
  {
    name: "app.py",
    path: "server/src/app.py",
    note: "The API boundary validates the six feature values and combines prompt and seed intent before recommendation. Keep credentials and playlist write operations on the server.",
    code: `# Conceptual walkthrough: validation and linear fusion
from pydantic import BaseModel, Field

class Features(BaseModel):
    energy: float = Field(ge=0, le=1)
    danceability: float = Field(ge=0, le=1)
    tempo: float = Field(ge=60, le=180)
    valence: float = Field(ge=0, le=1)
    acousticness: float = Field(ge=0, le=1)
    instrumentalness: float = Field(ge=0, le=1)

def fuse(prompt_vector, seed_vector, alpha=0.5):
    return [alpha * p + (1 - alpha) * s
            for p, s in zip(prompt_vector, seed_vector)]`,
  },
  {
    name: "Main.js",
    path: "client/src/components/Main.js",
    note: "The client owns editable feature controls and submits an explicit snapshot. Disable repeated requests while waiting and render errors beside the form.",
    code: `// Conceptual walkthrough: submit the user's current vector
async function submitFeatures(event) {
  event.preventDefault();
  const response = await fetch('/post_features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...features, prompt, trackId }),
  });
  if (!response.ok) throw new Error('Playlist request failed');
  return response.json();
}`,
  },
  {
    name: "SearchEngine.js",
    path: "client/src/components/SearchEngine.js",
    note: "Seed search translates a selected result into a track ID. Encode the query, handle an empty result, and keep token management separate from rendering.",
    code: `// Conceptual walkthrough: search with an authorized session
async function searchTracks(query, accessToken, signal) {
  const params = new URLSearchParams({
    q: query, type: 'track', limit: '5',
  });
  const response = await fetch(
    'https://api.spotify.com/v1/search?' + params,
    { headers: { Authorization: 'Bearer ' + accessToken }, signal }
  );
  if (!response.ok) throw new Error('Track search failed');
  const data = await response.json();
  return data.tracks?.items ?? [];
}`,
  },
];
function CodeWalkthrough() {
  const [active, setActive] = useState(0);
  const [copyState, setCopyState] = useState("Copy code");
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippets[active].code);
      setCopyState("Copied");
    } catch {
      setCopyState("Copy unavailable");
    }
  }
  function changeTab(index: number) {
    setActive(index);
    setCopyState("Copy code");
  }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % 3
        : event.key === "ArrowLeft"
          ? (index + 2) % 3
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 2
              : null;
    if (next !== null) {
      event.preventDefault();
      changeTab(next);
      document.getElementById(`code-tab-${next}`)?.focus();
    }
  }
  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label="Implementation files"
        className="flex flex-wrap border-b border-white/10 gap-2"
      >
        {snippets.map((snippet, i) => (
          <button
            key={snippet.name}
            id={`code-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`code-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onKeyDown={(event) => onKeyDown(event, i)}
            onClick={() => changeTab(i)}
            className={`px-4 py-3 text-sm border-b-2 ${active === i ? "border-green-400 text-green-400" : "border-transparent text-neutral-500 hover:text-white"}`}
          >
            {snippet.name}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`code-panel-${active}`}
        aria-labelledby={`code-tab-${active}`}
        tabIndex={0}
      >
        <p className="text-neutral-400 leading-7 max-w-3xl my-6">
          {snippets[active].note}
        </p>
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <span className="text-xs text-neutral-500">
            Illustrative walkthrough · see repository for original code
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label={copyState}
            className="flex gap-2 items-center text-xs text-neutral-300"
          >
            {copyState === "Copied" ? <Check size={14} /> : <Copy size={14} />}
            <span role="status">{copyState}</span>
          </button>
        </div>
        <pre className="max-w-full overflow-x-auto rounded-xl border border-white/10 bg-neutral-950 p-5 text-xs sm:text-sm leading-7 text-neutral-300">
          <code>{snippets[active].code}</code>
        </pre>
        <div className="mt-5">
          <SourceLink href={`${repo}/blob/main/${snippets[active].path}`}>
            View {snippets[active].name} on GitHub
          </SourceLink>
        </div>
      </div>
    </div>
  );
}

export default function SpotifyProject() {
  return (
    <EngineeringArticle
      title="Spotify Playlist Generator: Translating Natural Language Nuance into High-Dimensional Acoustic Vectors"
      category="Machine Learning & Acoustic NLP"
      description="What does a late-night drive sound like? Connecting the language of a moment to six interpretable audio features, then blending intent with the music you already love."
      readingTime="9"
      sections={sections}
      metrics={[
        ["6", "Acoustic dimensions"],
        ["GPT-4", "Semantic vectorizer"],
        ["50-Track", "Dynamic synthesis"],
      ]}
    >
      <ArticleSection
        id="overview"
        number="01"
        title="The Cold-Start & Mood-Based Curation Dilemma"
      >
        <div className="research-prose max-w-3xl">
          <p>
            A new listener has little history for a recommendation system to
            use. Even an established listener can want something their history
            does not explain: music for a rainy study session, a demanding
            workout, or a drive after midnight. A genre label compresses those
            intentions too aggressively.
          </p>
          <p>
            This project treats natural language as another input to curation.
            GPT-4 translates a description into an acoustic feature proposal;
            editable controls give the listener a way to correct that
            interpretation. A seed track adds a concrete musical reference when
            words alone are ambiguous.
          </p>
          <p>
            The engineering question is how to connect these inputs without
            losing control over the result. An explicit vector makes the
            intermediate representation inspectable. You can see whether “quiet”
            was interpreted as low energy, high acousticness, or both.
          </p>
        </div>
      </ArticleSection>
      <ArticleSection
        id="acoustic-latent-space"
        number="02"
        title="The Mathematics of Acoustic Space & Vector Fusion"
      >
        <div className="research-prose max-w-3xl">
          <p>
            The representation is a six-dimensional feature space. It is
            interpretable rather than a learned text embedding: each axis has a
            musical meaning. Tempo uses beats per minute; the other controls use
            values between zero and one.
          </p>
        </div>
        <div
          role="math"
          aria-label="The six dimensional acoustic vector"
          className="research-formula font-serif"
        >
          <span className="font-bold">v</span> = [energy, danceability, tempo,
          valence, acousticness, instrumentalness]
        </div>
        <div className="research-prose max-w-3xl">
          <p>
            A prompt proposes one vector and a seed supplies another. Linear
            interpolation lets α express how strongly the description should
            influence the result. At α = 0.5, this is an arithmetic average; it
            is not a geometric mean.
          </p>
        </div>
        <div
          role="math"
          aria-label="Target vector equals alpha times prompt vector plus one minus alpha times seed vector"
          className="research-formula font-serif"
        >
          <b>v</b>
          <sub>target</sub> = α <b>v</b>
          <sub>prompt</sub> + (1 − α) <b>v</b>
          <sub>seed</sub>
        </div>
        <div className="research-prose max-w-3xl">
          <p>
            Fusion defines a target; cosine similarity ranks candidate tracks
            against it. Before computing similarity, scale tempo into the same
            numerical range as the other axes. Otherwise its magnitude dominates
            the dot product and obscures energy or valence.
          </p>
        </div>
        <div
          role="math"
          aria-label="Cosine similarity of target and track vectors"
          className="research-formula font-serif"
        >
          similarity(<b>v</b>, <b>t</b>) = (<b>v</b> · <b>t</b>) / (‖<b>v</b>‖ ‖
          <b>t</b>‖)
        </div>
        <p className="text-sm leading-7 text-neutral-500 max-w-3xl">
          The local studio scales tempo as (BPM − 60) / 120. Its keyword mapper
          and synthetic catalog demonstrate the ranking mechanics; the original
          project uses GPT-4 and Spotify services. A production curator would
          also consider diversity, duplicate versions, and transitions between
          songs.
        </p>
      </ArticleSection>
      <ArticleSection
        id="interactive-studio"
        number="03"
        title="Interactive AI Synthesis Studio"
      >
        <SynthesisStudio />
      </ArticleSection>
      <ArticleSection
        id="architecture"
        number="04"
        title="Architecture: FastAPI, OpenAI API, and Spotify Web API Flow"
      >
        <div className="research-prose max-w-3xl">
          <p>
            The original application separates intent capture in React from
            orchestration in FastAPI. The server translates the prompt, merges
            feature preferences, and requests recommendations. An authorized
            Spotify session supplies seed search and playlist synchronization.
          </p>
        </div>
        <ol className="mt-8 border-y border-white/10 divide-y divide-white/10">
          {[
            [
              "React / capture intent",
              "Collect the prompt, six controls, and optional track ID. Submit one coherent snapshot rather than firing a recommendation request on every slider movement.",
            ],
            [
              "FastAPI / validate input",
              "Check feature bounds and request shape. Treat a model response as untrusted structured input: reject missing keys, invalid genres, and values outside the supported range.",
            ],
            [
              "OpenAI / interpret semantics",
              "Map the description to a proposed acoustic vector. Keep this translation separate from vector fusion so users can inspect and override it.",
            ],
            [
              "Spotify / retrieve & save",
              "Use the fused target to curate candidates, then write the chosen tracks to an authorized playlist. Handle missing results, expired sessions, and service failures explicitly.",
            ],
          ].map(([title, text], i) => (
            <li
              key={title}
              className="grid md:grid-cols-[230px_1fr] gap-3 py-6"
            >
              <h3>
                0{i + 1} / {title}
              </h3>
              <p className="text-neutral-400 leading-7 max-w-2xl">{text}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs leading-6 text-neutral-500 mt-5">
          Architecture notes document the original integration. The portfolio
          studio runs entirely locally and does not authenticate with Spotify or
          OpenAI.
        </p>
      </ArticleSection>
      <ArticleSection
        id="visual-interface"
        number="05"
        title="Visual Interface & Authentic Assets Gallery"
      >
        <div className="research-prose max-w-3xl mb-8">
          <p>
            The original visual direction pairs a muted rooftop scene with a
            restrained listening interface. These authentic assets already use a
            near-monochrome palette in the project repository; they are
            displayed without color filters, at their original aspect ratios,
            directly to the figure edges.
          </p>
        </div>
        <div className="space-y-8">
          {[
            [
              "Picture1_web.jpg",
              "Original rooftop DJ scene used in the Spotify project",
              "Art direction / the original project backdrop.",
            ],
            [
              "home-page.jpeg",
              "Original Spotify Playlist Generator prompt and acoustic feature controls",
              "Interface / the original prompt and acoustic feature controls.",
            ],
          ].map(([file, alt, caption]) => (
            <figure key={file} className="research-figure">
              <img
                src={`/images/projects/spotify/${file}`}
                alt={alt}
                loading="lazy"
                className="block w-full h-auto object-contain"
              />
              <figcaption className="research-caption">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </ArticleSection>
      <ArticleSection
        id="source-code"
        number="06"
        title="Source Code Tabs & Implementation Walkthrough"
      >
        <CodeWalkthrough />
        <div className="mt-8">
          <SourceLink href={repo}>Explore the complete repository</SourceLink>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
