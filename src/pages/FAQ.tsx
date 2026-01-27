import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    title: "Sobre o Atendimento",
    faqs: [
      {
        question: "Como funciona a primeira consulta?",
        answer:
          "A primeira consulta é uma sessão de avaliação onde conhecemos você ou seu filho(a), entendemos as queixas e definimos o melhor plano de tratamento. Essa sessão costuma durar entre 50-60 minutos.",
      },
      {
        question: "Vocês atendem crianças de qual idade?",
        answer:
          "Atendemos crianças a partir dos 2 anos de idade até adolescentes de 17 anos. Temos psicólogos especializados em cada faixa etária.",
      },
      {
        question: "Qual a duração das sessões?",
        answer:
          "As sessões regulares têm duração de 50 minutos. Avaliações neuropsicológicas e algumas intervenções específicas podem ter duração diferente.",
      },
      {
        question: "Vocês atendem online?",
        answer:
          "Sim! Nosso atendimento é 100% online (teleconsulta), permitindo que você receba acompanhamento de qualidade de qualquer lugar.",
      },
      {
        question: "Com que frequência as sessões acontecem?",
        answer:
          "Geralmente as sessões são semanais, mas a frequência pode variar conforme o caso. O plano de tratamento é sempre personalizado.",
      },
    ],
  },
  {
    title: "Agendamento e Cancelamento",
    faqs: [
      {
        question: "Como faço para agendar uma consulta?",
        answer:
          "Você pode agendar pelo nosso site ou e-mail. Também é possível agendar diretamente pelo Portal do Paciente após criar sua conta.",
      },
      {
        question: "Qual a política de cancelamento?",
        answer:
          "Pedimos que cancelamentos sejam feitos com pelo menos 24 horas de antecedência. Cancelamentos de última hora ou faltas sem aviso podem ser cobrados.",
      },
      {
        question: "Posso reagendar minha consulta?",
        answer:
          "Sim! Você pode reagendar pelo Portal do Paciente ou entrando em contato conosco via e-mail. Lembre-se de avisar com antecedência.",
      },
    ],
  },
  {
    title: "Pagamento",
    faqs: [
      {
        question: "Vocês aceitam convênios?",
        answer:
          "No momento não trabalhamos diretamente com convênios. Oferecemos atendimento particular e possibilidade de reembolso junto ao seu plano de saúde.",
      },
      {
        question: "Como funciona o pagamento particular?",
        answer:
          "Para pagamentos particulares, aceitamos cartões de crédito, débito, PIX e transferência bancária. O pagamento deve ser feito no dia da consulta ou antecipadamente.",
      },
      {
        question: "Vocês emitem nota fiscal?",
        answer:
          "Sim, emitimos recibo ou nota fiscal para todas as consultas, o que permite dedução no Imposto de Renda como despesa médica.",
      },
      {
        question: "Como funciona o reembolso?",
        answer:
          "Fornecemos toda a documentação necessária para você solicitar o reembolso junto ao seu plano de saúde. O valor reembolsado depende da cobertura do seu convênio.",
      },
    ],
  },
  {
    title: "Tratamentos e Especialidades",
    faqs: [
      {
        question: "Quais condições vocês tratam?",
        answer:
          "Tratamos ansiedade, depressão, TDAH, autismo, dificuldades de aprendizagem, problemas comportamentais, fobias, TOC, problemas de sono, entre outros. Cada caso é avaliado individualmente.",
      },
      {
        question: "Vocês fazem avaliação neuropsicológica?",
        answer:
          "Sim! Realizamos avaliações neuropsicológicas completas para diagnóstico de TDAH, dislexia, discalculia e outras condições que afetam a aprendizagem e o comportamento.",
      },
      {
        question: "Os pais participam do tratamento?",
        answer:
          "Com certeza! Acreditamos que o envolvimento da família é essencial para o sucesso do tratamento. Oferecemos orientação parental e sessões conjuntas quando indicado.",
      },
      {
        question: "Qual a abordagem terapêutica utilizada?",
        answer:
          "Utilizamos principalmente a Terapia Cognitivo-Comportamental (TCC), que é uma abordagem baseada em evidências científicas e muito eficaz para crianças e adolescentes.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Perguntas Frequentes
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Tire suas <span className="text-primary">dúvidas</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Reunimos as perguntas mais comuns sobre nossos serviços. Se não
              encontrar o que procura, estamos à disposição para ajudar.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom max-w-4xl">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="rounded-lg border border-border bg-card px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Ainda tem dúvidas?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nossa equipe está pronta para ajudar você. Entre em contato pelos
              canais abaixo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a href="mailto:contato@crescer.me">
                <Button size="lg" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-5 w-5" />
                  E-mail
                </Button>
              </a>
              <Link to="/contato">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Formulário
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
