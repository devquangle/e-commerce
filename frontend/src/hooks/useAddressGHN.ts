import { apiGuest } from "@/configs/axios";
import type { District, Province, Ward } from "@/types/address";
import { useQuery } from "@tanstack/react-query";

/* ================= PROVINCES ================= */
export const useProvinces = () => {
    return useQuery<Province[]>({
        queryKey: ["ghn-provinces"],
        queryFn: async () => {
            const res = await apiGuest.get("/public/ghn/provinces");
            return res.data.data ?? [];
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};

/* ================= DISTRICTS ================= */
export const useDistricts = (provinceId?: number) => {
    return useQuery<District[]>({
        queryKey: ["ghn-districts", provinceId],
        enabled: !!provinceId,
        queryFn: async () => {
            const res = await apiGuest.post("/public/ghn/districts", {
                provinceId,
            });
            return res.data.data ?? [];
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};

/* ================= WARDS ================= */
export const useWards = (districtId?: number) => {
    return useQuery<Ward[]>({
        queryKey: ["ghn-wards", districtId],
        enabled: !!districtId,
        queryFn: async () => {
            const res = await apiGuest.post("/public/ghn/wards", {
                districtId,
            });
            return res.data.data ?? [];
        },
        staleTime: 1000 * 60 * 60 * 24,
    });
};