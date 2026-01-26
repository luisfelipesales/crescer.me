import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Phone, Heart, MessageCircle, AlertTriangle, Clock, MapPin } from "lucide-react";

const emergencyContacts = [
  {
    name: "CVV - Centro de Valorização da Vida",
    number: "188",
    description: "Apoio emocional e prevenção do suicídio. Atendimento 24 horas, todos os dias.",
    type: "gratuito",
    available: "24 horas",
    website: "www.cvv.org.br",
  },
  {
    name: "SAMU",
    number: "192",
    description: "Serviço de Atendimento Móvel de Urgência para emergências médicas.",
    type: "gratuito",
    available: "24 horas",
  },
  {
    name: "Polícia Militar",
    number: "190",
    description: "Para situações de risco imediato ou violência.",
    type: "gratuito",
    available: "24 horas",
  },
  {
    name: "Disque Denúncia - Crimes contra Crianças",
    number: "100",
    description: "Denúncia de violência, abuso ou negligência contra crianças e adolescentes.",
    type: "gratuito",
    available: "24 horas",
  },
  {
    name: "CAPS - Centro de Atenção Psicossocial",
    number: "Consulte a UBS local",
    description: "Atendimento de saúde mental pelo SUS. Procure a unidade mais próxima.",
    type: "público",
    available: "Horário comercial",
  },
  {
    name: "UPA - Unidade de Pronto Atendimento",
    number: "Consulte Google Maps",
    description: "Atendimento de urgência, incluindo crises de saúde mental.",
    type: "público",
    available: "24 horas",
  },
];

const supportTips = [
  {
    title: "Respire fundo",
    description: "Faça respirações lentas e profundas. Inspire por 4 segundos, segure por 4 segundos, expire por 4 segundos.",
  },
  {
    title: "Você não está sozinho(a)",
    description: "Milhões de pessoas já passaram por momentos difíceis e encontraram ajuda. Você também pode.",
  },
  {
    title: "Fale com alguém",
    description: "Compartilhar o que você está sentindo com alguém de confiança pode ajudar muito.",
  },
  {
    title: "Busque um lugar seguro",
    description: "Se puder, vá para um ambiente tranquilo onde você se sinta protegido(a).",
  },
];

export default function Emergencia() {
  return (
    <Layout>
      {/* Hero Section with Alert */}
      <section className="bg-gradient-to-b from-destructive/5 to-background py-12 md:py-16">
        <div className="container-custom">
          <Alert className="mb-8 border-primary bg-primary/5">
            <Heart className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold text-foreground">
              Você não está sozinho(a)
            </AlertTitle>
            <AlertDescription className="mt-2 text-muted-foreground">
              Se você está passando por um momento difícil, saiba que existem
              pessoas prontas para ajudar. Não hesite em pedir ajuda.
            </AlertDescription>
          </Alert>

          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-destructive/10 px-4 py-1.5 text-sm font-medium text-destructive">
              Ajuda de emergência
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Contatos de{" "}
              <span className="text-primary">apoio</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Aqui você encontra números de telefone e serviços de apoio em
              saúde mental disponíveis no Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* Main Emergency Contact - CVV */}
      <section className="py-8">
        <div className="container-custom">
          <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="flex flex-col items-center gap-6 p-8 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm font-medium text-primary">
                  Precisando conversar agora?
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                  Ligue para o CVV: 188
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Atendimento 24 horas, gratuito, sigilo total. Você pode ligar ou acessar www.cvv.org.br
                </p>
              </div>
              <a href="tel:188">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Phone className="mr-2 h-6 w-6" />
                  Ligar 188
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Tips */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
            Enquanto você busca ajuda
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportTips.map((tip, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-foreground">
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Emergency Contacts */}
      <section className="bg-muted/30 py-16">
        <div className="container-custom">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">
            Contatos úteis
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">
                      {contact.name}
                    </CardTitle>
                    {contact.type === "gratuito" && (
                      <Badge variant="secondary">
                        Gratuito
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {contact.available}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {contact.number}
                    </span>
                  </div>
                  {contact.website && (
                    <a
                      href={`https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {contact.website}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-12">
        <div className="container-custom">
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertTitle className="font-semibold text-foreground">
              Em caso de emergência médica
            </AlertTitle>
            <AlertDescription className="mt-2 text-muted-foreground">
              Se você ou alguém próximo está em risco imediato de vida, ligue
              para o <strong>SAMU (192)</strong> ou vá imediatamente ao pronto-socorro
              mais próximo. Não espere.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Our Support */}
      <section className="border-t border-border bg-card py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Nossa clínica também pode ajudar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Se você precisa de acompanhamento profissional, nossa equipe está
              pronta para acolher você. Agende uma consulta e dê o primeiro
              passo para o seu bem-estar.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
              <a href="/agendar">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Agendar consulta
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
