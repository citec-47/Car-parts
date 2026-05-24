export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconKey: string | null;
  displayOrder: number;
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  brand: string | null;
  priceCents: number;
  salePriceCents: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isHotDeal: boolean;
  hotDealEndsAt: Date | null;
  categorySlug: string;
  images: ProductImage[];
};

export type VehicleMake = { id: string; name: string; slug: string };
export type VehicleModel = { id: string; makeId: string; name: string; slug: string };
export type VehicleYearRow = { id: string; modelId: string; year: number };
export type VehicleEngineRow = { id: string; yearId: string; name: string };

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string | null;
  unitPriceCents: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
