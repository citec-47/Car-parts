import { HeroGrid } from "@/components/home/HeroGrid";
import { VehicleFinder } from "@/components/home/VehicleFinder";
import { WhyBuyFromUs } from "@/components/home/WhyBuyFromUs";
import { FeaturedEngineOfTheWeek } from "@/components/home/FeaturedEngineOfTheWeek";
import { ShopByMake } from "@/components/home/ShopByMake";
import { PopularCategories } from "@/components/home/PopularCategories";
import { PromoBanners } from "@/components/home/PromoBanners";
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
      <HeroGrid />
      <VehicleFinder makes={makes} models={models} years={years} engines={engines} />
      <WhyBuyFromUs />
      <FeaturedEngineOfTheWeek />
      <ShopByMake />
      <PopularCategories />
      <PromoBanners />
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
