import { Hero } from "@/components/Hero";
import { Specs } from "@/components/Specs";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { GrandFinale } from "@/components/GrandFinale";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Specs />
      <HowItWorks />
      <SocialProof />
      <GrandFinale />
      <Footer />
    </div>
  );
}

