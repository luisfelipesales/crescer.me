import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CreditCard,
  Building2,
  Receipt,
  Shield,
  Phone,
  MessageCircle,
} from "lucide-react";

const insurances = [
  { name: "Bradesco Saúde", logo: "🏥" },
  { name: "SulAmérica", logo: "🏥" },
  { name: "Amil", logo: "🏥" },
  { name: "Unimed", logo: "🏥" },
  { name: "Porto Seguro", logo: "🏥" },
  { name: "NotreDame Intermédica", logo: "🏥" },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Cartão de Crédito",
    description: "Aceitamos as principais bandeiras. Parcelamento em até 12x.",
  },
  {
    icon: CreditCard,
    title: "Cartão de Débito",
    description: "Débito nas principais bandeiras.",
  },
  {
    icon: Building2,
    title: "PIX",
    description: "Pagamento instantâneo com QR Code.",
  },
  {
    icon: Building2,
    title: "Transferência Bancária",
    description: "TED ou DOC para nossa conta.",
  },
];

const pricingPlans = [
  {
    name: "Consulta Individual",
    description: "Sessão de 50 minutos",
    price: "R$ 250",
    period: "por sessão",
    features: [
      "Atendimento presencial ou online",
      "Acompanhamento personalizado",
      "Relatórios quando necessário",
      "Comunicação entre sessões",
    ],
    popular: false,
  },
  {
    name: "Pacote Mensal",
    description: "4 sessões por mês",
    price: "R$ 900",
    period: "por mês",
    features: [
      "4 sessões de 50 minutos",
      "Economia de R$ 100",
      "Horário fixo garantido",
      "Flexibilidade para remarcação",
      "Suporte prioritário",
    ],
    popular: true,
  },
  {
    name: "Avaliação Neuropsicológica",
    description: "Avaliação completa",
    price: "R$ 1.800",
    period: "total",
    features: [
      "Entrevista inicial com pais",
      "Sessões de testagem",
      "Relatório detalhado",
      "Devolutiva com orientações",
      "Encaminhamentos se necessário",
    ],
    popular: false,
  },
];

const benefits = [
  {
    icon: Receipt,
    title: "Nota Fiscal",
    description: "Emitimos nota fiscal para todas as consultas, permitindo dedução no Imposto de Renda.",
  },
  {
    icon: Shield,
    title: "Reembolso",
    description: "Fornecemos toda documentação para você solicitar reembolso ao seu plano de saúde.",
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Pacotes e avaliações podem ser parcelados no cartão de crédito.",
  },
];

export default function Pagamentos() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Formas de pagamento
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Investindo no{" "}
              <span className="text-primary">bem-estar</span> da sua família
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Oferecemos diferentes opções de pagamento para facilitar o acesso
              ao tratamento de qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Insurances */}
      <section className="border-b border-border py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Convênios aceitos
            </h2>
            <p className="mt-2 text-muted-foreground">
              Atendemos os principais planos de saúde
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {insurances.map((insurance, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-xl bg-card border border-border px-6 py-4 shadow-sm"
              >
                <span className="text-2xl">{insurance.logo}</span>
                <span className="font-medium text-foreground">
                  {insurance.name}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não encontrou seu convênio?{" "}
            <a href="/contato" className="text-primary hover:underline">
              Entre em contato
            </a>{" "}
            para verificar cobertura ou opções de reembolso.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Valores particulares
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Para atendimentos particulares, oferecemos opções flexíveis que
              cabem no seu orçamento.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative h-full ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Agendar consulta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-muted/30 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Formas de pagamento
            </h2>
            <p className="mt-2 text-muted-foreground">
              Múltiplas opções para sua conveniência
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{method.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Dúvidas sobre pagamento?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Entre em contato conosco para esclarecer qualquer dúvida sobre
            valores, convênios ou formas de pagamento.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </a>
            <a href="tel:+551134567890">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-primary-foreground hover:bg-white/10"
              >
                <Phone className="mr-2 h-5 w-5" />
                Ligar agora
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
