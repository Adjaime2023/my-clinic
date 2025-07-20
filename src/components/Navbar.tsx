'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const toggleMenu = () => setIsOpen(!isOpen)

    const userImage = session?.user?.image || ''
    const userName = session?.user?.name?.split(' ')[0] || 'Usuário'

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md px-4 py-3 text-black dark:text-white">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    MeuSite
                </Link>

                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Abrir menu"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    aria-controls="mobile-menu"
                    className="md:hidden text-gray-800 dark:text-white focus:outline-none"
                >
                    {isOpen ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Menu Desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
                    {session && <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>}

                    {status === 'loading' ? (
                        <span className="text-gray-500 dark:text-gray-300">Carregando...</span>
                    ) : session ? (
                        <>
                            {userImage && (
                                <Image
                                    src={userImage}
                                    alt="Avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full border"
                                />
                            )}
                            <span className="text-sm">{userName}</span>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Menu Mobile */}
            {isOpen && (
                <div id="mobile-menu" className="md:hidden mt-2 space-y-2 px-2">
                    <Link href="/" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                        Home
                    </Link>
                    {session && (
                        <Link href="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                            Dashboard
                        </Link>
                    )}

                    {status === 'loading' ? (
                        <span className="block px-3 text-gray-500 dark:text-gray-300">Carregando...</span>
                    ) : session ? (
                        <>
                            <div className="flex items-center gap-2 px-3">
                                {userImage && (
                                    <Image
                                        src={userImage}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full border"
                                    />
                                )}
                                <span className="text-sm">{userName}</span>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left py-2 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="w-full text-left py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}
