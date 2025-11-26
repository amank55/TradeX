import Image from "next/image"
import Link from "next/link"

const Header = () => {
  return (
   <header className="fixed top-0 left-0 right-0 z-50 w-full">
    <div className="container header-wrapper">
        <Link href= "/">
        <Image src="/assets/icons/logo.png" alt="Tradexlogo" width={140} height={32} className="h-8 w-auto cursor-pointer"/>
        </Link>
    </div>
   </header>
  )
}
export default Header