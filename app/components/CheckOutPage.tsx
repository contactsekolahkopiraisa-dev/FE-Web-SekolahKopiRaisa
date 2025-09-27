"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "../stores/cartStore";
import { createOrder, searchAddress, searchCost } from "../utils/order";
import Popup from "./Popup";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../utils/helper";
import { getUser } from "../utils/user";
import { UserItem } from "../types/userType";
import { AddressSuggestion, CreateOrderPayload } from "../types/orderType";
import {
  Box,
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
  Store,
} from "lucide-react";

// ==================== TIPE ====================
interface OrderInformationProps {
  address: string;
  setAddress: (val: string) => void;
  addressLabel: string;
  setAddressLabel: (val: string) => void;
  userName: string;
  phoneNumber: string;
  totalWeight: number;
  shippingCost: number;
  onAddressSearch: (query: string) => void;
  addressSuggestions: any[];
  errors?: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onAddressSelect: (addressId: number) => void;
}

interface ProductData {
  imageSrc: string;
  name: string;
  partnerName: string;
  price: number;
  quantity: number;
}

interface ProductItemProps extends ProductData {
  customNote: string;
  onNoteChange: (val: string) => void;
}

interface PaymentMethodsProps {
  selected: string;
  setSelected: (val: string) => void;
}

// ==================== KOMPONEN ====================

const OrderInformation: React.FC<OrderInformationProps> = ({
  address,
  setAddress,
  addressLabel,
  setAddressLabel,
  userName,
  phoneNumber,
  totalWeight,
  shippingCost,
  onAddressSearch,
  addressSuggestions,
  errors = {},
  setErrors,
  onAddressSelect,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddressLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddressLabel(value);
    if (errors.addressLabel) {
      setErrors((prev) => ({ ...prev, addressLabel: "" }));
    }

    // Check if input has at least 5 characters
    if (value.trim().length >= 5) {
      onAddressSearch(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setAddressLabel(suggestion.label);
    setShowSuggestions(false);
    onAddressSelect(suggestion.id);
  };

  return (
    <div className="mb-8 p-6 bg-tertiary border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <MapPin size={18} className="text-blue-500" />
        Informasi Pengiriman
      </h2>

      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kode Pos
        </label>
        <input
          type="text"
          className={`w-full p-2 border-2 rounded-xl text-sm transition-all duration-200 ${
            errors.addressLabel
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          value={addressLabel}
          onChange={handleAddressLabelChange}
          placeholder="Ketikkan kode pos anda"
        />
        {showSuggestions && addressSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
            {addressSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </div>
            ))}
          </div>
        )}
        {errors.addressLabel && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            {errors.addressLabel}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Lengkap
        </label>
        <textarea
          className={`w-full p-3 border-2 rounded-xl text-sm resize-none transition-all duration-200 ${
            errors.address
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          value={address}
          onChange={handleAddressChange}
          rows={3}
          placeholder="Masukkan detail alamat lengkap (nama jalan, nomor rumah, patokan, dll)..."
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            {errors.address}
          </p>
        )}
      </div>
      <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4">
        <p className="text-sm font-medium text-gray-800 mb-1">{userName}</p>
        <p className="text-sm text-gray-600">{phoneNumber}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-1">Total Berat</p>
          <p className="text-sm text-gray-600">{totalWeight} gr</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-1">Biaya Kirim</p>
          <p className="text-sm text-gray-600">
            {shippingCost > 0
              ? `Rp ${shippingCost.toLocaleString("id-ID")}`
              : "Menghitung..."}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductItem: React.FC<ProductItemProps> = ({
  imageSrc,
  name,
  partnerName,
  price,
  quantity,
  customNote,
  onNoteChange,
}) => (
  <div className="bg-tertiary border border-gray-200 rounded-xl p-4  mb-4 shadow-sm hover:shadow-lg transition-all duration-200">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
      <div className="lg:col-span-6 flex flex-col sm:flex-row items-center sm:items-start">
        <div className="relative mb-3 sm:mb-0">
          <img
            src={imageSrc}
            alt={name}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
          />
          <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            {quantity}x
          </div>
        </div>
        <div className="sm:ml-4 flex-1 text-center sm:text-left w-full">
          <h3 className="font-medium text-gray-900 text-base md:text-lg mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mb-2 flex items-center justify-center sm:justify-start gap-1">
            <Store size={18} />
            Mitra: {partnerName}
          </p>
          <input
            type="text"
            className="w-full py-2 px-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
            placeholder="Tambahkan catatan khusus..."
            value={customNote}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        </div>
      </div>
      <div className="lg:col-span-3 text-center lg:text-right">
        <p className="text-sm text-gray-500 mb-1">Harga Satuan</p>
        <p className="text-base md:text-lg font-medium text-gray-800">
          {formatCurrency(price)}
        </p>
      </div>
      <div className="lg:col-span-3 text-center lg:text-right">
        <p className="text-sm text-gray-500 mb-1">Subtotal</p>
        <p className="text-base md:text-lg font-medium">
          Rp {(price * quantity).toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  </div>
);

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selected,
  setSelected,
}) => {
  const options = [
    { value: "COD", label: "Bayar di Tempat", icon: "💵" },
    { value: "BANK_TRANSFER", label: "Transfer Bank", icon: "🏦" },
  ];

  return (
    <div className="p-4 md:p-6 bg-tertiary shadow-lg rounded-xl border border-gray-200 mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard size={18} className="text-green-500" />
        Metode Pembayaran
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {options.map((method) => (
          <button
            key={method.value}
            onClick={() => setSelected(method.value)}
            className={`p-3 md:p-4 border-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              selected === method.value
                ? "bg-primary text-white border-gray-200 shadow-lg"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div className="text-lg mb-2">{method.icon}</div>
            <div className="font-medium">{method.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==================== KOMPONEN UTAMA ====================

export default function CheckOutPage() {
  const cartItems = useCartStore((state) => state.cartItems);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [user, setUser] = useState<UserItem>({});

  const [address, setAddress] = useState("");
  const [addressLabel, setAddressLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [customNotes, setCustomNotes] = useState<Record<number, string>>({});
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  ); // Add this state
  const [destination, setDestination] = useState(0);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressSuggestion | null>(null);

  const router = useRouter();
  const totalHarga = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalWeight = cartItems.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0
  );

  const handleNoteChange = (productId: number, note: string) => {
    setCustomNotes((prev) => ({ ...prev, [productId]: note }));
  };

  const handleCreateOrder = async () => {
    // Add debugging at the start
    console.log("=== Starting Order Creation ===");

    const cartItems = useCartStore.getState().cartItems;
    console.log("Cart items:", cartItems);

    if (cartItems.length === 0) {
      setMessage("Keranjang kosong. Silakan tambahkan produk.");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    if (!selectedAddress) {
      console.log("No selected address:", selectedAddress);
      setMessage("Silakan masukkan kode pos.");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    // Debug the order payload
    // In handleCreateOrder function, replace the orderPayload with:
    const orderPayload: CreateOrderPayload = {
      items: cartItems.map((item) => ({
        products_id: item.products_id,
        quantity: item.quantity,
        custom_note: customNotes[item.id] || "",
        fromCart: item.fromCart || false,
      })),
      address,
      shipping_name: shippingDetails?.name || "J&T Express",
      shipping_code: shippingDetails?.code || "jnt",
      shipping_service: shippingDetails?.service || "EZ",
      destination_id: selectedAddress.id,
      destination_province: selectedAddress.province_name,
      destination_city: selectedAddress.city_name,
      destination_district: selectedAddress.district_name,
      destination_subdistrict: selectedAddress.subdistrict_name,
      destination_pos_code: selectedAddress.zip_code,
      paymentMethod: paymentMethod,
      cost: shippingCost.toString(),
    };

    console.log("Order payload:", JSON.stringify(orderPayload, null, 2));
    console.log("Selected address:", selectedAddress);
    console.log("Address:", address);
    console.log("Shipping cost:", shippingCost);
    console.log("Payment method:", paymentMethod);

    try {
      console.log("Calling createOrder API...");
      const data = await createOrder(orderPayload);
      console.log("Order response:", data);

      const redirectUrl = data.order?.payment?.snapRedirectUrl;
      console.log("Redirect URL:", redirectUrl);

      if (redirectUrl) {
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.log("No redirect URL, navigating to orders page");
        // For COD or when no redirect URL is available, navigate to orders page
        if (paymentMethod === "COD") {
          setMessage(
            "Pesanan berhasil dibuat! Anda akan membayar saat barang diterima."
          );
          setPopupType("success");
          setShowPopup(true);
          // Navigate to orders page after showing success message
          setTimeout(() => {
            router.push("/order");
          }, 2000);
        } else {
          setMessage("Pesanan berhasil dibuat!");
          setPopupType("success");
          setShowPopup(true);
          setTimeout(() => {
            router.push("/order");
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("=== Order Creation Error ===");
      console.error("Error object:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      if (error.type === "validation") {
        console.log("Validation errors:", error.errors);
        setErrors(error.errors);
      } else {
        console.error("Non-validation error:", error);
        setMessage(error.message || "Terjadi kesalahan saat membuat pesanan.");
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  const handleAddressSearch = async (query: string) => {
    // Only search if query has at least 4 characters
    if (query.trim().length >= 5) {
      try {
        const response = await searchAddress(query);
        setAddressSuggestions(response.data || []);
      } catch (error) {
        console.error("Error searching address:", error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  // Add this state for shipping details
  const [shippingDetails, setShippingDetails] = useState<{
    name: string;
    code: string;
    service: string;
  } | null>(null);

  const calculateShippingCost = async () => {
    if (destination && totalWeight > 0) {
      try {
        const response = await searchCost(destination, totalWeight);
        // Get the first shipping option
        const firstShippingOption = response.data?.data?.[0];
        const cost = firstShippingOption?.cost || 0;
        setShippingCost(cost);

        // Store shipping details
        if (firstShippingOption) {
          setShippingDetails({
            name: firstShippingOption.name,
            code: firstShippingOption.code,
            service: firstShippingOption.service,
          });
        }

        console.log("Shipping cost:", cost);
        console.log("Shipping details:", firstShippingOption);
      } catch (error) {
        console.error("Error calculating shipping cost:", error);
        setShippingCost(0);
        setShippingDetails(null);
      }
    }
  };

  const handleAddressSelect = (addressId: number) => {
    const selectedAddr = addressSuggestions.find(
      (addr) => addr.id === addressId
    );
    setDestination(addressId);
    setSelectedAddress(selectedAddr || null);
  };

  useEffect(() => {
    if (destination && totalWeight > 0) {
      calculateShippingCost();
    }
  }, [destination, totalWeight]);

  // Ambil data user saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setAddress(userData.address || ""); // Set alamat jika ada
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {showPopup && (
          <Popup
            message={message}
            type={popupType}
            onClose={() => setShowPopup(false)}
          />
        )}

        {/* Header */}
        <div className="bg-primary text-white p-4 md:p-6">
          <h1 className="text-base md:text-lg font-medium flex items-center gap-2">
            <ShoppingBag size={18} />
            Checkout Pesanan
          </h1>
          <p className="text-orange-100 mt-1 text-sm md:text-base">
            Lengkapi informasi untuk menyelesaikan pesanan Anda
          </p>
        </div>

        <div className="p-4 md:p-6">
          {/* Informasi Pengiriman */}
          <OrderInformation
            address={address}
            setAddress={setAddress}
            addressLabel={addressLabel}
            setAddressLabel={setAddressLabel}
            userName={user.name || ""}
            phoneNumber={user.phone_number || ""}
            totalWeight={totalWeight}
            shippingCost={shippingCost}
            onAddressSearch={handleAddressSearch}
            addressSuggestions={addressSuggestions}
            errors={errors}
            setErrors={setErrors}
            onAddressSelect={handleAddressSelect}
          />

          {/* Daftar Produk */}
          <div className="mb-6">
            <h2 className="text-base md:text-lg font-medium text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <Box size={18} />
              Detail Produk ({cartItems.length} item)
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 md:py-12 bg-gray-50 rounded-2xl">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-base md:text-lg">
                  Tidak ada produk di keranjang.
                </p>
              </div>
            ) : (
              <>
                {cartItems.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    imageSrc={product.imageUrl}
                    name={product.name}
                    partnerName={product.partnerName ?? ""}
                    price={product.price}
                    quantity={product.quantity}
                    customNote={customNotes[product.id] || ""}
                    onNoteChange={(val) => handleNoteChange(product.id, val)}
                  />
                ))}
                <div className="bg-tertiary p-4 md:p-6 rounded-xl shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <span className="text-base md:text-lg font-medium text-gray-800">
                      Total Pesanan:
                    </span>
                    <span className="text-base md:text-lg font-medium text-gray-800">
                      {formatCurrency(totalHarga)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pilih Pembayaran */}
          <PaymentMethods
            selected={paymentMethod}
            setSelected={setPaymentMethod}
          />

          {/* Total & Tombol Submit */}
          <div className="bg-tertiary p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="mb-1 text-sm md:text-base">Total Pembayaran:</p>
                <p className="text-base md:text-lg font-medium">
                  {formatCurrency(totalHarga + shippingCost)}
                </p>
                <p className="text-xs text-gray-500">
                  (Produk: {formatCurrency(totalHarga)} + Ongkir:{" "}
                  {formatCurrency(shippingCost)})
                </p>
              </div>
              <button
                onClick={handleCreateOrder}
                className="cursor-pointer w-full sm:w-auto bg-primary text-white py-2 px-4 text-sm font-medium rounded-xl hover:-translate-y-1 duration-150 ease-in flex justify-center items-center gap-2 disabled:opacity-50 min-w-[140px]"
              >
                <Check size={18} />
                Buat Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
