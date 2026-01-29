import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, Calendar, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Nossa abordagem", href: "/abordagem" },
  { name: "Nossa equipe", href: "/equipe" },
  { name: "Blog", href: "/blog" },
  { name: "Trabalhe conosco", href: "/carreiras" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/40">
      <nav className="container-custom flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-2xl">
            🌱
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-foreground">
              Crescer
            </span>
            <span className="hidden text-[10px] text-muted-foreground uppercase tracking-wider lg:block">
              Saúde mental infantojuvenil
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
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
            </>
          ) : (
            <>
              <Link to="/entrar">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Criar conta
                </Button>
              </Link>
              <Link to="/entrar">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/agendar">
                <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar consulta
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]" aria-describedby={undefined}>
            <VisuallyHidden>
              <SheetTitle>Menu de navegação</SheetTitle>
            </VisuallyHidden>
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-2xl">
                  🌱
                </div>
                <span className="font-display text-xl font-bold">Crescer</span>
              </Link>

              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium transition-colors rounded-lg",
                      location.pathname === item.href
                        ? "text-primary bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t">
                {user ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Link to="/entrar" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/agendar" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Agendar consulta
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
