import { Booking } from "@/components/sections/Booking";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Promotions } from "@/components/sections/Promotions";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyUs } from "@/components/sections/WhyUs";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <WhyUs />
        <Promotions />
        <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
