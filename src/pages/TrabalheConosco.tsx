import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, TrendingUp, Users, BookOpen, Clock, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const benefits = [{
  icon: Heart,
  title: "Propósito",
  description: "Trabalhe com algo que faz diferença real na vida de crianças e famílias"
}, {
  icon: TrendingUp,
  title: "Crescimento",
  description: "Oportunidades de desenvolvimento profissional e supervisão clínica"
}, {
  icon: Users,
  title: "Equipe",
  description: "Ambiente colaborativo com profissionais experientes e dedicados"
}, {
  icon: BookOpen,
  title: "Formação",
  description: "Acesso a treinamentos, cursos e congressos na área"
}, {
  icon: Clock,
  title: "Flexibilidade",
  description: "Horários flexíveis e possibilidade de trabalho híbrido"
}, {
  icon: MapPin,
  title: "Localização",
  description: "Clínica moderna em localização privilegiada"
}];
const openPositions = [{
  title: "Psicólogo(a) Infantil",
  type: "CLT ou PJ",
  location: "São Paulo - SP",
  requirements: ["CRP ativo", "Experiência com crianças", "Formação em TCC (desejável)"]
}, {
  title: "Neuropsicólogo(a)",
  type: "PJ",
  location: "São Paulo - SP",
  requirements: ["CRP ativo", "Especialização em Neuropsicologia", "Experiência com avaliações infantis"]
}, {
  title: "Psiquiatra Infantil",
  type: "PJ",
  location: "São Paulo - SP",
  requirements: ["CRM ativo", "RQE em Psiquiatria Infantil", "Disponibilidade mínima de 8h/semana"]
}];
export default function TrabalheConosco() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Candidatura enviada com sucesso! Entraremos em contato em breve.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      message: ""
    });
    setIsSubmitting(false);
  };
  return <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground">
              Carreiras
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Faça parte da nossa{" "}
              <span className="text-primary">missão</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Buscamos profissionais apaixonados por transformar vidas de crianças
              e adolescentes através de cuidado de excelência em saúde mental.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Por que trabalhar conosco?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Oferecemos muito mais do que um emprego
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => <div key={index} className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">Vagas abertas</h2>
            <p className="mt-4 text-muted-foreground">
              Confira nossas oportunidades atuais
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {openPositions.map((position, index) => <div key={index} className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {position.title}
                    </h3>
                    
                  </div>
                  <Button variant="outline" className="shrink-0" onClick={() => setFormData({
                ...formData,
                position: position.title
              })}>
                    Candidatar-se
                  </Button>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Requisitos
                  </p>
                  <ul className="space-y-1">
                    {position.requirements.map((req, i) => <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-foreground">{req}</span>
                      </li>)}
                  </ul>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Envie sua candidatura
              </h2>
              <p className="mt-4 text-muted-foreground">
                Preencha o formulário abaixo e anexe seu currículo. Entraremos em
                contato em até 5 dias úteis.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} required placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} required placeholder="seu@email.com" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} required placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Vaga de interesse</Label>
                  <Input id="position" value={formData.position} onChange={e => setFormData({
                  ...formData,
                  position: e.target.value
                })} placeholder="Ex: Psicólogo Infantil" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Sobre você</Label>
                <Textarea id="message" value={formData.message} onChange={e => setFormData({
                ...formData,
                message: e.target.value
              })} placeholder="Conte-nos sobre sua experiência e motivação para trabalhar conosco..." rows={4} />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Ao enviar, você concorda com nossa política de privacidade.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>;
}