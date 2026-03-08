import { getProducts } from "@/lib/products";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return <HomeClient featuredProducts={featuredProducts} />;
}
