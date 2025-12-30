import { Link } from 'react-router-dom'

type AccountMenuProps = {
    className?: string
    variant?: 'mobile' | 'sidebar'
}


type AccountMenuItem = {
    id: number,
    label: string,
    path: string,
    icon?: string,

}

const menus: AccountMenuItem[] = [
    {id: 1, label: 'Hồ sơ', path: '/account/profile', icon: ``},
    { id: 2, label: 'Đơn hàng', path: '/account/orders' },
    { id: 3, label: 'Địa chỉ', path: '/account/address' },
    { id: 4, label: 'Yêu thích', path: '/account/favorites' },
]

export default function AccountMenu({
    className = '',
    variant = 'sidebar',
}: AccountMenuProps) {
    return (
        <nav className="space-y-2">


            {variant === 'sidebar' && (
                <div className="hidden lg:flex items-center gap-3 p-4 border-b">
                    <img
                        src=""
                        alt="avatar"
                        className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div className="text-sm text-gray-700">
                        email
                    </div>
                </div>
            )}


            <ul className={`space-y-1 whitespace-nowrap ${className}`}>
                {menus.map((item) => (
                    <li
                        key={item.path}
                        className="rounded-lg hover:bg-gray-100"
                    >
                        <Link
                            to={item.path}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-600"
                        >
                            {/* Icon – desktop */}
                            <span className="hidden lg:block">
                                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 4h16v16H4z" />
                                </svg>
                            </span>

                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>

    )
}
