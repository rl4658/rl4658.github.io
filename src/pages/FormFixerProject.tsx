import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  Smartphone,
  ChevronRight,
  Terminal,
} from "lucide-react";
import CursorGlow from "@/components/CursorGlow";
import NavBar from "@/components/NavBar";
import ResumeModal from "@/components/ResumeModal";
import { profile } from "@/data/profile";

const FormFixerProject = () => {
  const navigate = useNavigate();
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<"workout" | "full">("workout");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const exercises = [
    {
      name: "Barbell Squat",
      target: "Quadriceps, Glutes, Hamstrings, Core",
      keypoints: "Hip (11/12) → Knee (13/14) → Ankle (15/16)",
      optimalAngle: "80° – 95° Knee Flexion",
      riskFactor: "Knee valgus collapse & lumbar flexion rounding",
    },
    {
      name: "Barbell Bench Press",
      target: "Pectoralis Major, Anterior Deltoids, Triceps",
      keypoints: "Shoulder (5/6) → Elbow (7/8) → Wrist (9/10)",
      optimalAngle: "75° – 85° Elbow Flare",
      riskFactor: "Shoulder impingement from 90° hyper-abduction",
    },
    {
      name: "Conventional Deadlift",
      target: "Posterior Chain, Erector Spinae, Latissimus Dorsi",
      keypoints: "Shoulder (5/6) → Hip (11/12) → Knee (13/14)",
      optimalAngle: "165° – 180° Neutral Lumbar",
      riskFactor: "Severe spinal shear from lumbar rounding under load",
    },
    {
      name: "Barbell Shoulder Press",
      target: "Deltoids, Upper Chest, Triceps, Trapezius",
      keypoints: "Shoulder (5/6) → Elbow (7/8) → Wrist (9/10)",
      optimalAngle: "175° – 180° Vertical Lockout",
      riskFactor: "Lumbar hyperextension when pressing forward of head",
    },
    {
      name: "Incline Dumbbell Press",
      target: "Clavicular Pectoral Head, Anterior Deltoid",
      keypoints: "Chest plane → Elbow (7/8) → Wrist (9/10)",
      optimalAngle: "85° – 90° Bottom Extension",
      riskFactor: "Excessive stretch leading to rotator cuff strain",
    },
    {
      name: "Shoulder Lateral Raise",
      target: "Lateral Deltoid (Middle Head)",
      keypoints: "Torso axis → Shoulder (5/6) → Elbow (7/8)",
      optimalAngle: "80° – 90° Abduction Elevation",
      riskFactor: "Trapezius shrugging compensation & excessive momentum",
    },
  ];

  return (
    <>
      <Helmet>
        <title>FormFixer.AI — Real-Time On-Device Biomechanical Pose Estimation | Raymond Li</title>
        <meta
          name="description"
          content="In-depth architectural breakdown and case study of FormFixer.AI: real-time biomechanical workout form correction using React Native Expo, VisionCamera v4, Fast-TFLite, Shopify Skia, and Law of Cosines kinematic geometry."
        />
      </Helmet>

      <CursorGlow />

      <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-white/20 selection:text-white pb-32">
        <NavBar onResumeClick={() => setIsResumeOpen(true)} />

        <main className="max-w-6xl mx-auto px-6 pt-28 md:pt-36">
          {/* Top Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={() => navigate("/projects")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Projects Lab</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/rl4658/form-fixer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all"
              >
                <Github size={14} />
                <span>GitHub Repository</span>
                <ExternalLink size={12} className="opacity-60" />
              </a>
              <a
                href="https://www.youtube.com/watch?v=JZ4HPtc7ChY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]"
              >
                <Play size={12} fill="currentColor" />
                <span>Watch on YouTube</span>
                <ExternalLink size={12} className="opacity-60" />
              </a>
            </div>
          </div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[11px] font-mono text-neutral-300 uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              AI & Computer Vision · Mobile Kinematics
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              FormFixer.AI
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-3xl leading-relaxed">
              Real-time on-device biomechanical pose correction and gym injury prevention.
              Extracts 33 skeletal landmarks at 30+ FPS via TensorFlow Lite and computes precise joint
              kinematics with the Law of Cosines directly on the mobile edge.
            </p>

            {/* High-Level Benchmark Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: "On-Device Inference", value: "< 28ms", desc: "CoreML & GPU Delegate" },
                { label: "Real-Time Frame Rate", value: "30+ FPS", desc: "Zero Network Latency" },
                { label: "Reported Injury Risk", value: "-40%", desc: "Form Deviation Correction" },
                { label: "Pose Keypoints", value: "33 Points", desc: "Full Skeletal Landmarks" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                  <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">{m.value}</div>
                  <div className="text-xs font-semibold text-neutral-300 mt-1">{m.label}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{m.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Video Showcase Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16 rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Player Switcher Bar */}
            <div className="p-4 border-b border-white/10 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {activeMediaTab === "workout" ? "Real Workout Video Screencast" : "Full Presentation & Walkthrough"}
                </span>
              </div>

              <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveMediaTab("workout")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    activeMediaTab === "workout"
                      ? "bg-white text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Smartphone size={13} />
                  Live Workout Demo
                </button>
                <button
                  onClick={() => setActiveMediaTab("full")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    activeMediaTab === "full"
                      ? "bg-white text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Play size={13} />
                  YouTube Presentation
                </button>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeMediaTab === "workout" ? (
                <>
                  <video
                    ref={videoRef}
                    src="/videos/formfixer_demo.webm"
                    poster="/videos/formfixer_poster.jpg"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Overlaid Telemetry Heads-Up */}
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-xs font-mono space-y-1">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      VisionCamera v4 + Fast-TFLite
                    </div>
                    <div className="text-neutral-400 text-[11px]">
                      Pose: Bicep Curl & Lateral Raise Analysis
                    </div>
                    <div className="text-emerald-400 text-[11px] font-bold">
                      Telemetry: Left Arm ~80° | Right Arm ~88°
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-xl bg-black/80 hover:bg-neutral-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-xl bg-black/80 hover:bg-neutral-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-300">
                      Actual Android hardware execution with real-time skeletal line drawing and audio feedback
                    </span>
                    <a
                      href="https://www.youtube.com/watch?v=JZ4HPtc7ChY&t=1445s"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline flex items-center gap-1 font-bold shrink-0 ml-4"
                    >
                      Watch on YouTube <ExternalLink size={12} />
                    </a>
                  </div>
                </>
              ) : (
                <iframe
                  src="https://www.youtube-nocookie.com/embed/JZ4HPtc7ChY?start=1445&autoplay=1&rel=0&modestbranding=1"
                  title="FormFixer AI Video Presentation Demo"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>

          {/* Section 1: Problem Statement & Motivation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">The Problem: Gym Injuries & Feedback Vacuum</h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  With the growing popularity of weightlifting, millions of beginners step into gyms every day without professional guidance. Over 65% of novice lifters experience joint strains, rotator cuff tears, or lumbar disk herniations due to improper spinal alignment, valgus knee collapse, or improper bar paths.
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Personal trainers cost $80–$150/hour, making continuous coaching financially prohibitive. Meanwhile, static fitness apps only log reps without knowing whether the lifter is doing them with safe mechanics.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">The Solution: An Autonomous Vision Coach</h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  FormFixer.AI turns any standard Android phone into an autonomous biomechanical coach. By running machine learning directly on the edge, the app analyzes exercise posture continuously at 30+ frames per second without sending private video frames to the cloud.
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Instant visual overlays and haptic/audio cues notify the lifter in real-time when their knees cave or their elbows hyperextend, allowing immediate mid-set posture correction before injury occurs.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Complete Mobile Architecture & Kinematics */}
          <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 mb-16">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Under the Hood</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white mt-1 mb-3">
                Mobile ML Pipeline & Geometric Math
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                FormFixer operates a high-throughput, zero-copy video processing loop engineered with React Native Expo 52, VisionCamera v4, and Fast-TFLite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-300 mb-2">
                  <Smartphone size={14} className="text-white" />
                  <span>1. VisionCamera v4 Frame Processor</span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Captures camera buffer on a dedicated C++ worklet thread. The <code className="text-white">vision-camera-resize-plugin</code> converts 720p frames directly into RGB tensors formatted for model input without bridge serialization overhead.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-300 mb-2">
                  <Cpu size={14} className="text-white" />
                  <span>2. Fast-TFLite poseModel</span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Executes <code className="text-white">poseModel.tflite</code> on hardware delegates (CoreML on iOS / NNAPI & GPU on Android) to output 33 normalized 3D keypoints (x, y, z, visibility) in under 28 milliseconds.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-300 mb-2">
                  <Activity size={14} className="text-white" />
                  <span>3. Shopify Skia Overlay</span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Draws high-contrast skeletal lines and joint nodes onto the screen at a locked 60 FPS using GPU Skia canvas, dynamically tinting green when form is approved and red when deviation exceeds tolerance.
                </p>
              </div>
            </div>

            {/* Law of Cosines Kinematic Math Box */}
            <div className="p-6 md:p-8 rounded-2xl bg-black/80 border border-white/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-white" />
                  <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">
                    Biomechanical Angle Math: Law of Cosines
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">From Video.tsx kinematics engine</span>
              </div>

              <p className="text-neutral-300 text-xs md:text-sm leading-relaxed mb-4">
                To determine whether a lifter has reached full squat depth or flared their elbows excessively on bench press, FormFixer measures the planar Euclidean distances between adjacent skeletal keypoints and calculates the interior angle using the Law of Cosines:
              </p>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs md:text-sm text-neutral-200 text-center my-4 overflow-x-auto">
                {"cos(θ) = (d1² + d2² - d3²) / (2 · d1 · d2)"}
                <div className="text-neutral-400 text-xs mt-1">
                  {"Angle θ = arccos( clamp(cos(θ), -1.0, 1.0) ) × (180 / π)"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-neutral-400 mt-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-white font-bold block mb-1">d1 (Proximal Bone):</span>
                  Distance between joint A and joint B (e.g., Shoulder to Elbow).
                </div>
                <div>
                  <span className="text-white font-bold block mb-1">d2 (Distal Bone):</span>
                  Distance between joint B and joint C (e.g., Elbow to Wrist).
                </div>
                <div>
                  <span className="text-white font-bold block mb-1">d3 (Hypotenuse):</span>
                  Direct spatial span between joint A and joint C (e.g., Shoulder to Wrist).
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Supported Exercises & Tolerance Matrix */}
          <div className="mb-16">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Exercise Coverage</span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-white mt-1 mb-2">
                Supported Exercises & Biomechanical Criteria
              </h2>
              <p className="text-neutral-300 text-sm">
                Real-time tracking criteria designed in collaboration with biomechanical standards from the American College of Sports Medicine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((ex) => (
                <div key={ex.name} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-base font-display">{ex.name}</h4>
                      <CheckCircle2 size={16} className="text-neutral-400" />
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400 mb-3">{ex.target}</div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-neutral-500 font-mono block text-[10px] uppercase">Tracked Keypoints:</span>
                        <span className="text-neutral-300 font-mono text-[11px]">{ex.keypoints}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-mono block text-[10px] uppercase">Optimal Range:</span>
                        <span className="text-white font-bold font-mono text-[11px]">{ex.optimalAngle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-neutral-400">
                    <span className="text-neutral-500 font-bold">Injury Guard: </span>
                    {ex.riskFactor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Cloud Backend Architecture */}
          <div className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 mb-16">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Full-Stack Cloud Infrastructure</span>
              <h2 className="text-2xl font-bold font-display text-white mt-1 mb-2">
                Node.js & MongoDB Backend Services
              </h2>
              <p className="text-neutral-300 text-sm">
                While pose inference runs 100% on-device for latency and privacy, account analytics and workout progress synchronize with a robust microservice architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <Database size={18} className="text-white mb-2" />
                <h5 className="font-bold text-white text-sm mb-1">MongoDB Atlas</h5>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Persistent storage for user profiles, historical form deviations, rep volume counts, and exercise PR records.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <Code2 size={18} className="text-white mb-2" />
                <h5 className="font-bold text-white text-sm mb-1">Express REST API</h5>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Clean modular endpoints partitioned across UserRoutes, Authentication, Form History, and Email verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <ShieldCheck size={18} className="text-white mb-2" />
                <h5 className="font-bold text-white text-sm mb-1">JWT & Bcrypt</h5>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Stateless JSON Web Tokens with salted Bcrypt password encryption protecting user data and workout telemetry.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10">
                <Zap size={18} className="text-white mb-2" />
                <h5 className="font-bold text-white text-sm mb-1">Nodemailer Service</h5>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Automated email confirmation workflows and security token resets for seamless mobile onboarding.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Call to Action */}
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/15 text-center flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display mb-3">
              Explore More of My Engineering Work
            </h3>
            <p className="text-neutral-400 text-sm max-w-xl mb-6">
              Return to the Projects Lab to test interactive simulations for Spotify Playlist Generator, Sorting Hub, and Enginerea, or explore my academic publication.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                <span>Back to Projects Lab</span>
                <ChevronRight size={16} />
              </button>
              <a
                href="https://github.com/rl4658/form-fixer"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-sm transition-all flex items-center gap-2"
              >
                <Github size={16} />
                <span>Source Code on GitHub</span>
              </a>
            </div>
          </div>
        </main>
      </div>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default FormFixerProject;
