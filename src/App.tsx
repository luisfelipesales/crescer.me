import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import NossaAbordagem from "./pages/NossaAbordagem";
import NossaEquipe from "./pages/NossaEquipe";
import TrabalheConosco from "./pages/TrabalheConosco";
import Contato from "./pages/Contato";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Agendar from "./pages/Agendar";
import Consultas from "./pages/Consultas";
import Perfil from "./pages/Perfil";
import VideoCall from "./pages/VideoCall";
import Prontuario from "./pages/Prontuario";
import Chat from "./pages/Chat";
import FAQ from "./pages/FAQ";
import Emergencia from "./pages/Emergencia";
import Blog from "./pages/Blog";
import Pagamentos from "./pages/Pagamentos";
import TherapistPortal from "./pages/TherapistPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/abordagem" element={<NossaAbordagem />} />
            <Route path="/equipe" element={<NossaEquipe />} />
            <Route path="/carreiras" element={<TrabalheConosco />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/entrar" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/video/:appointmentId" element={<VideoCall />} />
            <Route path="/prontuario/:patientId" element={<Prontuario />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/emergencia" element={<Emergencia />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/terapeuta" element={<TherapistPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
