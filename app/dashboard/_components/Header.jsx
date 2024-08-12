"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function Header() {

    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [path])

    return (
        <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
            <Image src="/logo.svg" width={160} height={100} alt="logo" />

            <ul className='hidden md:flex gap-4'>
                <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/dashboard' && 'text-primary font-bold'}`}>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/dashboard/questions' && 'text-primary font-bold'}`}>
                    <Link href="/dashboard/questions">Questions</Link>
                </li>

                <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path == '/dashboard/how' && 'text-primary font-bold'}`}>
                    <Link href="/dashboard/how">How it Works</Link>
                </li>
            </ul>
            <UserButton />
        </div>
    )
}

export default Header
