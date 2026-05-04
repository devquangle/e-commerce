import InputField from "@/components/common/InputField";
import Loading from "@/components/common/Loading";
import SelectBox from "@/components/common/SelectBox";
import TextAreaField from "@/components/common/TextAreaField";
import addressService from "@/services/addressService";
import type { AddressFrom } from "@/types/address";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, NavLink } from "react-router-dom";

import {
    useProvinces,
    useDistricts,
    useWards
} from "@/hooks/useAddressGHN";
export default function UpdateAddress() {
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<AddressFrom>();

    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState<AddressFrom | null>(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const addressId = Number(id);

    /* ================= WATCH ================= */
    const provinceId = watch("provinceId");
    const districtId = watch("districtId");

    /* ================= GHN DATA ================= */
    const { data: provinces = [] } = useProvinces();
    const { data: districts = [] } = useDistricts(provinceId);
    const { data: wards = [] } = useWards(districtId);

    /* ================= LOAD ADDRESS ================= */
    useEffect(() => {
        if (!addressId) return;

        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const res = await addressService.getAddressById(addressId);
                const data = res.data;

                setAddress(data);
                reset(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [addressId, reset]);

    /* ================= SUBMIT ================= */
    const onSubmit = async (data: AddressFrom) => {
        setIsLoading(true);
        try {
            const res = await addressService.updateAddress(addressId, data);

            if (res.success) {
                showSuccessToast(res.data.message);
                navigate("/account/address");
            } else {
                showErrorToast(res.data.message);
            }
        } catch (err) {
            console.error(err);
            showErrorToast("Cập nhật địa chỉ thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !address) return <Loading />;

    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Cập nhật địa chỉ
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                {/* NAME + PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Họ và tên"
                        name="fullName"
                        register={register}
                        rules={{ required: "Họ và tên không được bỏ trống" }}
                        error={errors.fullName}
                    />

                    <InputField
                        label="Số điện thoại"
                        name="phone"
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
                                        field.onBlur();
                                        setValue("districtId", undefined);
                                        setValue("wardCode", undefined);
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
                                    disabled={!provinceId}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        field.onBlur();
                                        setValue("wardCode", undefined);
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
                                    disabled={!districtId}
                                    onChange={
                                        (val) => {
                                            field.onChange(val);
                                            field.onBlur();
                                        }
                                    }
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
                    register={register}
                    rules={{ required: "Địa chỉ không được bỏ trống" }}
                    error={errors.street}
                />

                {/* DEFAULT */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        {...register("isDefault")}
                        className="h-4 w-4"
                    />
                    <span>Đặt làm địa chỉ mặc định</span>
                </div>

                {/* ACTION */}
                <div className="flex gap-3">
                    <NavLink
                        to="/account/address"
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        ← Quay lại
                    </NavLink>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                    >
                        ✓ Lưu địa chỉ
                    </button>
                </div>

            </form>
        </div>
    );
}