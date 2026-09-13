import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Hero } from "@/components/Hero";
import { Brands } from "@/components/Brands";
import { InAction } from "@/components/InAction";
import { Specs } from "@/components/Specs";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { GrandFinale } from "@/components/GrandFinale";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <main className="min-h-screen">
                <div className="flex flex-col min-h-screen">
                    <Hero />
                    <Brands />
                    <InAction />
                    <Specs />
                    <HowItWorks />
                    <SocialProof />
                    <GrandFinale />
                    <Footer />
                </div>
            </main>
        </>
    );
}
