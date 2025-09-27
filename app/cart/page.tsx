"use client";

import { useEffect, useState } from "react";
import CartItem, { CartItemData } from "../components/CartCard";
import { formatCurrency } from "../utils/helper";
import { deleteCart, fetchAllCart } from "../utils/cart";
import { useRouter } from "next/navigation";
import { useCartStore } from "../stores/cartStore";
import Popup from "../components/Popup";
import CartCard from "../components/CartCard";
import { Partner } from "../types/partnerType";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ShoppingCartIcon } from "lucide-react";

// Define the structure of the API response for better type safety
interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  partner: Partner;
  weight?: number; // Optional field for product weight
  inventory: ApiInventory;
}

interface ApiCartItem {
  id: number;
  cart_id: number;
  products_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: ApiProduct;
}

// This is what fetchAllCart is expected to return (the 'data' part of the original API response)
interface FetchedCartData {
  message: string;
  data: {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    cartItems: ApiCartItem[];
  }[];
}

interface ApiInventory {
  stock: number;
}

// Komponen utama Keranjang Belanja
export default function ShoppingCart(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    useCartStore.getState().setCartItems(selectedItems);
    router.push("/checkout");
  };

  const handleDelete = async (productId: number) => {
    try {
      const response = await deleteCart(productId);

      setCartItems((currentItems) =>
        currentItems.filter((item) => item.products_id !== productId)
      );

      setMessage(response.message);
      setPopupType("success");
      setShowPopup(true);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error: any) {
      console.error("Delete error:", error);
      setMessage(error.message || "Terjadi kesalahan saat menghapus.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const popupData = sessionStorage.getItem("popup");
    if (popupData) {
      const { message, type } = JSON.parse(popupData);
      setMessage(message);
      setPopupType(type);
      setShowPopup(true);
      sessionStorage.removeItem("popup");
    }
  }, []);
  useEffect(() => {
    const loadCartData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call your imported function
        const result: FetchedCartData = await fetchAllCart();

        console.log(result);

        // 'result' is now the actual data returned by response.data in fetchAllCart
        // (e.g., { message: "...", data: [ ... ] })
        if (
          result &&
          result.data &&
          result.data.length > 0 &&
          result.data[0].cartItems
        ) {
          const fetchedApiCartItems = result.data[0].cartItems;
          const transformedItems: CartItemData[] = fetchedApiCartItems.map(
            (apiItem) => {
              const productInventory = apiItem.product.inventory.stock;
              const databaseQuantity = apiItem.quantity;

              // Adjust the quantity:
              // - It must be at least 0 (Math.max(0, ...))
              // - It must not exceed the product's inventory (Math.min(..., productInventory))
              const adjustedQuantity = Math.min(
                Math.max(0, databaseQuantity),
                productInventory
              );

              return {
                id: apiItem.id,
                products_id: apiItem.products_id,
                imageUrl: apiItem.product.image,
                name: apiItem.product.name,
                partnerName: apiItem.product.partner.name,
                price: apiItem.product.price,
                quantity: adjustedQuantity, // Use the adjusted quantity here
                selected: true,
                weight: apiItem.product.weight,
                fromCart: true,
                inventory: productInventory, // Still store the actual inventory for future checks
              };
            }
          );
          setCartItems(transformedItems);
          console.log("Cart items loaded successfully:", transformedItems);
        } else {
          console.warn(
            "Cart data is empty or not in the expected format from fetchAllCart:",
            result
          );
          setCartItems([]);
        }
      } catch (err) {
        // Error is caught from fetchAllCart's re-throw
        let errorMessage = "Failed to load cart items.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        // If using Axios, error object might have more details
        // e.g., (err as any).response?.data?.message
        const axiosError = err as any; // Type assertion for potential Axios error
        if (axiosError.isAxiosError && axiosError.response?.data?.message) {
          errorMessage = `API Error: ${axiosError.response.data.message} (status: ${axiosError.response.status})`;
        } else if (axiosError.isAxiosError && axiosError.message) {
          errorMessage = `Network Error: ${axiosError.message}`;
        }

        setError(errorMessage);
        console.error("Error loading cart data in component:", err); // Log the full error object for details
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []); // Empty dependency array means this effect runs once on mount

  // ... (rest of your component: handleQuantityChange, handleSelectionChange, JSX)
  // useEffect for totalPrice remains the same
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return item.selected ? sum + item.price * item.quantity : sum;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Fungsi untuk mengubah kuantitas
  const handleQuantityChange = (
    id: number,
    newQuantity: number,
    inventory: number
  ): void => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, newQuantity), inventory }
          : item
      )
    );
  };

  // Fungsi untuk mengubah seleksi
  const handleSelectionChange = (id: number, isSelected: boolean): void => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, selected: isSelected } : item
      )
    );
  };

  // Replace skeleton components with react-loading-skeleton
  const CartItemSkeleton = () => {
    return (
      <div className="grid grid-cols-13 gap-4 items-center py-4 border-b border-gray-100">
        {/* Checkbox skeleton */}
        <div className="col-span-1 flex justify-center">
          <Skeleton width={16} height={16} />
        </div>

        {/* Product details skeleton */}
        <div className="col-span-5 flex items-center space-x-3">
          <Skeleton width={64} height={64} className="rounded-md" />
          <div className="flex-1">
            <Skeleton height={16} width="75%" className="mb-2" />
            <Skeleton height={12} width="50%" />
          </div>
        </div>

        {/* Price skeleton */}
        <div className="col-span-2 text-center">
          <Skeleton width={64} height={16} />
        </div>

        {/* Quantity skeleton */}
        <div className="col-span-2 flex justify-center">
          <Skeleton width={80} height={32} className="rounded-md" />
        </div>

        {/* Total price skeleton */}
        <div className="col-span-2 text-right">
          <Skeleton width={80} height={16} />
        </div>

        {/* Delete button skeleton */}
        <div className="col-span-1 flex justify-center">
          <Skeleton width={32} height={32} className="rounded-xl" />
        </div>
      </div>
    );
  };

  const CartSkeleton = () => {
    return (
      <div className="pt-25 min-h-screen bg-secondary p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
          {/* Header skeleton */}
          <Skeleton width={192} height={24} className="mb-6" />

          {/* Table header skeleton */}
          <div className="hidden md:grid md:grid-cols-13 md:gap-4 text-sm mb-4 border-b border-b-gray-200 pb-3">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              <Skeleton width={96} height={16} />
            </div>
            <div className="col-span-2 text-center">
              <Skeleton width={80} height={16} />
            </div>
            <div className="col-span-2 text-center">
              <Skeleton width={64} height={16} />
            </div>
            <div className="col-span-2 text-right">
              <Skeleton width={80} height={16} />
            </div>
          </div>

          {/* Cart items skeleton */}
          <div className="divide-y divide-gray-100 md:divide-y-0">
            {[...Array(3)].map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </div>

          {/* Checkout section skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
            <Skeleton width={192} height={16} />
            <Skeleton width={96} height={40} className="rounded-xl" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg max-w-4xl mx-auto my-4"
        role="alert"
      >
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="text-xs mt-1">
          Please check the console for more details or try again later.
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-25 min-h-screen bg-secondary p-4">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <ShoppingCartIcon
                size={64}
                className="text-gray-300 mx-auto"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-lg font-medium text-gray-800 mb-3">
              Keranjang Belanja Kosong
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Belum ada produk di keranjang Anda. Mulai berbelanja sekarang dan
              temukan produk-produk terbaik dari mitra kami.
            </p>
            <button
              onClick={() => router.push("/product")}
              className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:-translate-y-1 duration-150 ease-in transition-transform"
            >
              Mulai Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-25 min-h-screen bg-secondary p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
        {showPopup && (
          <Popup
            message={message}
            type={popupType}
            onClose={() => setShowPopup(false)}
          />
        )}
        <h2 className="text-lg font-medium text-gray-800 mb-6">
          Keranjang Belanja
        </h2>
        <div className="hidden md:grid md:grid-cols-13 md:gap-4 text-sm text-gray-500 font-medium mb-4 border-b border-b-gray-200 pb-3">
          <div className="col-span-1"></div>
          <div className="col-span-5">Detail Produk</div>
          <div className="col-span-2 text-center">Harga Satuan</div>
          <div className="col-span-2 text-center">Jumlah</div>
          <div className="col-span-2 text-right">Total Harga</div>
        </div>
        <div className="divide-y divide-gray-100 md:divide-y-0">
          {cartItems.map((item) => (
            <CartCard
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onSelectionChange={handleSelectionChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
          <div className="text-sm font-medium text-gray-800">
            Total (
            {cartItems
              .filter((item) => item.selected)
              .reduce((sum, item) => sum + item.quantity, 0)}{" "}
            item
            {cartItems
              .filter((item) => item.selected)
              .reduce((sum, item) => sum + item.quantity, 0) !== 1
              ? "s"
              : ""}
            ): {formatCurrency(totalPrice)}
          </div>
          <button
            type="submit"
            className="cursor-pointer w-30 bg-primary text-white py-2 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
