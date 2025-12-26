export function getDiscountPercent(
    price: number,
    originalPrice?: number
) {
    if (!originalPrice || originalPrice <= price) return null;

    return Math.round(
        ((originalPrice - price) / originalPrice) * 100
    );
}
