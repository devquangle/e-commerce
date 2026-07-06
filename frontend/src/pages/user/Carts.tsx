import Container from "@/components/common/Container";

import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  mapCartResponseToUI,
  type CartItemUI,
  type CartResponse,
} from "@/modules/user/cart/types/cart.type";

import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import { PriceBreakdown } from "@/components/user/PriceBreakdown";
import { CartItemsToolbar } from "@/modules/user/cart/components/CartItemsToolbar";
import CartItemCard from "@/modules/user/cart/components/CartItemCard";
import DeleteCartItemsModal from "@/modules/user/cart/components/DeleteCartItemsModal";
import DeleteCartItemModal from "@/modules/user/cart/components/DeleteCartItemModal";
import { useCartData } from "@/modules/user/cart/hooks/useCart";
import { CheckoutEmptyState } from "@/modules/user/cart/components/CheckoutEmptyState";
import Loading from "@/components/common/Loading";

export default function Carts() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItemUI[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItemUI | null>(null);

  const { data: cartData, isPending: isCartPending } = useCartData();

  console.log("Carts.tsx re-rendered, cartData:", cartData);

  const [prevCartData, setPrevCartData] = useState<
    CartResponse | CartResponse[] | undefined
  >(cartData);

  if (cartData !== prevCartData) {
    setPrevCartData(cartData);
    if (cartData) {
      const fetchedItems: CartResponse[] = Array.isArray(cartData)
        ? cartData
        : [cartData];
      const newItems = fetchedItems
        .map(mapCartResponseToUI)
        .filter((item) => item.product != null);
      console.log("Setting items to:", newItems);
      setItems(newItems);
    } else {
      setItems([]);
    }
  }

  const allChecked = items.length > 0 && items.every((i) => i.checked);
  const someChecked = items.some((i) => i.checked) && !allChecked;
  const selectedItems = items.filter((i) => i.checked);

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.quantity, 0),
    [selectedItems],
  );

  // 1. ✨ TẠM TÍNH = Tính dựa trên giá gốc chưa giảm của sản phẩm
  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, i) => {
        const originalPrice =
          i.product.discountValue > 0
            ? i.product.price / (1 - i.product.discountValue / 100)
            : i.product.price;
        return sum + originalPrice * i.quantity;
      }, 0),
    [selectedItems],
  );

  // 2. ✨ GIẢM GIÁ SẢN PHẨM = Tổng chênh lệch giữa (Giá gốc - Giá bán hiện tại)
  const productDiscount = useMemo(
    () =>
      selectedItems.reduce((sum, i) => {
        const originalPrice =
          i.product.discountValue > 0
            ? i.product.price / (1 - i.product.discountValue / 100)
            : i.product.price;
        return sum + (originalPrice - i.product.price) * i.quantity;
      }, 0),
    [selectedItems],
  );

  // 4. ✨ TỔNG CỘNG CUỐI CÙNG = Tạm tính - Giảm giá sản phẩm - Giảm giá Voucher
  const total = subtotal - productDiscount;

  const toggleAll = () => {
    setItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })));
  };

  const toggleItem = (cartItemId: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, checked: !i.checked } : i,
      ),
    );
  };

  const updateQuantity = (cartItemId: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i,
      ),
    );
  };

  const removeItem = (cartItemId: number) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showSuccessToast("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleDeleteSelectedClick = () => {
    if (selectedItems.length === 0) {
      showErrorToast("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    setItems((prev) => prev.filter((i) => !i.checked));
    setIsDeleteModalOpen(false);
    showSuccessToast("Đã xóa các sản phẩm đã chọn");
  };

  const checkoutState = {
    checkedItems: selectedItems,
    productDiscount,
  };

  const hasSelected = selectedCount > 0;

  const handleProceedToCheckout = () => {
    if (!hasSelected) return;
    navigate("/payment", { state: checkoutState });
  };

  console.log("🚀 ~ file: Carts.tsx:174 ~ Carts ~ cartData:", cartData);
  console.log("🚀 ~ file: Carts.tsx:174 ~ Carts ~ items:", items);

  if (isCartPending) {
    return <Loading />;
  }

  return (
    <Container
      className={`max-w-7xl mx-auto my-6 ${items.length > 0 ? "pb-24 lg:pb-0" : ""}`}
    >
      {items.length === 0 ? (
        <CheckoutEmptyState
          icon={ShoppingCart}
          title="Giỏ hàng trống"
          description="Hãy khám phá và thêm sách yêu thích vào giỏ hàng"
          action={{ to: "/products", label: "Mua sắm ngay" }}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
          <div className="card-custom flex-1 space-y-4 w-full">
            <CartItemsToolbar
              allChecked={allChecked}
              someChecked={someChecked}
              itemCount={items.length}
              onToggleAll={toggleAll}
              onDeleteSelected={handleDeleteSelectedClick}
            />

            <div className="my-3 space-y-3">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartItemId}
                  item={item}
                  onToggle={() => toggleItem(item.cartItemId)}
                  onUpdateQuantity={(delta) =>
                    updateQuantity(item.cartItemId, delta)
                  }
                  onRemove={() => setItemToDelete(item)}
                />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[350px] lg:shrink-0 lg:sticky lg:top-24">
            <PriceBreakdown
              selectedCount={selectedCount}
              subtotal={subtotal}
              discount={productDiscount}
              total={total}
              hasSelected={hasSelected}
              isCheckout={false}
              onClick={handleProceedToCheckout}
              backLink={{ to: "/products", label: "Tiếp tục mua sắm" }}
            />
          </div>
        </div>
      )}
      <DeleteCartItemsModal
        isOpen={isDeleteModalOpen}
        itemCount={selectedItems.length}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSelected}
      />
      <DeleteCartItemModal
        isOpen={itemToDelete !== null}
        productName={itemToDelete?.product.name || ""}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            removeItem(itemToDelete.cartItemId);
            setItemToDelete(null);
          }
        }}
      />
    </Container>
  );
}
