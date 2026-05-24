import {
  Car,
  Cpu,
  Lightbulb,
  Gauge,
  Wrench,
  CircleDot,
  Sparkles,
  CircleEqual,
  Hammer,
  Cog,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "./constants";

export const CATEGORY_ICONS: Record<IconKey, LucideIcon> = {
  "body-parts": Car,
  electronics: Cpu,
  lightings: Lightbulb,
  performance: Gauge,
  "repair-parts": Wrench,
  suspensions: CircleEqual,
  accessories: Sparkles,
  "wheels-tires": CircleDot,
  "tools-garage": Hammer,
  "engine-drivetrain": Cog,
};
