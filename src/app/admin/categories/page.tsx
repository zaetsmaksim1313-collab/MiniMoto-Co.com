import { getProducts } from "@/lib/products";
import CategoryOrderClient from "./CategoryOrderClient";

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage() {
    const products = await getProducts();
    
    return (
        <div>
            <CategoryOrderClient initialProducts={products} />
        </div>
    );
}
