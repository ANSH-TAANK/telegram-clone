'use client'

import { usePathname } from "next/navigation"

function Header() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");
    
  return (
    <div>Header</div>
  )
}

export default Header