
import MenuItem from './MenuItem'
interface SidebarProps {
    isOpen: boolean,
    onClose: () => void
}
function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <aside
            className={`fixed top-15 left-0 z-20 overflow-y-auto h-[calc(100vh-60px)] w-64 border-r bg-white shadow-slate-900/30 transition-transform duration-300 rounded-r-3xl md:rounded-none ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
        >
            <div className="flex h-full flex-col px-3 py-4">
                <MenuItem onClose={onClose} />
            </div>
        </aside>
    )
}

export default Sidebar