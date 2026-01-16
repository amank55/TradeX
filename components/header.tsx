import Image from "next/image"
import Link from "next/link"
import NavItems from "./navItems"
import UserDropdown from "./UserDropdown"

const Header = async ({ user }: { user: User })=> {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="container header-wrapper flex items-center px-4 py-3">
        {/* Left: logo */}
        <div className="flex-none">
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              alt="Tradexlogo"
              width={140}
              height={32}
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
        </div>
        <nav className="hidden sm:flex flex-1 items-center justify-center">
          <NavItems />
        </nav>
        <div className="flex-none ml-4">
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  )
}

export default Header