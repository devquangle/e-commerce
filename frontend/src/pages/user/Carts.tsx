import Container from "@/components/common/Container";

import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type CartResponse } from "@/modules/user/cart/types/cart.type";

import {  showInfoToast, showSuccessToast } from "@/utils/toastUtil";
import { PriceBreakdown } from "@/components/user/PriceBreakdown";
import { CartItemsToolbar } from "@/modules/user/cart/components/CartItemsToolbar";
import CartItemCard from "@/modules/user/cart/components/CartItemCard";
import DeleteCartItemsModal from "@/modules/user/cart/components/DeleteCartItemsModal";
import DeleteCartItemModal from "@/modules/user/cart/components/DeleteCartItemModal";
import {
  useCartData,
  useToggleCartItem,
  useToggleAllCartItems,
  useRemoveCartItem,
  useRemoveCartItems,
  useUpdateQuantity,
} from "@/modules/user/cart/hooks/useCart";
import { CheckoutEmptyState } from "@/modules/user/cart/components/CheckoutEmptyState";
import Loading from "@/components/common/Loading";

export default function Carts() {
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartResponse | null>(null);

  const { data: cartData, isPending: isCartPending } = useCartData();

  const updateQuantityMutation = useUpdateQuantity();
  const toggleItemMutation = useToggleCartItem();
  const toggleAllMutation = useToggleAllCartItems();
  const removeItemMutation = useRemoveCartItem();
  const removeItemsMutation = useRemoveCartItems();

  const items = useMemo(() => {
    if (!cartData) return [];
    const fetchedItems = Array.isArray(cartData) ? cartData : [cartData];
    return fetchedItems.filter((item) => item.product != null);
  }, [cartData]);

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
    toggleAllMutation.mutate(!allChecked);
  };

  const toggleItem = (cartItemId: number, currentChecked: boolean) => {
    toggleItemMutation.mutate({ cartItemId, checked: !currentChecked });
  };

  const updateQuantity = (
    cartItemId: number,
    currentQuantity: number,
    delta: number,
  ) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    if (newQuantity !== currentQuantity) {
      updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const removeItem = (cartItemId: number) => {
    removeItemMutation.mutate(cartItemId, {
      onSuccess: () => {
        showSuccessToast("Đã xóa sản phẩm khỏi giỏ hàng");
      },
    });
  };

  const handleDeleteSelectedClick = () => {
    if (selectedItems.length === 0) {
      showInfoToast("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    const ids = selectedItems.map((i) => i.cartItemId);
    removeItemsMutation.mutate(ids, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        showSuccessToast("Đã xóa các sản phẩm đã chọn");
      },
    });
  };


  const hasSelected = selectedCount > 0;

  const handleProceedToCheckout = () => {
    if (!hasSelected) return;
    navigate("/payment");
  };

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
                  onToggle={() => toggleItem(item.cartItemId, item.checked)}
                  onUpdateQuantity={(delta) =>
                    updateQuantity(item.cartItemId, item.quantity, delta)
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
