type Badge = {
    text: string;
    className: string;
};

type BadgeInput = {
    isFeatured: boolean;
    publishedAt: string;
    soldCount: number;
};

export function getProductBadge({
    isFeatured,
    publishedAt,
    soldCount
}: BadgeInput): Badge | null {

    // 1. Nổi bật (ưu tiên cao nhất)
    if (isFeatured) {
        return {
            text: 'Nổi bật',
            className: 'bg-pink-50 text-pink-600'
        };
    }

    // 2. Mới (<= 30 ngày)
    const publishedDate = new Date(publishedAt);
    const now = new Date();
    const diffDays =
        (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 30) {
        return {
            text: 'Mới',
            className: 'bg-green-50 text-green-600'
        };
    }

    // 3. Bán chạy
    if (soldCount >= 1000) {
        return {
            text: 'Bán chạy',
            className: 'bg-indigo-50 text-indigo-600'
        };
    }

    return null;
}
