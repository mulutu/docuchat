import Link from 'next/link'
import { getUserById } from "@/lib/actions/user.actions";
import MaxWidthWrapper from './MaxWidthWrapper'
import { Button, buttonVariants } from './ui/button'
import { SignedIn, auth } from "@clerk/nextjs";

const Navbar = async () => {

    const { userId } = auth();
    const user = await getUserById(userId);

    return (
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link
                        href='/'
                        className='flex z-40 font-semibold'>
                        <span>docuChat.</span>
                    </Link>

                    <div className='hidden items-center space-x-4 sm:flex'>
                        <>
                            <Link
                                href='/pricing'
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}>
                                Pricing
                            </Link>
                            <Link href="/sign-in">Login</Link>
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar
