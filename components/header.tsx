import Image from "next/image"
import Link from "next/link"
import NavItems from "./navItems"
import UserDropdown from "./UserDropdown"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* make this a flex row so logo and nav sit on the same line */}
      <div className="container header-wrapper flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Tradexlogo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>

        {/* show nav as flex from sm and align its children (nav items + avatar) horizontally */}
        <nav className="hidden sm:flex items-center gap-6">
          <NavItems />
          <UserDropdown />
        </nav>
      </div>
    </header>
  )
}

export default Header