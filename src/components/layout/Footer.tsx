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
      <div className="container-custom section-padding">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Brand and Contact */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">Crescer</span>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <a href="mailto:contato@crescer.me" className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors">
                <Mail className="h-5 w-5" />
                <span>contato@crescer.me</span>
              </a>
              <a href="https://instagram.com/crescer.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
                <span>@crescer.me</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-semibold mb-4">
                Serviços
              </h3>
              <ul className="space-y-3">
                {navigation.servicos.map(item => <li key={item.name}>
                    <Link to={item.href} className="text-background/70 hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </li>)}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold mb-4">
                Empresa
              </h3>
              <ul className="space-y-3">
                {navigation.empresa.map(item => <li key={item.name}>
                    <Link to={item.href} className="text-background/70 hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </li>)}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold mb-4">
                Suporte
              </h3>
              <ul className="space-y-3">
                {navigation.suporte.map(item => <li key={item.name}>
                    <Link to={item.href} className="text-background/70 hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <p className="text-xs text-background/50 text-center mb-6">
            *Indicadores internos de acompanhamento. Resultados variam conforme o caso e dependem de frequência, adesão e contexto familiar/escolar.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-background/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} Crescer. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-background/60">
              <Link to="/privacidade" className="hover:text-background transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-background transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}