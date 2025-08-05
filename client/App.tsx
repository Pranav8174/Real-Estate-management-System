import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import FeaturedProperties from "./components/FeaturedProperties";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerDashboard from "./pages/SellerDashboard";
import AddProperty from "./pages/AddProperty";
import BuyerDashboard from "./pages/BuyerDashboard";
import NotFound from "./pages/NotFound";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute requiredRole="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/add-property"
              element={
                <ProtectedRoute requiredRole="seller">
                  <AddProperty />
                </ProtectedRoute>
              }
            />

            {/* Protected Buyer Routes */}
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
            {/* Featured Properties */}
            <Route path="/featured-properties" element={<FeaturedProperties />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
