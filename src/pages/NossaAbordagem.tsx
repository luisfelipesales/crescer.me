import { Layout } from "@/components/layout/Layout";
import { Brain, Users, Target, CheckCircle, Heart, Sparkles } from "lucide-react";

const methodologies = [
  {
    icon: Brain,
    title: "Terapia Cognitivo-Comportamental (TCC)",
    description:
      "Abordagem baseada em evidências científicas que ajuda crianças e adolescentes a identificar e modificar padrões de pensamento e comportamento que causam sofrimento.",
    benefits: [
      "Resultados comprovados cientificamente",
      "Foco em soluções práticas",
      "Desenvolvimento de habilidades para a vida",
      "Sessões estruturadas e objetivas",
    ],
  },
  {
    icon: Users,
    title: "Treinamento de Pais",
    description:
      "Programa especializado que capacita pais e cuidadores com estratégias eficazes para apoiar o desenvolvimento emocional e comportamental de seus filhos.",
    benefits: [
      "Melhora na comunicação familiar",
      "Técnicas de manejo comportamental",
      "Fortalecimento do vínculo",
      "Prevenção de problemas futuros",
    ],
  },
  {
    icon: Target,
    title: "Terapia Focada em Objetivos",
    description:
      "Trabalhamos com metas claras e mensuráveis, garantindo que cada sessão contribua para o progresso do paciente de forma tangível.",
    benefits: [
      "Acompanhamento do progresso",
      "Metas personalizadas",
      "Feedback constante",
      "Celebração de conquistas",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Avaliação Inicial",
    description:
      "Triagem gratuita para entender as necessidades da família e determinar o melhor caminho de tratamento.",
  },
  {
    number: "02",
    title: "Plano Personalizado",
    description:
      "Desenvolvemos um plano de tratamento individualizado baseado nas necessidades específicas de cada paciente.",
  },
  {
    number: "03",
    title: "Sessões Semanais",
    description:
      "Sessões regulares com terapeutas especializados, combinando técnicas comprovadas com uma abordagem acolhedora.",
  },
  {
    number: "04",
    title: "Acompanhamento Contínuo",
    description:
      "Monitoramento do progresso e ajustes no tratamento conforme necessário, com feedback regular para a família.",
  },
];

export default function NossaAbordagem() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Nossa metodologia
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Tratamento baseado em{" "}
              <span className="text-primary">evidências científicas</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Utilizamos as abordagens terapêuticas mais eficazes e comprovadas
              cientificamente para garantir os melhores resultados para crianças,
              adolescentes e suas famílias.
            </p>
          </div>
        </div>
      </section>

      {/* Methodologies Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            {methodologies.map((method, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <method.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                  {method.title}
                </h3>
                <p className="mb-6 text-muted-foreground">{method.description}</p>
                <ul className="space-y-3">
                  {method.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Como funciona o tratamento
            </h2>
            <p className="mt-4 text-muted-foreground">
              Um processo estruturado e acolhedor, do primeiro contato até a alta
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <span className="font-display text-4xl font-bold text-primary/20">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden h-0.5 w-6 bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Nossos valores guiam cada atendimento
              </h2>
              <p className="mt-4 text-muted-foreground">
                Acreditamos que cada criança merece um cuidado único, respeitoso e
                eficaz. Nossa equipe é guiada por princípios que colocam o
                bem-estar do paciente sempre em primeiro lugar.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/20">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Acolhimento sem julgamento
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Criamos um ambiente seguro onde crianças e famílias se
                      sentem ouvidas e respeitadas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Excelência clínica
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nossa equipe está em constante atualização com as melhores
                      práticas e pesquisas da área.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Parceria com a família
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Trabalhamos junto com pais e cuidadores para garantir
                      resultados duradouros.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                      <Brain className="h-10 w-10 text-primary" />
                    </div>
                    <p className="font-display text-xl font-semibold text-foreground">
                      Cuidado especializado
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Para cada fase da infância e adolescência
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
