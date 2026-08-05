import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Comparison from "./components/Comparison";
import Modules from "./components/Modules";
import DataAssets from "./components/DataAssets";
import Shift from "./components/Shift";
import Roadmap from "./components/Roadmap";
import CaseStudy from "./components/CaseStudy";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Comparison />
        <Modules />
        <DataAssets />
        <Shift />
        <Roadmap />
        <CaseStudy />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
