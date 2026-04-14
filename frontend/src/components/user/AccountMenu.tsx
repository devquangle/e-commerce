import { useAuth } from '@/context/useAuth'
import { NavLink } from 'react-router-dom'

type AccountMenuProps = {
    className?: string
    variant?: 'mobile' | 'sidebar'
}


type AccountMenuItem = {
    id: number,
    label: string,
    path: string,


}

const menus: AccountMenuItem[] = [
    { id: 1, label: 'Hồ sơ', path: '/account/profile' },
    { id: 2, label: 'Đơn hàng', path: '/account/orders' },
    { id: 3, label: 'Địa chỉ', path: '/account/address' },
    { id: 4, label: 'Yêu thích', path: '/account/favorites' },
]

export default function AccountMenu({
    className = '',
    variant = 'sidebar',
}: AccountMenuProps) {

    const { userInfo } = useAuth();






    return (
        <nav className="space-y-2 my-2">


            {variant === 'sidebar' && (
                <div className="hidden lg:flex items-center gap-3 p-4 border-b">
                    <img
                        src={userInfo?.image || 'https://via.placeholder.com/150'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div className="text-sm text-gray-700">
                        <p className="font-medium">{userInfo?.code || "User Name"}</p>
                    </div>
                </div>
            )}


            <ul className={`space-y-1 whitespace-nowrap ${className}`}>
                {menus.map((item) => (
                    <li
                        key={item.path}
                        className="rounded-lg px-1 lg:px-3 hover:bg-gray-100 m-0"
                    >
                        <NavLink
                            to={item.path}
                            end={item.path === '/account/profile'}
                            className={({ isActive }) =>
                                `
        flex justify-between items-center gap-3 w-full p-1 lg:p-3 text-sm  hover:text-blue-500
            ${isActive
                                    ? 'text-blue-500 font-medium'
                                    : 'text-gray-600'}
            `
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>

    )
}
