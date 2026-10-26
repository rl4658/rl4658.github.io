import { useState } from "react";
import EngineeringArticle, {
  ArticleSection,
  SourceLink,
} from "@/components/EngineeringArticle";

const repo = "https://github.com/rl4658/form-fixer";
const sections = [
  ["challenge", "01 / The challenge"],
  ["edge-architecture", "02 / Edge architecture"],
  ["visual-demo", "03 / Visual demo"],
  ["vector-math", "04 / Vector math"],
  ["benchmarks", "05 / Benchmarks"],
  ["code-review", "06 / Source code"],
] as const;

function PoseLab() {
  const [angle, setAngle] = useState(88);
  const inRange = angle >= 80 && angle <= 95;
  const radians = (angle * Math.PI) / 180;
  const hip = {
    x: 190 - 100 * Math.cos(radians),
    y: 220 - 100 * Math.sin(radians),
  };
  const color = inRange ? "#4ade80" : "#fbbf24";
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
      <figure className="min-w-0">
        <picture className="block max-w-[340px] mx-auto overflow-hidden rounded-2xl border border-white/10">
          <source srcSet="/images/formfixer_preview.webp" type="image/webp" />
          <img
            src="/images/formfixer_preview.gif"
            alt="Recorded FormFixer workout tracking with skeletal landmarks, arm angles, rep counting and corrective feedback"
            className="block w-full h-auto object-contain"
            loading="lazy"
          />
        </picture>
        <figcaption className="mt-4 text-xs text-neutral-500 leading-6 text-center">
          Original app recording · natural camera colors
          <br />
          Arm tracking and rep feedback on a mobile device.
        </figcaption>
      </figure>
      <div className="min-w-0">
        <p className="editorial-eyebrow">
          Try the geometry / interactive schematic
        </p>
        <h3 className="text-2xl font-light mt-4">When is a rep deep enough?</h3>
        <p className="text-neutral-400 leading-7 mt-4">
          Move the knee angle to see how the feedback changes. This side-view
          schematic explains the depth rule; the phone recording shows the
          original app.
        </p>
        <svg
          viewBox="0 0 360 310"
          role="img"
          aria-label={`Squat schematic at ${angle} degrees knee flexion`}
          className="w-full h-auto mt-4"
        >
          <path d="M40 280H320" stroke="#404040" />
          <path
            d={`M${hip.x - 30} ${hip.y - 80} L${hip.x} ${hip.y} L190 220 L290 220`}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={hip.x - 34} cy={hip.y - 100} r="16" fill="#a3a3a3" />
          {[
            [hip.x, hip.y],
            [190, 220],
            [290, 220],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="7"
              fill={color}
              stroke="#050505"
              strokeWidth="2"
            />
          ))}
          <path
            d={`M225 220 A35 35 0 0 0 ${190 - 35 * Math.cos(radians)} ${220 - 35 * Math.sin(radians)}`}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          <text x="225" y="180" fill={color} fontSize="22">
            {angle}°
          </text>
          <text x="40" y="304" fill="#a3a3a3" fontSize="12">
            HIP → KNEE → ANKLE / SIDE VIEW
          </text>
        </svg>
        <label
          htmlFor="knee-angle"
          className="flex justify-between gap-4 text-sm text-neutral-300"
        >
          Knee angle <output>{angle}°</output>
        </label>
        <input
          id="knee-angle"
          type="range"
          min="45"
          max="140"
          value={angle}
          onChange={(event) => setAngle(Number(event.target.value))}
          className="w-full mt-4 accent-green-400"
        />
        <p role="status" className="mt-4 text-sm" style={{ color }}>
          {inRange
            ? "Depth check: within the demo's 80°–95° band."
            : angle > 95
              ? "Depth check: lower further to enter the demo band."
              : "Depth check: below the demo band; return with control."}
        </p>
      </div>
    </div>
  );
}

export default function FormFixerProject() {
  return (
    <EngineeringArticle
      title="FormFixer.AI: Real-Time Biomechanical Pose Correction on Mobile at 60 FPS"
      category="Computer Vision & Edge AI"
      description="From camera frames to joint geometry: building a private, on-device feedback loop that keeps the overlay responsive while pose inference runs independently."
      readingTime="8"
      sections={sections}
      metrics={[
        ["< 18ms", "Inference latency"],
        ["60 FPS", "Skia overlay"],
        ["100% Offline", "Edge privacy"],
      ]}
    >
      <p className="text-xs leading-6 text-neutral-500">
        Performance figures above are engineering targets for the edge pipeline.
        The 60 FPS target describes rendering, independently of inference
        throughput; no device-specific benchmark trace is published here.
      </p>
      <ArticleSection
        id="challenge"
        number="01"
        title="The Problem: Mobile Latency vs. Biomechanical Accuracy"
      >
        <div className="research-prose max-w-3xl">
          <p>
            A workout coach has a narrow feedback window. By the time a frame
            has traveled to a server, been processed, and returned to the phone,
            the lifter may already be in the next phase of the movement.
            Feedback needs to stay close to the camera, both in time and in
            where computation happens.
          </p>
          <p>
            That creates a second constraint: a high frame rate means little if
            the tracked joints jitter or disappear under occlusion. The useful
            engineering objective is a stable joint estimate with a known
            timestamp, followed by a small, interpretable geometric rule.
            Low-confidence landmarks should suspend feedback instead of
            producing a confident correction.
          </p>
          <p>
            FormFixer explores this tradeoff through on-device pose estimation,
            joint-angle checks, and immediate visual cues. Camera frames remain
            local. The browser preview below is a recorded demonstration of the
            application.
          </p>
        </div>
      </ArticleSection>
      <ArticleSection
        id="edge-architecture"
        number="02"
        title="The Edge Architecture: VisionCamera, MoveNet, and GPU Canvas"
      >
        <div className="research-prose max-w-3xl">
          <p>
            The edge design separates camera capture, model execution, and
            drawing. VisionCamera exposes frames to a worklet; resizing produces
            the RGB tensor expected by a TensorFlow Lite model. A MoveNet
            configuration supplies 17 two-dimensional landmarks, including the
            shoulder, elbow, hip, knee, and ankle pairs needed for the rules
            described here.
          </p>
          <p>
            The inference loop publishes the latest confident pose to a Skia
            overlay. Drawing can continue at the display refresh rate while the
            model processes a new frame. Reusing a pose is a rendering decision,
            so timestamps matter: an old skeleton must not be presented as a
            fresh measurement.
          </p>
        </div>
        <ol className="mt-8 border-y border-white/10 divide-y divide-white/10">
          {[
            [
              "Capture & resize",
              "VisionCamera → RGB tensor. Preserve orientation and the crop transform so model coordinates map back onto the preview.",
            ],
            [
              "Infer & gate",
              "Fast-TFLite → MoveNet landmarks. Reject low-confidence joints and avoid queuing stale frames when inference falls behind.",
            ],
            [
              "Compute & draw",
              "Joint vectors → angle checks → Skia. Smooth short-term jitter, then render the newest accepted pose without blocking camera capture.",
            ],
          ].map(([title, text], i) => (
            <li
              key={title}
              className="grid sm:grid-cols-[180px_1fr] gap-3 py-6"
            >
              <h3 className="text-neutral-200">
                0{i + 1} / {title}
              </h3>
              <p className="text-neutral-400 leading-7 max-w-2xl">{text}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs leading-6 text-neutral-500 mt-5">
          This section describes the MoveNet edge architecture. The archived app
          recording is a visual reference, not a measurement of that model or
          its frame rate.
        </p>
      </ArticleSection>
      <ArticleSection
        id="visual-demo"
        number="03"
        title="Visual Live Demo & Biomechanical Feedback"
      >
        <PoseLab />
        <div className="mt-8">
          <SourceLink href="https://www.youtube.com/watch?v=JZ4HPtc7ChY&t=1445s">
            Watch the full project walkthrough
          </SourceLink>
        </div>
      </ArticleSection>
      <ArticleSection
        id="vector-math"
        number="04"
        title="The Mathematics of Pose Correction"
      >
        <div className="research-prose max-w-3xl">
          <p>
            For a joint B between landmarks A and C, construct u = A − B and v =
            C − B. Their normalized dot product gives the cosine of the included
            angle. Clamp the ratio into [−1, 1] before applying arccos, and
            reject near-zero vector lengths to avoid numerical instability.
          </p>
        </div>
        <div
          className="research-formula font-serif"
          role="math"
          aria-label="Cosine theta equals u dot v divided by the product of their lengths"
        >
          cos θ ={" "}
          <span className="inline-flex flex-col align-middle text-center mx-2">
            <span className="border-b border-neutral-500 pb-1">u · v</span>
            <span className="pt-1">‖u‖ ‖v‖</span>
          </span>
          <span className="text-neutral-500">
            ; θ = arccos(cos θ) × 180 / π
          </span>
        </div>
        <div className="research-prose max-w-3xl">
          <p>
            Image coordinates must be restored to a common aspect-correct scale
            before calculating angles. A normalized x-coordinate and
            y-coordinate represent different physical distances on a non-square
            preview. Perspective and camera placement still affect the resulting
            two-dimensional estimate.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {[
            [
              "Barbell Squat",
              "80°–95° knee-angle band",
              "Hip → knee → ankle defines the included knee angle used by the depth schematic. Clinical flexion conventions may instead report 180° minus this angle; the convention must be explicit.",
            ],
            [
              "Bench Press",
              "75°–85° elbow-flare band",
              "Elbow flare describes the upper arm relative to the torso, not the shoulder–elbow–wrist flexion angle. These require separate vector definitions and a suitable camera view.",
            ],
            [
              "Deadlift",
              "Lumbar neutrality",
              "Track torso and hip alignment as a coarse posture cue. MoveNet does not resolve individual lumbar vertebrae, so a shoulder–hip–knee angle cannot establish spinal neutrality.",
            ],
          ].map(([title, band, text]) => (
            <div
              key={title}
              className="grid md:grid-cols-[220px_1fr] gap-4 border-t border-white/10 pt-6"
            >
              <div>
                <h3 className="text-lg">{title}</h3>
                <p className="text-sm text-green-400 mt-2">{band}</p>
              </div>
              <p className="text-neutral-400 leading-7 max-w-2xl">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-500 leading-7 max-w-3xl">
          The angle bands illustrate configurable software rules. They are not
          universal lifting prescriptions or validated injury-risk thresholds;
          anatomy, exercise variation, and camera position affect
          interpretation.
        </p>
      </ArticleSection>
      <ArticleSection
        id="benchmarks"
        number="05"
        title="Edge Benchmarks & Hardware Profiling"
      >
        <div className="research-prose max-w-3xl">
          <p>
            A 60 Hz display has about 16.7 ms per refresh. An inference budget
            below 18 ms can still exceed that interval, which is why model
            execution and overlay rendering must be decoupled. End-to-end
            latency also includes capture, preprocessing, synchronization, and
            display.
          </p>
          <p>
            A useful device profile records the handset, delegate, model
            variant, input resolution, warm-up period, and thermal state.
            Capture median and p95 latency over sustained sets; a fast cold run
            says little about a hot phone five minutes into a session.
          </p>
        </div>
        <div className="overflow-x-auto mt-8">
          <table className="w-full text-sm text-left">
            <caption className="text-left text-xs text-neutral-500 mb-4">
              Profiling plan / targets, not recorded device measurements
            </caption>
            <thead className="border-b border-white/10">
              <tr>
                {["Stage", "Budget / constraint", "What to inspect"].map(
                  (t) => (
                    <th key={t} className="py-4 pr-5 font-medium">
                      {t}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="text-neutral-400">
              {[
                [
                  "Pose inference",
                  "< 18 ms target",
                  "Warm median, p95, delegate fallback",
                ],
                [
                  "Skia rendering",
                  "60 FPS target",
                  "Dropped frames, frame-time variance",
                ],
                [
                  "Frame scheduling",
                  "Newest frame first",
                  "Queue depth, capture-to-overlay age",
                ],
                [
                  "Privacy",
                  "100% offline processing",
                  "Camera-frame network traffic",
                ],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-white/10">
                  {row.map((c) => (
                    <td key={c} className="py-5 pr-5 leading-6">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArticleSection>
      <ArticleSection
        id="code-review"
        number="06"
        title="Source Code & Technical Highlights"
      >
        <div className="research-prose max-w-3xl">
          <p>
            The source review starts at the boundary between a frame and a pose.
            Check tensor dimensions, the keypoint index map, confidence gating,
            and preview transforms together. A model change can silently
            invalidate all four.
          </p>
          <p>
            Next, inspect the angle calculation and rep-state transitions.
            Separate entering a target band from leaving it, and add hysteresis
            so a noisy landmark does not count the same repetition twice. Keep
            feedback rules independent from the rendering layer so they can be
            exercised with recorded poses.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-6">
          <SourceLink href={repo}>Explore FormFixer on GitHub</SourceLink>
          <SourceLink href={`${repo}#readme`}>
            Setup & implementation notes
          </SourceLink>
        </div>
      </ArticleSection>
    </EngineeringArticle>
  );
}
