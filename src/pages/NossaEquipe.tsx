import { Layout } from "@/components/layout/Layout";
import { GraduationCap, Award, Heart } from "lucide-react";

const teamMembers = [
  {
    name: "Dra. Carolina Mendes",
    role: "Diretora Clínica",
    specialty: "Psicóloga Infantil - CRP 06/12345",
    education: "Doutorado em Psicologia Clínica - USP",
    experience: "15 anos de experiência",
    areas: ["Ansiedade Infantil", "TDAH", "Transtornos de Aprendizagem"],
    image: "CM",
  },
  {
    name: "Dr. Rafael Santos",
    role: "Psiquiatra Infantil",
    specialty: "Psiquiatra - CRM 54321",
    education: "Especialização em Psiquiatria Infantil - UNIFESP",
    experience: "12 anos de experiência",
    areas: ["Transtornos do Humor", "TDAH", "Autismo"],
    image: "RS",
  },
  {
    name: "Dra. Juliana Costa",
    role: "Psicóloga",
    specialty: "Psicóloga - CRP 06/67890",
    education: "Mestrado em TCC - PUC-SP",
    experience: "8 anos de experiência",
    areas: ["Depressão", "Fobia Social", "Terapia Familiar"],
    image: "JC",
  },
  {
    name: "Dra. Mariana Oliveira",
    role: "Neuropsicóloga",
    specialty: "Neuropsicóloga - CRP 06/11111",
    education: "Especialização em Neuropsicologia - Einstein",
    experience: "10 anos de experiência",
    areas: ["Avaliação Neuropsicológica", "TDAH", "Dislexia"],
    image: "MO",
  },
  {
    name: "Dr. Pedro Almeida",
    role: "Psicólogo",
    specialty: "Psicólogo - CRP 06/22222",
    education: "Especialização em Terapia Infantil - Mackenzie",
    experience: "6 anos de experiência",
    areas: ["Ansiedade", "TOC", "Medos e Fobias"],
    image: "PA",
  },
  {
    name: "Dra. Fernanda Lima",
    role: "Psicóloga",
    specialty: "Psicóloga - CRP 06/33333",
    education: "Mestrado em Desenvolvimento Infantil - UFRJ",
    experience: "9 anos de experiência",
    areas: ["Treinamento de Pais", "Comportamento", "Sono Infantil"],
    image: "FL",
  },
];

const highlights = [
  {
    icon: GraduationCap,
    title: "Formação de excelência",
    description:
      "Todos os profissionais possuem formação em instituições renomadas e especialização em saúde mental infantojuvenil.",
  },
  {
    icon: Award,
    title: "Atualização constante",
    description:
      "Nossa equipe participa regularmente de congressos, cursos e supervisões para oferecer o que há de mais moderno na área.",
  },
  {
    icon: Heart,
    title: "Dedicação ao paciente",
    description:
      "Cada membro da equipe compartilha a missão de cuidar com empatia, respeito e compromisso com os melhores resultados.",
  },
];

export default function NossaEquipe() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Nossa equipe
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Profissionais dedicados ao{" "}
              <span className="text-primary">bem-estar infantil</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Nossa equipe multidisciplinar é formada por psicólogos, psiquiatras
              e neuropsicólogos especializados em crianças e adolescentes.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-border py-12">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Conheça nossos especialistas
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada profissional traz uma combinação única de experiência e
              especialização
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white">
                    {member.image}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.specialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Formação
                    </p>
                    <p className="text-sm text-foreground">{member.education}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Experiência
                    </p>
                    <p className="text-sm text-foreground">{member.experience}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Áreas de Atuação
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.areas.map((area, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Pronto para dar o primeiro passo?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Agende uma consulta inicial gratuita com um de nossos especialistas e
            descubra como podemos ajudar sua família.
          </p>
          <a
            href="/agendar"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Agendar consulta gratuita
          </a>
        </div>
      </section>
    </Layout>
  );
}
