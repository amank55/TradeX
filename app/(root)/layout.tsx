import Header from "@/components/header"
const Layout = ({children}: {children:React.ReactNode}) => {
  return (
  <main className="min-h-screen text-gray-400">
    <div className="container py-10">
        <Header/>
        {children}
    </div>
  </main>
  )
}
export default Layout