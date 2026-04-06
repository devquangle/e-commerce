const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Nền mờ + blur + fade in */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-500 opacity-100"></div>

      {/* Container spinner + text */}
      <div className="relative flex flex-col items-center pointer-events-auto animate-[fade-in_0.5s_ease-out]">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 mb-3"></div>

        {/* Text */}
        <span className="text-gray-800 text-sm font-medium drop-shadow-lg animate-[fade-in_0.7s_ease-out]">
          Đang tải...
        </span>
      </div>
    </div>
  );
};

export default Loading;