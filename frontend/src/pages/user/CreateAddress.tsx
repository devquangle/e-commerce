import InputField from "@/components/common/InputField";
import SelectBox from "@/components/common/SelectBox";
import TextAreaField from "@/components/common/TextAreaField";
import { apiAuth, apiGuest } from "@/configs/api";
import type { AddressFrom, District, Province, Ward } from "@/types/address";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

export default function CreateAddress() {
    const {
        control,
        register,
        handleSubmit,
        resetField,
        formState: { errors }
    } = useForm<AddressFrom>({
        defaultValues: {
            fullName: "",
            phone: "",
            provinceId: undefined,
            districtId: undefined,
            wardCode: undefined,
            street: "",
            isDefault: false
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const navigate = useNavigate();
    // ================= LOAD PROVINCES =================
    useEffect(() => {
        (async () => {
            try {
                const res = await apiGuest.get("/public/ghn/provinces");
                setProvinces(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    // ================= PROVINCE =================
    const handleProvinceChange = async (provinceId: number) => {
        if (!provinceId) return;

        resetField("districtId");
        resetField("wardCode");
        setDistricts([]);
        setWards([]);

        try {
            const res = await apiGuest.post("/public/ghn/districts", {
                provinceId
            });
            setDistricts(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ================= DISTRICT =================
    const handleDistrictChange = async (districtId: number) => {
        if (!districtId) return;

        resetField("wardCode");
        setWards([]);

        try {
            const res = await apiGuest.post("/public/ghn/wards", {
                districtId
            });
            setWards(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ================= SUBMIT =================
    const onSubmit = async (data: AddressFrom) => {
        setIsLoading(true);
        try {
            const res = await apiAuth.post("/auth/addresses", data);
            if (res.data.success) {
                showSuccessToast(res.data.message);
                navigate("/account/address");
            }
            else {
                showErrorToast(res.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // ================= UI =================
    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Thêm địa chỉ mới
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                {/* NAME + PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Họ và tên"
                        placeholder="Nguyen Van A"
                        name="fullName"
                        register={register}
                        rules={{ required: "Họ và tên không được bỏ trống" }}
                        error={errors.fullName}
                    />

                    <InputField
                        label="Số điện thoại"
                        name="phone"
                        placeholder="0123456789"
                        register={register}
                        rules={{
                            required: "Số điện thoại không được bỏ trống",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Số điện thoại không đúng định dạng"
                            }
                        }}
                        error={errors.phone}
                    />
                </div>

                {/* ADDRESS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* PROVINCE */}
                    <Controller
                        name="provinceId"
                        control={control}
                        rules={{ required: "Vui lòng chọn Tỉnh/Thành" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <SelectBox<number>
                                    label="Tỉnh/Thành"
                                    options={provinces.map(p => ({
                                        label: p.ProvinceName ?? "",
                                        value: p.ProvinceID
                                    }))}
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        handleProvinceChange(val);
                                    }}
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    {/* DISTRICT */}
                    <Controller
                        name="districtId"
                        control={control}
                        rules={{ required: "Vui lòng chọn Quận/Huyện" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <SelectBox<number>
                                    label="Quận/Huyện"
                                    options={districts.map(d => ({
                                        label: d.DistrictName ?? "",
                                        value: d.DistrictID
                                    }))}
                                    value={field.value}
                                    disabled={!provinces.length || districts.length === 0}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        handleDistrictChange(val);
                                    }}
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    {/* WARD */}
                    <Controller
                        name="wardCode"
                        control={control}
                        rules={{ required: "Vui lòng chọn Phường/Xã" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <SelectBox<string>
                                    label="Phường/Xã"
                                    options={wards.map(w => ({
                                        label: w.WardName ?? "",
                                        value: w.WardCode
                                    }))}
                                    value={field.value}
                                    disabled={!districts.length || wards.length === 0}
                                    onChange={field.onChange}
                                />
                                {fieldState.error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                </div>

                {/* STREET */}
                <TextAreaField<AddressFrom>
                    label="Địa chỉ cụ thể"
                    name="street"
                    placeholder="Nhập địa chỉ..."
                    register={register}
                    rules={{ required: "Địa chỉ không được bỏ trống" }}
                    error={errors.street}
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="default"
                        {...register("isDefault")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="default" className="text-sm text-gray-700">
                        Đặt làm địa chỉ mặc định
                    </label>
                </div>



                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded transition
                    ${isLoading
                            ? "bg-gray-300"
                            : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    {isLoading ? "Đang lưu..." : "Lưu địa chỉ"}
                </button>

            </form>
        </div>
    );
}