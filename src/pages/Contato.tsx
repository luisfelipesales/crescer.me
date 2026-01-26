import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, MessageCircle, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    question: "A primeira consulta é realmente gratuita?",
    answer:
      "Sim! Oferecemos uma consulta inicial gratuita de 30 minutos para conhecer a família, entender as necessidades e explicar como funciona nosso tratamento.",
  },
  {
    question: "Vocês atendem por convênio?",
    answer:
      "No momento trabalhamos apenas com atendimento particular. Fornecemos recibo para solicitar reembolso junto ao seu plano de saúde.",
  },
  {
    question: "Como funciona o agendamento?",
    answer:
      "Você pode agendar pelo WhatsApp, pelo formulário nesta página ou pelo Portal do Paciente. Nossa equipe entrará em contato para confirmar o melhor horário.",
  },
  {
    question: "Qual a duração das sessões?",
    answer:
      "As sessões de terapia têm duração de 50 minutos. O atendimento é 100% online via teleconsulta.",
  },
];

export default function Contato() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Contato
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Estamos aqui para{" "}
              <span className="text-primary">ajudar</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Entre em contato conosco para agendar uma consulta gratuita ou tirar
              suas dúvidas. Nossa equipe está pronta para atendê-lo.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Envie uma mensagem
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Preencha o formulário e retornaremos o mais breve possível.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Ex: Agendamento de consulta"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    placeholder="Como podemos ajudar?"
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>

            {/* FAQ + Quick Actions */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
                <Calendar className="mb-4 h-10 w-10" />
                <h3 className="font-display text-2xl font-bold">
                  Agende sua consulta gratuita
                </h3>
                <p className="mt-2 text-primary-foreground/80">
                  Primeira consulta de 30 minutos sem custo para conhecer nossa
                  equipe e entender como podemos ajudar.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                    asChild
                  >
                    <a
                      href="https://wa.me/5511999998888"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <h4 className="font-medium text-foreground">
                        {faq.question}
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}