import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Como identificar sinais de ansiedade em crianças",
    excerpt:
      "A ansiedade infantil pode se manifestar de formas diferentes dos adultos. Aprenda a reconhecer os sinais e saiba quando buscar ajuda profissional.",
    category: "Ansiedade",
    author: "Dra. Carolina Mendes",
    date: "2024-01-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop",
    slug: "sinais-ansiedade-criancas",
  },
  {
    id: "2",
    title: "TDAH: mitos e verdades sobre o diagnóstico",
    excerpt:
      "O TDAH é um dos transtornos mais mal compreendidos. Descubra o que é fato e o que é mito sobre essa condição que afeta milhões de crianças.",
    category: "TDAH",
    author: "Dra. Mariana Oliveira",
    date: "2024-01-10",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    slug: "tdah-mitos-verdades",
  },
  {
    id: "3",
    title: "A importância do sono na saúde mental das crianças",
    excerpt:
      "O sono de qualidade é fundamental para o desenvolvimento emocional e cognitivo. Veja dicas para melhorar a rotina de sono dos pequenos.",
    category: "Desenvolvimento",
    author: "Dra. Fernanda Lima",
    date: "2024-01-05",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=400&fit=crop",
    slug: "sono-saude-mental-criancas",
  },
  {
    id: "4",
    title: "Orientação parental: como estabelecer limites saudáveis",
    excerpt:
      "Estabelecer limites é um ato de amor. Aprenda estratégias eficazes para educar com firmeza e afeto.",
    category: "Pais",
    author: "Dra. Fernanda Lima",
    date: "2023-12-20",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=400&fit=crop",
    slug: "orientacao-parental-limites",
  },
  {
    id: "5",
    title: "Terapia online para crianças: funciona mesmo?",
    excerpt:
      "A pandemia acelerou a adoção da teleterapia. Saiba como funciona e quais os benefícios do atendimento online para crianças.",
    category: "Tratamento",
    author: "Dr. Pedro Almeida",
    date: "2023-12-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop",
    slug: "terapia-online-criancas",
  },
  {
    id: "6",
    title: "Volta às aulas: como ajudar seu filho com a adaptação",
    excerpt:
      "O retorno à escola pode ser desafiador. Confira dicas para tornar esse momento mais tranquilo para toda a família.",
    category: "Escola",
    author: "Dra. Juliana Costa",
    date: "2023-12-01",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop",
    slug: "volta-aulas-adaptacao",
  },
];

const categories = ["Todos", "Ansiedade", "TDAH", "Desenvolvimento", "Pais", "Tratamento", "Escola"];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              Blog
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Dicas e informações sobre{" "}
              <span className="text-primary">saúde mental infantil</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Artigos escritos por nossa equipe para ajudar pais, educadores e
              cuidadores a entenderem melhor o universo da saúde mental infantojuvenil.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="border-b border-border py-6">
        <div className="container-custom">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Nenhum artigo encontrado para sua busca.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group h-full overflow-hidden border-border transition-all hover:shadow-lg hover:border-primary/30"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4" variant="secondary">
                      {post.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <Button
                      variant="link"
                      className="mt-4 h-auto p-0 text-primary"
                    >
                      Ler artigo <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground">
            Receba novidades por e-mail
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Cadastre-se para receber dicas, artigos e novidades sobre saúde
            mental infantojuvenil diretamente no seu e-mail.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button variant="secondary" className="shrink-0">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
