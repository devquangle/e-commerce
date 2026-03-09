import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <div className="_logo flex items-center">
            <Link to="/home" className="flex justify-center items-center gap-2  text-xl font-bold text-indigo-500">
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
                <span>BookStore</span>
            </Link>
        </div>
    )
}
