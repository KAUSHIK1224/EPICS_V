import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Bird } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Species", path: "/species" },
    { label: "Gallery", path: "/gallery" },
    { label: "Visit Info", path: "/visit" },
    { label: "Location", path: "/location" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md -ml-2">
          <Bird className="h-6 w-6 text-primary" data-testid="icon-logo" />
          <span className="font-semibold text-lg text-foreground" data-testid="text-brand">Vedanthangal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button variant="ghost" size="sm" data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}>
                {item.label}
              </Button>
            </Link>
          ))}
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="link-admin">
              Admin
            </Button>
          </Link>
          <Link href="/book">
            <Button className="ml-2" size="sm" data-testid="button-book-visit">
              Book Visit
            </Button>
          </Link>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-2 mt-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                  data-testid="link-mobile-admin"
                >
                  Admin
                </Button>
              </Link>
              <Link href="/book">
                <Button
                  className="w-full"
                  onClick={() => setOpen(false)}
                  data-testid="button-mobile-book-visit"
                >
                  Book Visit
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
