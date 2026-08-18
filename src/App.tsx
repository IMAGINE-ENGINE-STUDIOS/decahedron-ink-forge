import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Research from "./pages/Research";
import Deck from "./pages/Deck";
import SlideDeck from "./pages/SlideDeck";
import DataRoom from "./pages/DataRoom";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Test from "./pages/Test";
import DealFlow from "./pages/DealFlow";
import LPs from "./pages/LPs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/research" element={<Research />} />
          <Route path="/deck" element={<Deck />} />
          <Route path="/slidedeck" element={<SlideDeck />} />
          <Route path="/dataroom" element={<DataRoom />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/test" element={<Test />} />
          <Route path="/dealflow" element={<DealFlow />} />
          <Route path="/LPs" element={<LPs />} />
          <Route path="/lps" element={<LPs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
