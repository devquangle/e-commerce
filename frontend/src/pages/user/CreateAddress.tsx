import InputField from "@/components/common/InputField";
import SelectBox from "@/components/common/SelectBox";
import TextAreaField from "@/components/common/TextAreaField";
import Loading from "@/components/common/Loading";

import {
    useProvinces,
    useDistricts,
    useWards
} from "@/hooks/useAddressGHN";

import type { AddressFrom } from "@/types/address";

import { Controller, useForm, useWatch } from "react-hook-form";
import {  NavLink } from "react-router-dom";
import { useCreateAddress } from "@/hooks/useAddress";

export default function CreateAddress() {
    const createMutation = useCreateAddress();

    const { data: provinces = [] } = useProvinces();

    const {
        register,
        handleSubmit,
        control,
        resetField,

        formState: { errors },
    } = useForm<AddressFrom>({
        defaultValues: {
            fullName: "",
            phone: "",
            street: "",
            isDefault: false,
        },
    });

    const provinceId = useWatch({ control, name: "provinceId" });
    const districtId = useWatch({ control, name: "districtId" });

    const { data: districts = [] } = useDistricts(provinceId);
    const { data: wards = [] } = useWards(districtId);

    const onSubmit = (data: AddressFrom) => {
        createMutation.mutate(data);
    };

    if (createMutation.isPending) return <Loading />;

    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Thêm địa chỉ mới
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* NAME + PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Họ và tên"
                        name="fullName"
                        register={register}
                        rules={{ required: "Bắt buộc nhập" }}
                        error={errors.fullName}
                    />

                    <InputField
                        label="Số điện thoại"
                        name="phone"
                        register={register}
                        rules={{
                            required: "Bắt buộc nhập",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Sai định dạng",
                            },
                        }}
                        error={errors.phone}
                    />
                </div>

                {/* LOCATION */}
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
                                        label: p.ProvinceName,
                                        value: p.ProvinceID,
                                    }))}
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        resetField("districtId");
                                        resetField("wardCode");
                                    }}
                                />
                                <p className="text-red-500 text-sm">
                                    {fieldState.error?.message}
                                </p>
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
                                        label: d.DistrictName,
                                        value: d.DistrictID,
                                    }))}
                                    value={field.value}
                                    disabled={!provinceId}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        resetField("wardCode");
                                    }}
                                />
                                <p className="text-red-500 text-sm">
                                    {fieldState.error?.message}
                                </p>
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
                                        label: w.WardName,
                                        value: w.WardCode,
                                    }))}
                                    value={field.value}
                                    disabled={!districtId}
                                    onChange={field.onChange}
                                />
                                <p className="text-red-500 text-sm">
                                    {fieldState.error?.message}
                                </p>
                            </div>
                        )}
                    />
                </div>

                {/* STREET */}
                <TextAreaField
                    label="Địa chỉ cụ thể"
                    name="street"
                    register={register}
                    rules={{ required: "Bắt buộc nhập" }}
                    error={errors.street}
                />

                {/* DEFAULT */}
                <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("isDefault")} />
                    <label>Đặt làm mặc định</label>
                </div>

                {/* ACTION */}
                <div className="flex gap-3">
                    <NavLink
                        to="/account/address"
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Quay lại
                    </NavLink>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Lưu địa chỉ
                    </button>
                </div>

            </form>
        </div>
    );
}