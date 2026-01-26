import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { AudienceSection } from "@/components/home/AudienceSection";
import { ConditionsSection } from "@/components/home/ConditionsSection";
import { ApproachSection } from "@/components/home/ApproachSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { InsuranceSection } from "@/components/home/InsuranceSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <AudienceSection />
      <ConditionsSection />
      <ApproachSection />
      <TestimonialsSection />
      <CTASection />
      <InsuranceSection />
    </Layout>
  );
};

export default Index;
