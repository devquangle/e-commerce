import InputField from "@/components/common/InputField";
import Loading from "@/components/common/Loading";
import SelectBox from "@/components/common/SelectedBox";
import TextAreaField from "@/components/common/TextAreaField";
import type { AddressRequest } from "@/modules/user/address/types/address";
import { showErrorToast } from "@/utils/toastUtil";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useParams, NavLink } from "react-router-dom";
import {
    useProvinces,
    useDistricts,
    useWards
} from "@/modules/user/address/hooks/useAddressGHN";
import { useAddressDetail, useUpdateAddress } from "@/modules/user/address/hooks/useAddress";

interface FormUpdateAddressProps {
    addressId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function FormUpdateAddress({ addressId: propAddressId, onSuccess, onCancel }: FormUpdateAddressProps = {}) {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<AddressRequest>();


    const { mutateAsync, isPending } = useUpdateAddress();
    const { id } = useParams();
    const addressId = propAddressId ?? Number(id);


    /* ================= WATCH ================= */
    const provinceId = useWatch({ control, name: "provinceId" });
    const districtId = useWatch({ control, name: "districtId" });

    /* ================= GHN DATA ================= */
    const { data: provinces = [] } = useProvinces();
    const { data: districts = [] } = useDistricts(provinceId);
    const { data: wards = [] } = useWards(districtId);
    const {
        data: address,
        isFetching: isFetchingAddress,
    } = useAddressDetail(addressId);

    useEffect(() => {
        if (address) {
            setValue("fullName", address.fullName);
            setValue("phone", address.phone);
            setValue("street", address.street);
            setValue("default", address.default);
            setValue("provinceId", address.provinceId);
        }
    }, [address, setValue]);

    // Set district once districts options are loaded and contain the required district
    useEffect(() => {
        if (address && districts.some(d => d.DistrictID === address.districtId)) {
            setValue("districtId", address.districtId);
        }
    }, [address, districts, setValue]);

    // Set ward once wards options are loaded and contain the required ward
    useEffect(() => {
        if (address && wards.some(w => w.WardCode === address.wardCode)) {
            setValue("wardCode", address.wardCode);
        }
    }, [address, wards, setValue]);



    /* ================= SUBMIT ================= */
    const onSubmit = async (data: AddressRequest) => {
        try {
            await mutateAsync({ id: addressId, data });
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            showErrorToast("Cập nhật địa chỉ thất bại");
        }
    };

    if ((isFetchingAddress && !address) || isPending) return <Loading />;


    return (
        <div className="space-y-3">

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
                                placeholder="Chọn Tỉnh/Thành"
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
                                placeholder="Chọn Quận/Huyện"
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
                                placeholder="Chọn Phường/Xã"
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
            <TextAreaField<AddressRequest>
                label="Địa chỉ cụ thể"
                name="street"
                register={register}
                rules={{ required: "Địa chỉ không được bỏ trống" }}
                error={errors.street}
            />

            {/* DEFAULT */}
            {!address?.default
                && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="default"
                            {...register("default")}
                            className="h-4 w-4"
                        />
                        <label htmlFor="default" className="text-sm cursor-pointer">
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>
                )
            }



            {/* ACTION */}
            <div className="flex gap-3">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Hủy bỏ
                    </button>
                ) : (
                    <NavLink
                        to="/account/address"
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        ← Quay lại
                    </NavLink>
                )}

                <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                >
                    ✓ Lưu địa chỉ
                </button>
            </div>

        </div>
    );
}
