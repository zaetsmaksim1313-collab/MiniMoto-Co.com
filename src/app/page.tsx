import { getProducts, getMakeItYoursImages } from "@/lib/products";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts();
  const makeItYoursImages = await getMakeItYoursImages();
  
  const featuredProducts = products.filter(p => p.category === 'Emotos');
  const ebikes = products.filter(p => p.category === 'E Bikes');
  const pedalBikes = products.filter(p => p.category === 'Pedal Bikes');
  const accessories = products.filter(p => p.category.toLowerCase().includes('accessories') || p.category.toLowerCase().includes('accessory'));

  return <HomeClient featuredProducts={featuredProducts} ebikes={ebikes} pedalBikes={pedalBikes} accessories={accessories} allProducts={products} makeItYoursImages={makeItYoursImages} />;
}
