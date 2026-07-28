import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [showButton, setShowButton] = useState(false);

  // 1. Tự động cuộn mượt lên đầu trang mỗi khi chuyển tuyến đường (route change)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const mainContainers = document.querySelectorAll("main");
    mainContainers.forEach((container) => {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }, [pathname, search]);

  // 2. Lắng nghe cuộn trang để hiển thị nút floating "Lên đầu trang" khi cuộn xuống > 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Đồng thời kiểm tra scroll trên các thẻ <main> (nếu có scrollbar riêng)
    const mainContainers = document.querySelectorAll("main");
    const handleMainScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    mainContainers.forEach((container) => {
      container.addEventListener("scroll", handleMainScroll);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mainContainers.forEach((container) => {
        container.removeEventListener("scroll", handleMainScroll);
      });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const mainContainers = document.querySelectorAll("main");
    mainContainers.forEach((container) => {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center ${
        showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
