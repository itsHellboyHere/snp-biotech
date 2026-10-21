import Hero from "@/components/hero/Hero";
import PlantCategories from "@/components/categories/PlantCategories/PlantCategories";
import Bagh from "@/components/bagh/Bagh";
import GrowTeaser from "@/components/grow/GrowTeaser/GrowTeaser";
import TrustRings from "@/components/trust/TrustRings/TrustRings";
import BaghPlanner from "@/components/planner/BaghPlanner/BaghPlanner";
import OrderChat from "@/components/order/OrderChat/OrderChat";
import SeasonWheel from "@/components/seasons/SeasonWheel/SeasonWheel";

// Home — text language apne aap LangProvider se aata hai (/ = Hindi, /en = English)
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <PlantCategories />
      <Bagh />
      <TrustRings />
      <GrowTeaser />
      <BaghPlanner />
      <OrderChat />
      <SeasonWheel />
    </main>
  );
}
