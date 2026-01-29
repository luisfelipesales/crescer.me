import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";

const navigation = {
  servicos: [
    { name: "Terapia Individual", href: "/abordagem" },
    { name: "Terapia Familiar", href: "/abordagem" },
    { name: "Treinamento de Pais", href: "/abordagem" },
    { name: "Avaliação Psicológica", href: "/abordagem" },
  ],
  empresa: [
    { name: "Sobre Nós", href: "/abordagem" },
    { name: "Nossa Equipe", href: "/equipe" },
    { name: "Carreiras", href: "/carreiras" },
    { name: "Blog", href: "/blog" },
  ],
  suporte: [
    { name: "Contato", href: "/contato" },
    { name: "FAQ", href: "/faq" },
    { name: "Portal do Paciente", href: "/entrar" },
    { name: "Emergências", href: "/emergencia" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl">
                🌱
              </div>
              <div>
                <span className="font-display text-xl font-bold">Crescer</span>
                <p className="text-xs text-background/60 uppercase tracking-wider">
                  Saúde mental infantojuvenil
                </p>
              </div>
            </div>

            <p className="max-w-sm text-background/70 text-sm leading-relaxed">
              Cuidamos da saúde mental de crianças, adolescentes e suas famílias 
              com uma abordagem acolhedora e baseada em evidências científicas.
            </p>

            <div className="flex gap-3">
              <a
                href="https://instagram.com/crescer.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/crescer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/crescer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10 hover:bg-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            <a
              href="mailto:contato@crescer.me"
              className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              contato@crescer.me
            </a>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-display text-sm font-semibold mb-4 text-background/90">
              Serviços
            </h3>
            <ul className="space-y-3">
              {navigation.servicos.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold mb-4 text-background/90">
              Empresa
            </h3>
            <ul className="space-y-3">
              {navigation.empresa.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold mb-4 text-background/90">
              Suporte
            </h3>
            <ul className="space-y-3">
              {navigation.suporte.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <p className="text-xs text-background/40 text-center mb-6 max-w-3xl mx-auto">
            *Indicadores internos de acompanhamento. Resultados variam conforme o caso e dependem de frequência, adesão e contexto familiar/escolar.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-background/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} Crescer. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs text-background/50">
              <Link to="/privacidade" className="hover:text-background transition-colors">
                Privacidade
              </Link>
              <Link to="/termos" className="hover:text-background transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
