import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProductById(params.id);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
