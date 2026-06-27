import { useState, useMemo } from "react";
import VoucherHeader from "@/modules/admin/voucher/components/VoucherHeader";
import VoucherFilter from "@/modules/admin/voucher/components/VoucherFilter";
import VoucherTable from "@/modules/admin/voucher/components/VoucherTable";
import VoucherMobileCard from "@/modules/admin/voucher/components/VoucherMobileCard";
import VoucherForm from "@/modules/admin/voucher/components/VoucherForm";
import Pagination from "@/components/common/Pagination";
import type { VoucherItem, VoucherRequest } from "@/modules/admin/voucher/types/voucher.type";
import { BaseStatus } from "@/types/status";

const initialVouchers: VoucherItem[] = [
  {
    code: "WELCOME50",
    name: "Mã giảm giá chào mừng thành viên mới",
    discountType: "FIXED",
    discountValue: 50000,
    minOrderValue: 250000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: BaseStatus.ACTIVE,
    quantity: 200,
    usedQuantity: 84,
    description: "Giảm ngay 50.000đ cho đơn hàng sách đầu tiên từ 250k",
  },
  {
    code: "BOOKLOVER15",
    name: "Ưu đãi cuồng sách tháng 6",
    discountType: "PERCENT",
    discountValue: 15,
    minOrderValue: 150000,
    maxDiscountValue: 40000,
    startDate: "2026-06-05",
    endDate: "2026-06-25",
    status: BaseStatus.INACTIVE,
    quantity: 100,
    usedQuantity: 0,
    description: "Giảm 15% tối đa 40k cho đơn hàng từ 150k",
  },
  {
    code: "CLEARENDY",
    name: "Mã dọn kho xả hàng tồn",
    discountType: "FIXED",
    discountValue: 100000,
    minOrderValue: 500000,
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    status: BaseStatus.INACTIVE,
    quantity: 50,
    usedQuantity: 50,
    description: "Giảm giá sâu 100k cho đơn hàng lớn trên 500k",
  },
  {
    code: "FREESHIPEXTRA",
    name: "Miễn phí vận chuyển toàn quốc",
    discountType: "FIXED",
    discountValue: 30000,
    minOrderValue: 99000,
    startDate: "2026-06-01",
    endDate: "2026-06-20",
    status: BaseStatus.ACTIVE,
    quantity: 500,
    usedQuantity: 312,
    description: "Trợ giá 30k phí ship cho đơn hàng từ 99k",
  },
  {
    code: "SUMMERVOUCH20",
    name: "Voucher ưu đãi hè rực rỡ",
    discountType: "PERCENT",
    discountValue: 20,
    minOrderValue: 300000,
    maxDiscountValue: 60000,
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    status: BaseStatus.INACTIVE,
    quantity: 150,
    usedQuantity: 0,
    description: "Chiết khấu 20% cho đơn hàng mua sách mùa hè",
  },
  {
    code: "PAYDAY100",
    name: "Voucher ngày lương về",
    discountType: "FIXED",
    discountValue: 100000,
    minOrderValue: 600000,
    startDate: "2026-06-25",
    endDate: "2026-06-30",
    status: BaseStatus.INACTIVE,
    quantity: 80,
    usedQuantity: 0,
    description: "Giảm 100k cho đơn hàng từ 600k cuối tháng",
  },
  {
    code: "NIGHTOWL",
    name: "Mã săn đêm giá tốt",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderValue: 120000,
    maxDiscountValue: 25000,
    startDate: "2026-06-10",
    endDate: "2026-06-20",
    status: BaseStatus.ACTIVE,
    quantity: 300,
    usedQuantity: 145,
    description: "Ưu đãi 10% cho các đơn hàng đặt vào buổi đêm",
  },
  {
    code: "WEEKENDFUN",
    name: "Voucher vui vẻ cuối tuần",
    discountType: "FIXED",
    discountValue: 25000,
    minOrderValue: 180000,
    startDate: "2026-06-26",
    endDate: "2026-06-28",
    status: BaseStatus.ACTIVE,
    quantity: 200,
    usedQuantity: 92,
    description: "Giảm 25k cho đơn đặt hàng thứ 7 và chủ nhật",
  },
  {
    code: "VIPCLUB50",
    name: "Đặc quyền thành viên VIP",
    discountType: "FIXED",
    discountValue: 50000,
    minOrderValue: 200000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: BaseStatus.ACTIVE,
    quantity: 100,
    usedQuantity: 67,
    description: "Dành riêng cho khách hàng VIP thân thiết",
  },
  {
    code: "BACKTOSCHOOLV",
    name: "Voucher chuẩn bị mùa khai trường",
    discountType: "PERCENT",
    discountValue: 12,
    minOrderValue: 200000,
    maxDiscountValue: 35000,
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    status: BaseStatus.INACTIVE,
    quantity: 250,
    usedQuantity: 0,
    description: "Giảm 12% cho đơn hàng sách tham khảo học tập",
  },
  {
    code: "CHILDDAY",
    name: "Tặng bé quà xinh 1/6",
    discountType: "FIXED",
    discountValue: 40000,
    minOrderValue: 220000,
    startDate: "2026-05-28",
    endDate: "2026-06-05",
    status: BaseStatus.INACTIVE,
    quantity: 150,
    usedQuantity: 150,
    description: "Giảm ngay 40k mừng ngày quốc tế thiếu nhi",
  },
  {
    code: "FLASHMAY",
    name: "Xả mã Flash Sale tháng 5",
    discountType: "PERCENT",
    discountValue: 25,
    minOrderValue: 350000,
    maxDiscountValue: 80000,
    startDate: "2026-05-15",
    endDate: "2026-05-20",
    status: BaseStatus.INACTIVE,
    quantity: 60,
    usedQuantity: 60,
    description: "Giảm cực sâu 25% tối đa 80k",
  },
  {
    code: "MANGALOVER",
    name: "Mã ưu đãi fan Manga truyện tranh",
    discountType: "FIXED",
    discountValue: 15000,
    minOrderValue: 100000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: BaseStatus.ACTIVE,
    quantity: 400,
    usedQuantity: 210,
    description: "Giảm 15k cho đơn mua truyện tranh manga",
  },
  {
    code: "NOVELCLUB",
    name: "Mã giảm giá hội yêu tiểu thuyết",
    discountType: "PERCENT",
    discountValue: 18,
    minOrderValue: 250000,
    maxDiscountValue: 50000,
    startDate: "2026-06-12",
    endDate: "2026-06-25",
    status: BaseStatus.ACTIVE,
    quantity: 120,
    usedQuantity: 43,
    description: "Chiết khấu 18% cho các tác phẩm tiểu thuyết",
  },
  {
    code: "SKILLUP",
    name: "Nâng cao kỹ năng làm việc",
    discountType: "FIXED",
    discountValue: 35000,
    minOrderValue: 200000,
    startDate: "2026-06-01",
    endDate: "2026-06-22",
    status: BaseStatus.ACTIVE,
    quantity: 100,
    usedQuantity: 58,
    description: "Giảm 35k sách phát triển bản thân & kinh doanh",
  },
  {
    code: "HELLOSEPT",
    name: "Chào tháng 9 tựu trường",
    discountType: "PERCENT",
    discountValue: 10,
    minOrderValue: 150000,
    maxDiscountValue: 30000,
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    status: BaseStatus.INACTIVE,
    quantity: 200,
    usedQuantity: 0,
    description: "Ưu đãi 10% chào mừng tháng 9",
  },
  {
    code: "MIDAUTUMN20",
    name: "Voucher quà tặng trung thu",
    discountType: "FIXED",
    discountValue: 45000,
    minOrderValue: 300000,
    startDate: "2026-09-10",
    endDate: "2026-09-25",
    status: BaseStatus.INACTIVE,
    quantity: 150,
    usedQuantity: 0,
    description: "Giảm 45k cho đơn hàng sách quà tặng dịp trung thu",
  },
  {
    code: "BLACKFRI50K",
    name: "Voucher siêu sốc Black Friday",
    discountType: "FIXED",
    discountValue: 50000,
    minOrderValue: 199000,
    startDate: "2026-11-25",
    endDate: "2026-11-30",
    status: BaseStatus.INACTIVE,
    quantity: 500,
    usedQuantity: 0,
    description: "Giảm ngay 50k cho đơn hàng từ 199k dịp Black Friday",
  },
  {
    code: "THANKSTEACH",
    name: "Mã tri ân ngày nhà giáo 20/11",
    discountType: "PERCENT",
    discountValue: 20,
    minOrderValue: 250000,
    maxDiscountValue: 70000,
    startDate: "2026-11-15",
    endDate: "2026-11-21",
    status: BaseStatus.INACTIVE,
    quantity: 180,
    usedQuantity: 0,
    description: "Chiết khấu 20% mừng ngày nhà giáo Việt Nam",
  },
  {
    code: "NEWYEARGIFT",
    name: "Voucher lộc đầu năm mới",
    discountType: "FIXED",
    discountValue: 60000,
    minOrderValue: 400000,
    startDate: "2026-01-01",
    endDate: "2026-01-10",
    status: BaseStatus.INACTIVE,
    quantity: 300,
    usedQuantity: 300,
    description: "Lộc xuân 60k cho mọi đơn hàng năm mới",
  },
];

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(initialVouchers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewState, setViewState] = useState<"LIST" | "CREATE" | "EDIT">("LIST");
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((voucher) => {
      const matchSearch =
        voucher.code.toLowerCase().includes(search.toLowerCase().trim()) ||
        voucher.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchStatus =
        statusFilter === "ALL" ? true : voucher.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vouchers, search, statusFilter]);

  const paginatedVouchers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredVouchers.slice(start, start + pageSize);
  }, [filteredVouchers, page, pageSize]);

  const totalPages = Math.ceil(filteredVouchers.length / pageSize) || 1;

  const handleResetFilter = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  const handleCreateClick = () => {
    setEditingVoucher(null);
    setViewState("CREATE");
  };

  const handleEditClick = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setViewState("EDIT");
  };

  const handleDelete = (code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa voucher ${code}?`)) {
      setVouchers((prev) => prev.filter((v) => v.code !== code));
    }
  };

  const handleFormSubmit = (formData: VoucherRequest) => {
    if (viewState === "CREATE") {
      const newItem: VoucherItem = {
        ...formData,
        usedQuantity: 0,
      };
      setVouchers((prev) => [newItem, ...prev]);
    } else if (viewState === "EDIT" && editingVoucher) {
      setVouchers((prev) =>
        prev.map((v) =>
          v.code === editingVoucher.code
            ? { ...v, ...formData, usedQuantity: v.usedQuantity }
            : v
        )
      );
    }
    setViewState("LIST");
    setEditingVoucher(null);
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <VoucherHeader
        viewState={viewState}
        onBackToList={() => {
          setViewState("LIST");
          setEditingVoucher(null);
        }}
        onCreateClick={handleCreateClick}
      />

      {viewState === "LIST" ? (
        <>
          {/* FILTER & DATA */}
          <div className="card-custom">
            <VoucherFilter
              search={search}
              statusFilter={statusFilter}
              onSearchChange={(s) => {
                setSearch(s);
                setPage(1);
              }}
              onStatusFilterChange={(st) => {
                setStatusFilter(st);
                setPage(1);
              }}
              onReset={handleResetFilter}
            />

            {/* DESKTOP TABLE */}
            <VoucherTable
              vouchers={paginatedVouchers}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              page={page}
              pageSize={pageSize}
            />

            {/* MOBILE CARDS */}
            <VoucherMobileCard
              vouchers={paginatedVouchers}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredVouchers.length}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      ) : (
        /* INLINE FORM (NO MODAL) */
        <VoucherForm
          initialData={editingVoucher}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setViewState("LIST");
            setEditingVoucher(null);
          }}
        />
      )}
    </div>
  );
}
