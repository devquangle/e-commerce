
import Logo from './Logo'
import MenuItem from './MenuItem'
interface MobileDrawerProps {
    isOpen: boolean,
    onClose: () => void
}

function MobileDrawer({
    isOpen,
    onClose,
}: MobileDrawerProps) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-white z-40 transform transition lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex h-15 items-center justify-between p-4 border-b">
                    <Logo />
                    <button className="cursor-pointer" onClick={onClose}>
                        <svg
                            className="w-8 h-8 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
                    <MenuItem className='space-y-2' />
                   
                </div>
            </div>
        </>
    )
}

export default MobileDrawer