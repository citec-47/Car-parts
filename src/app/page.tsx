import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { WhyBuyFromUs } from "@/components/home/WhyBuyFromUs";
import { FeaturedEngineOfTheWeek } from "@/components/home/FeaturedEngineOfTheWeek";
import { ShopByMake } from "@/components/home/ShopByMake";
import { PopularCategories } from "@/components/home/PopularCategories";
import { HotDeals } from "@/components/home/HotDeals";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OfferBar } from "@/components/home/OfferBar";
import { getAllProducts, getFeaturedProducts, getHotDealProducts } from "@/lib/data";

export default async function Home() {
  const [featured, hotDeals, all] = await Promise.all([
    getFeaturedProducts(),
    getHotDealProducts(),
    getAllProducts(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <FeaturedEngineOfTheWeek />
      <WhyBuyFromUs />
      <ShopByMake />
      <PopularCategories />
      <section className="mx-auto max-w-7xl px-4 mt-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <HotDeals products={hotDeals.length ? hotDeals : all.slice(0, 1)} />
          <FeaturedProducts products={featured.length ? featured : all} />
        </div>
      </section>
      <OfferBar />
    </>
  );
}
