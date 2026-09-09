import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import CursorGlow from "@/components/CursorGlow";
import AuroraBackground from "@/components/AuroraBackground";
/* Second three.js scene — loaded on demand so it never touches the main bundle. */
const GamesGlobe = lazy(() => import("@/components/animated/GamesGlobe"));
import { profile } from "@/data/profile";
import { Dumbbell, UtensilsCrossed, Gamepad2, Trophy, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------------- */
/* BentoCard — A glassmorphic container with mouse-tracking hover spotlight  */
/* ------------------------------------------------------------------------- */
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md shadow-2xl ${className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 211, 238, 0.12),
              transparent 80%
            )
          `,
        }}
      />
      {/* Content Container */}
      <div className="relative h-full z-10 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- */
/* Hobbies Page — Premium Bento Box Layout                                   */
/* ------------------------------------------------------------------------- */
const Hobbies = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Beyond the Code | {profile.name}</title>
      </Helmet>

      <div className="relative min-h-screen bg-[#020617] overflow-x-hidden text-foreground">
        {/* Background Effects */}
        <CursorGlow />
        <AuroraBackground />

        {/* Floating Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 md:top-8 md:left-10 z-50 group flex items-center gap-2 text-foreground/50 hover:text-cyan-400 transition-colors font-mono text-sm uppercase tracking-widest bg-black/20 px-5 py-2.5 rounded-full backdrop-blur-lg border border-white/5 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Main Content */}
        <main className="relative z-10 flex flex-col items-center pt-32 pb-24 px-4 md:px-8 max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full mb-14 text-center md:text-left pl-2"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight pb-2">
              Beyond the Code
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/60 max-w-2xl font-light leading-relaxed">
              Because the best engineers are the ones who actually log off sometimes. Here's what I do when I'm not staring at an IDE.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full auto-rows-[minmax(320px,auto)]">
            
            {/* Fitness Card */}
            <BentoCard delay={0.1} className="md:col-span-5 p-8 flex justify-between group/card">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-wide">Fitness</h3>
                </div>
                <p className="text-foreground/70 leading-relaxed text-lg">
                  Most days after work you'll find me at the gym. It's the ultimate physical counter-balance to sitting at a desk all day building software.
                </p>
              </div>
              
              <div className="mt-10 flex items-end justify-between w-full">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-mono">Status</div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    <span className="font-medium text-emerald-400 text-sm">Active Daily</span>
                  </div>
                </div>
                <div className="text-7xl font-black text-white/5 transform group-hover/card:scale-110 group-hover/card:text-cyan-500/10 transition-all duration-700 ease-out origin-bottom-right">
                  GYM
                </div>
              </div>
            </BentoCard>

            {/* Culinary Card */}
            <BentoCard delay={0.2} className="md:col-span-7 p-8 overflow-hidden relative">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 bg-orange-500/10 rounded-2xl text-orange-400 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-wide">Culinary Arts</h3>
                  </div>
                  <p className="text-foreground/70 leading-relaxed text-lg max-w-lg">
                    I'm weirdly competitive about perfecting my pasta. Cooking is basically just chemistry and algorithms, but you get to eat the compiled result.
                  </p>
                </div>
                
                <div className="mt-10 flex gap-3 flex-wrap">
                  {['Carbonara', 'Cacio e Pepe', 'Aglio e Olio', 'Ragu'].map((dish, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-foreground/80 hover:bg-orange-500/10 hover:text-orange-300 transition-colors cursor-default">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Abstract decorative shapes */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
            </BentoCard>

            {/* Globe Card */}
            <BentoCard delay={0.3} className="md:col-span-8 min-h-[450px] relative p-0 overflow-hidden">
               <div className="absolute top-8 left-8 z-20">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-wide">World of Gaming</h3>
                  </div>
               </div>
               <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.8)_100%)] z-10" />
               <div className="w-full h-full pt-16 flex items-center justify-center">
                 <Suspense fallback={null}>
                   <GamesGlobe />
                 </Suspense>
               </div>
            </BentoCard>

            {/* Hollow Knight Card */}
            <BentoCard delay={0.4} className="md:col-span-4 p-0 overflow-hidden relative group/hk">
              <img 
                src="/images/hollow_knight.png" 
                alt="Hollow Knight" 
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/hk:scale-110 group-hover/hk:opacity-80 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <h4 className="text-3xl font-bold text-white mb-3">Hollow Knight</h4>
                <p className="text-white/70 text-base leading-relaxed">
                  Recently finished this masterpiece. It absolutely wrecked me. Vibing heavily with single-player experiences right now.
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-mono text-[11px] text-emerald-400/80 tracking-[0.2em] uppercase">
                    Hallownest Conquered
                  </span>
                  <span className="font-mono text-sm text-white/40">
                    ♥ ♥ ♥
                  </span>
                </div>
              </div>
            </BentoCard>

            {/* League of Legends Card */}
            <BentoCard delay={0.5} className="md:col-span-12 p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-500/20">
              <div 
                className="absolute right-0 top-0 w-full md:w-2/3 h-full bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.07] mix-blend-screen pointer-events-none" 
                style={{ maskImage: "linear-gradient(to right, transparent, black 80%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 80%)" }}
              />
              
              <div className="absolute -left-40 -top-40 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 md:w-2/3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-wide">The Ranked Era</h3>
                </div>
                <p className="text-foreground/70 leading-relaxed text-lg md:text-xl mb-8">
                  I used to be Diamond in League of Legends. That era taught me more about tilt management, mental fortitude, and team communication than any corporate standup meeting ever has. I've officially retired from ranked, but the competitive brain never really turns off.
                </p>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)] animate-pulse" />
                  Diamond Peak (Retired)
                </div>
              </div>
            </BentoCard>

          </div>
        </main>
      </div>
    </>
  );
};

export default Hobbies;
