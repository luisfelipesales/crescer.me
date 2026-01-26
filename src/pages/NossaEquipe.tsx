import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Heart, MapPin, X } from "lucide-react";

interface Therapist {
  name: string;
  credentials: string;
  specialty: string;
  location: string;
  areas: string[];
  bio: string;
  approach: string;
  image: string;
}

const therapists: Therapist[] = [
  {
    name: "Dra. Carolina Mendes",
    credentials: "CRP 06/12345",
    specialty: "Psicóloga Infantil",
    location: "São Paulo, SP",
    areas: ["Ansiedade Infantil", "TDAH", "Transtornos de Aprendizagem"],
    bio: "Especialista em psicologia infantil com formação em Terapia Cognitivo-Comportamental. Diretora clínica da Crescer, dedica-se a ajudar crianças e famílias a superarem desafios emocionais.",
    approach: "Utilizo uma abordagem lúdica e acolhedora, adaptada à idade e às necessidades de cada criança. Trabalho em parceria com as famílias para promover mudanças duradouras.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dra. Juliana Costa",
    credentials: "CRP 06/67890",
    specialty: "Psicóloga Clínica",
    location: "São Paulo, SP",
    areas: ["Depressão", "Fobia Social", "Terapia Familiar"],
    bio: "Mestrado em Terapia Cognitivo-Comportamental pela PUC-SP. Atua com adolescentes e famílias, especialmente em casos de depressão e ansiedade social.",
    approach: "Minha prática é baseada em evidências científicas, com foco no desenvolvimento de habilidades emocionais e sociais que ajudam os jovens a prosperarem.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dra. Mariana Oliveira",
    credentials: "CRP 06/11111",
    specialty: "Neuropsicóloga",
    location: "São Paulo, SP",
    areas: ["Avaliação Neuropsicológica", "TDAH", "Dislexia"],
    bio: "Especialização em Neuropsicologia pelo Hospital Albert Einstein. Realiza avaliações neuropsicológicas completas e acompanhamento de crianças com dificuldades de aprendizagem.",
    approach: "Combino avaliação detalhada com intervenções práticas, trabalhando junto à escola e família para otimizar o desenvolvimento da criança.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. Pedro Almeida",
    credentials: "CRP 06/22222",
    specialty: "Psicólogo Infantil",
    location: "São Paulo, SP",
    areas: ["Ansiedade", "TOC", "Medos e Fobias"],
    bio: "Especialização em Terapia Infantil pela Universidade Mackenzie. Experiência em tratamento de transtornos de ansiedade e TOC em crianças e adolescentes.",
    approach: "Utilizo técnicas de exposição gradual e terapia cognitiva adaptadas para crianças, sempre de forma lúdica e respeitando o ritmo de cada paciente.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dra. Fernanda Lima",
    credentials: "CRP 06/33333",
    specialty: "Psicóloga do Desenvolvimento",
    location: "São Paulo, SP",
    areas: ["Treinamento de Pais", "Comportamento", "Sono Infantil"],
    bio: "Mestrado em Desenvolvimento Infantil pela UFRJ. Especialista em orientação parental e problemas comportamentais na infância.",
    approach: "Acredito que o envolvimento dos pais é essencial. Ofereço orientação prática e estratégias baseadas em evidências para lidar com desafios do dia a dia.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dra. Amanda Santos",
    credentials: "CRP 06/44444",
    specialty: "Psicóloga Clínica",
    location: "São Paulo, SP",
    areas: ["Autismo", "Atrasos no Desenvolvimento", "Intervenção Precoce"],
    bio: "Formação em ABA e intervenção precoce. Trabalha com crianças no espectro autista e suas famílias, promovendo desenvolvimento e qualidade de vida.",
    approach: "Combino técnicas comportamentais com abordagem centrada na família, respeitando a individualidade de cada criança.",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face",
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
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

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
              Conheça nossos{" "}
              <span className="text-primary">psicólogos</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Nossa equipe é formada por psicólogos especializados em saúde mental 
              infantojuvenil, prontos para cuidar da sua família.
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

      {/* Therapists Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {therapists.map((therapist, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-primary/30"
                onClick={() => setSelectedTherapist(therapist)}
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={therapist.image}
                    alt={therapist.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {therapist.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {therapist.specialty}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {therapist.credentials}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {therapist.location}
                  </div>

                  <Button
                    variant="link"
                    className="mt-3 h-auto p-0 text-primary"
                  >
                    Ver perfil completo →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Therapist Modal */}
      <Dialog open={!!selectedTherapist} onOpenChange={() => setSelectedTherapist(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTherapist && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">
                  Perfil de {selectedTherapist.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Informações detalhadas sobre {selectedTherapist.name}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={selectedTherapist.image}
                    alt={selectedTherapist.name}
                    className="w-full md:w-48 h-48 object-cover rounded-xl"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {selectedTherapist.name}
                  </h2>
                  <p className="mt-1 text-lg font-medium text-primary">
                    {selectedTherapist.specialty}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTherapist.credentials}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedTherapist.location}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTherapist.areas.map((area, i) => (
                      <Badge key={i} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Sobre</h3>
                  <p className="mt-2 text-muted-foreground">
                    {selectedTherapist.bio}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">Abordagem</h3>
                  <p className="mt-2 text-muted-foreground">
                    {selectedTherapist.approach}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-4 border-t">
                <a href="/agendar">
                  <Button className="w-full">
                    Agendar com {selectedTherapist.name.split(" ")[0]}
                  </Button>
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Pronto para dar o primeiro passo?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Agende uma consulta inicial com um de nossos especialistas e
            descubra como podemos ajudar sua família.
          </p>
          <a
            href="/agendar"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Agendar consulta
          </a>
        </div>
      </section>
    </Layout>
  );
}
