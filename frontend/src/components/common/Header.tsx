
import Container from "../Container"
import MenuItem from "./MenuItem"
import Search from "./Search"



export default function Header(){

  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <Container className="px-4 md:px-8">
        <nav className="flex justify-between items-center h-15 gap-2">
          <div className="_logo flex items-center">
            <a href="" className="flex justify-center items-center gap-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="h-8 w-8 text-indigo-500"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 3h9a3 3 0 0 1 3 3v13l-4.5-2.5L7 19V6a1 1 0 0 0-1-1H4V3z" />
                <path d="M19 5h1a1 1 0 0 1 1 1v13l-3-1.5" />
              </svg>
              <span className="text-md font-bold">BookStore</span>
            </a>
          </div>
          <MenuItem className="hidden lg:flex items-center gap-5 text-md"/>
          <Search />
          <div className="flex items-center">
            <button >
              <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
              </svg>
            </button>
            <button className="hidden lg:flex justify-center items-center gap-2 ">
              <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
              </svg>
            </button>
            <div className="relative group hidden lg:block">
              <button className="flex items-center gap-2 rounded-full border px-2 py-1">
                <img src="https://i.pravatar.cc/40" className="h-8 w-8 rounded-full" />
                <span className="text-md">Tài khoản</span>
              </button>
              <div className="absolute top-full right-0 pt-2 z-50 opacity-0 invisible translate-y-2 transition group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <div className="w-56 bg-white border rounded-lg shadow-lg ">
                  <ul className="py-2 text-md ">
                    <li><a href="" className="px-4 py-2">Thông tin cá nhân</a></li>
                    <li className="border-t my-1" />
                    <li><a href="" className="px-4 py-2">Đăng xuất</a></li>
                    <li><a href="" className="px-4 py-2">Đăng nhập</a></li>
                    <li><a href="" className="px-4 py-2">Đăng ký</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </Container>


    </header>
  )
}
