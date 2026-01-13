import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            Banking App
          </Link>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
