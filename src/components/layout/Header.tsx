import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, Phone, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
const navigation = [{
  name: "Início",
  href: "/"
}, {
  name: "Nossa abordagem",
  href: "/abordagem"
}, {
  name: "Nossa equipe",
  href: "/equipe"
}, {
  name: "Trabalhe conosco",
  href: "/carreiras"
}, {
  name: "Contato",
  href: "/contato"
}];
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-custom flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-foreground lg:text-xl">Crescer</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Saúde mental infantojuvenil
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map(item => <Link key={item.name} to={item.href} className={cn("px-4 py-2 text-sm font-medium transition-colors rounded-lg", location.pathname === item.href ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
              {item.name}
            </Link>)}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Meu portal
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </> : <>
              <Link to="/entrar">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/contato">
                <Button size="sm" className="btn-shadow">
                  <Phone className="mr-2 h-4 w-4" />
                  Agendar consulta
                </Button>
              </Link>
            </>}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">
                  Crescer
                </span>
              </Link>

              <nav className="flex flex-col gap-1">
                {navigation.map(item => <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className={cn("px-4 py-3 text-base font-medium transition-colors rounded-lg", location.pathname === item.href ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    {item.name}
                  </Link>)}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t">
                {user ? <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Meu portal
                      </Button>
                    </Link>
                    <Button className="w-full" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </> : <>
                    <Link to="/entrar" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/contato" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        Agendar consulta
                      </Button>
                    </Link>
                  </>}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>;
}