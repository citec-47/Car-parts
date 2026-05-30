import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { VehicleFinder } from "@/components/home/VehicleFinder";
import { WhyBuyFromUs } from "@/components/home/WhyBuyFromUs";
import { FeaturedEngineOfTheWeek } from "@/components/home/FeaturedEngineOfTheWeek";
import { ShopByMake } from "@/components/home/ShopByMake";
import { PopularCategories } from "@/components/home/PopularCategories";
import { HotDeals } from "@/components/home/HotDeals";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OfferBar } from "@/components/home/OfferBar";
import {
  getAllProducts,
  getAllVehicleModels,
  getAllVehicleYears,
  getFeaturedProducts,
  getHotDealProducts,
  getVehicleEngines,
  getVehicleMakes,
} from "@/lib/data";

export default async function Home() {
  const [makes, models, years, engines, featured, hotDeals, all] = await Promise.all([
    getVehicleMakes(),
    getAllVehicleModels(),
    getAllVehicleYears(),
    getVehicleEngines(),
    getFeaturedProducts(),
    getHotDealProducts(),
    getAllProducts(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <div id="vehicle-finder">
        <VehicleFinder makes={makes} models={models} years={years} engines={engines} />
      </div>
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
