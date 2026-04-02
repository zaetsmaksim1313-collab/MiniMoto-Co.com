import { getProducts, getMakeItYoursImages } from "@/lib/products";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts();
  const makeItYoursImages = await getMakeItYoursImages();
  
  const featuredProducts = products.slice(0, 4);
  const accessories = products.filter(p => p.category.toLowerCase().includes('accessories') || p.category.toLowerCase().includes('accessory'));

  return <HomeClient featuredProducts={featuredProducts} accessories={accessories} allProducts={products} makeItYoursImages={makeItYoursImages} />;
}
