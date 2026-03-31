const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Nền mờ nhẹ + trong suốt với blur */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Container spinner + text */}
      <div className="relative flex flex-col items-center pointer-events-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 mb-3"></div>
        <span className="text-gray-800 text-sm font-medium drop-shadow-lg">
          Đang tải...
        </span>
      </div>
    </div>
  );
};

export default Loading;