import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import LandingPage from "@/pages/LandingPage";
import SharePage from "@/pages/SharePage";
import AboutPage from "@/pages/AboutPage";
import FaqPage from "@/pages/FaqPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Top-level router. SiteLayout wraps every page with Navbar + Footer
// so individual pages don't re-render shell chrome on navigation.
// The share route lives at BOTH `/r/:id` (short) and `/ride/:id`
// (long) so links from any of the share entry points (in-app share
// sheet uses /ride/, deep-link uses /r/) resolve to the same page —
// no broken-link tax for the choice of host string.
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/r/:rideId" element={<SharePage />} />
        <Route path="/ride/:rideId" element={<SharePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
