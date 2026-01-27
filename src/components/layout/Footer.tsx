import { Link } from "react-router-dom";
import { Heart, Mail, Instagram } from "lucide-react";
const navigation = {
  servicos: [{
    name: "Terapia Individual",
    href: "/abordagem"
  }, {
    name: "Terapia Familiar",
    href: "/abordagem"
  }, {
    name: "Treinamento de Pais",
    href: "/abordagem"
  }, {
    name: "Avaliação Psicológica",
    href: "/abordagem"
  }],
  empresa: [{
    name: "Sobre Nós",
    href: "/abordagem"
  }, {
    name: "Nossa Equipe",
    href: "/equipe"
  }, {
    name: "Carreiras",
    href: "/carreiras"
  }, {
    name: "Blog",
    href: "/blog"
  }],
  suporte: [{
    name: "Contato",
    href: "/contato"
  }, {
    name: "FAQ",
    href: "/faq"
  }, {
    name: "Portal do Paciente",
    href: "/entrar"
  }, {
    name: "Emergências",
    href: "/emergencia"
  }]
};
export function Footer() {
  return <footer className="bg-foreground text-background">
      <div className="container-custom py-10">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">Crescer</span>
                <p className="text-xs text-background/70">Saúde mental infantojuvenil</p>
              </div>
            </div>

            <p className="text-sm text-background/80 leading-relaxed max-w-sm">
              Cuidamos da saúde mental de crianças, adolescentes e suas famílias 
              com abordagem acolhedora e baseada em evidências.
            </p>

            <div className="flex items-center gap-4">
              <a href="mailto:contato@crescer.me" className="flex items-center gap-2 text-sm text-background/80 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                <span>contato@crescer.me</span>
              </a>
              <a href="https://instagram.com/crescer.me" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-display text-sm font-semibold mb-3">Serviços</h3>
            <ul className="space-y-2">
              {navigation.servicos.map(item => <li key={item.name}>
                  <Link to={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold mb-3">Empresa</h3>
            <ul className="space-y-2">
              {navigation.empresa.map(item => <li key={item.name}>
                  <Link to={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold mb-3">Suporte</h3>
            <ul className="space-y-2">
              {navigation.suporte.map(item => <li key={item.name}>
                  <Link to={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-background/10">
          <p className="text-xs text-background/50 text-center mb-4">
            *Indicadores internos de acompanhamento. Resultados variam conforme o caso e dependem de frequência, adesão e contexto familiar/escolar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-background/60">
              © {new Date().getFullYear()} Crescer. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 text-xs text-background/60">
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
    </footer>;
}