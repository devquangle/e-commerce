import AccountMenu from '@/components/user/AccountMenu'
import Container from '@/components/common/Container'
import { Outlet } from 'react-router-dom';

export default function AccountLayout() {

    return (
        <Container className="max-w-7xl px-4 md:px-8 py-6">
            <AccountMenu
                variant="mobile"
                className="flex lg:hidden gap-2 overflow-x-auto py-2"
            />
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar desktop */}
                <aside className="account-sidebar hidden lg:block w-65 border rounded-2xl shrink-0">
                    <AccountMenu />
                </aside>

                {/* Content */}
                <main className="account-content flex-1">
                    <div className="rounded-xl border bg-white p-4  min-h-75">
                        <Outlet />
                    </div>
                </main>
            </div>


        </Container>
    )
}
