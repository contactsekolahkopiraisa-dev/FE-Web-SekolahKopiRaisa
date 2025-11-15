"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProduct } from "@/app/utils/product";
import { ProductItem } from "@/app/types/productType";
import { formatCurrency } from "@/app/utils/helper";

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      const response = await fetchAllProduct();
      const item = response.data.find((p: any) => p.id === id);
      if (item) {
        setProduct({
          id: item.id,
          image: item.image,
          name: item.name,
          price: item.price,
          stock: item.inventory?.stock || 0,
          description: item.description,
          weight: item.weight,
          sold: item.sold || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          partner: {
            id: item.partner?.id,
            name: item.partner?.name,
            owner_name: item.partner?.owner_name,
            phone_number: item.partner?.phone_number,
          },
        });
      }
      setLoading(false);
    };
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
        {/* Product Header Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-tertiary rounded-xl shadow-lg overflow-hidden">
          {/* Image Skeleton */}
          <div className="bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-gray-300 rounded-xl w-full h-96"></div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col p-6 justify-between">
            <div>
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
              {/* Partner Name Skeleton */}
              <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
              
              {/* Price Skeleton */}
              <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-200 px-3 py-2 rounded-xl">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-gray-200 px-3 py-2 rounded-xl">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-gray-200 px-3 py-2 rounded-xl">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-gray-200 px-3 py-2 rounded-xl">
                  <div className="h-3 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
          <div className="h-6 bg-gray-300 rounded mb-3 w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        {/* Partner Information Skeleton */}
        <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
          <div className="h-6 bg-gray-300 rounded mb-3 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Metadata Skeleton */}
        <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
          <div className="h-6 bg-gray-300 rounded mb-3 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-1/2"></div>
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return <div className="p-6 text-center">Produk tidak ditemukan.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Product Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 bg-tertiary rounded-xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="bg-gray-100 flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-xl w-full h-full max-h-96 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col p-6 justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-800 uppercase">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mb-4">by {product.partner?.name}</p>

            <p className="text-lg font- text-amber-900 mb-2">
              {formatCurrency(product.price ?? 0)}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded-xl text-sm font-medium text-center">
                <div className="text-xs text-green-600">Stok</div>
                <div className="font-medium">{product.stock}</div>
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium text-center">
                <div className="text-xs text-blue-600">Terjual</div>
                <div className="font-medium">{product.sold}</div>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded-xl text-sm font-medium text-center">
                <div className="text-xs text-purple-600">Berat</div>
                <div className="font-medium">{product.weight ? `${product.weight} gr` : 'N/A'}</div>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-xl text-sm font-medium text-center">
                <div className="text-xs text-yellow-600">Grade</div>
                <div className="font-medium">Komersil</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
        <h2 className="text-lg font-medium mb-3 text-gray-800">Deskripsi Produk</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Partner Information */}
      <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
        <h2 className="text-lg font-medium mb-3 text-gray-800">Informasi Mitra</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Nama Mitra</label>
            <p className="text-gray-800 font-medium">{product.partner?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Pemilik</label>
            <p className="text-gray-800 font-medium">{product.partner?.owner_name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">No. Telepon</label>
            <p className="text-gray-800 font-medium">{product.partner?.phone_number || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="bg-tertiary rounded-xl shadow-lg mt-8 p-6">
        <h2 className="text-lg font-medium mb-3 text-gray-800">Informasi Tambahan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-600">Dibuat pada</label>
            <p className="text-gray-800 font-medium">
              {product.createdAt ? new Date(product.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-gray-600">Terakhir diperbarui</label>
            <p className="text-gray-800 font-medium">
              {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}