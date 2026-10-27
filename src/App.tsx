import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/* Hobbies and Projects pull in specialized interactive engines — keep them code-split */
const Hobbies = lazy(() => import("./pages/Hobbies"));
const Publication = lazy(() => import("./pages/Publication"));
const Projects = lazy(() => import("./pages/Projects"));
const FormFixerProject = lazy(() => import("./pages/FormFixerProject"));
const SpotifyProject = lazy(() => import("./pages/SpotifyProject"));
const SortingHubProject = lazy(() => import("./pages/SortingHubProject"));
const EnginereaProject = lazy(() => import("./pages/EnginereaProject"));
const ChatroomProject = lazy(() => import("./pages/ChatroomProject"));

const queryClient = new QueryClient();

/* Reports SPA navigations to GA4 / GTM (no-op unless an ID is configured). */
const RouteTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPageView(pathname + search);
  }, [pathname, search]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteTracker />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hobbies" element={<Hobbies />} />
            <Route path="/publication" element={<Publication />} />
            <Route path="/publications" element={<Publication />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/form-fixer" element={<FormFixerProject />} />
            <Route path="/projects/spotify-playlist-generator" element={<SpotifyProject />} />
            <Route path="/projects/spotify" element={<SpotifyProject />} />
            <Route path="/projects/sorting-hub" element={<SortingHubProject />} />
            <Route path="/projects/sorting" element={<SortingHubProject />} />
            <Route path="/projects/enginerea" element={<EnginereaProject />} />
            <Route path="/projects/bobby-enginerea" element={<EnginereaProject />} />
            <Route path="/projects/chatroom-whisperers" element={<ChatroomProject />} />
            <Route path="/projects/chatroom" element={<ChatroomProject />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
