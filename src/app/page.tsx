import { getProducts } from "@/lib/products";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);
  const accessories = products.filter(p => p.category.toLowerCase().includes('accessories') || p.category.toLowerCase().includes('accessory'));

  return <HomeClient featuredProducts={featuredProducts} accessories={accessories} allProducts={products} />;
}
