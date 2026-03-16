
import MenuItem from './MenuItem'
interface SidebarProps {
    isOpen: boolean,
    onClose: () => void
}
function Sidebar({ isOpen }: SidebarProps) {
    return (
        <aside
            className={`fixed top-16 left-0 z-10 overflow-y-auto h-[calc(100vh-64px)] w-64 border-r shadow-slate-900/30 transition-transform rounded-r-3xl sm:rounded-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } sm:translate-x-0`}
        >
            <div className="flex h-full flex-col px-2 md:px-4 py-3">
                <MenuItem />
            </div>
        </aside>
    )
}

export default Sidebar