const paymentOptions = [
  { name: "Particular", icon: "💳" },
  { name: "Reembolso", icon: "📋" },
  { name: "Em breve", icon: "🏥" },
];

export function InsuranceSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Convênios e formas de pagamento
          </h3>
          <p className="text-muted-foreground mt-2">
            Oferecemos opções de pagamento flexíveis para sua conveniência
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {paymentOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-6 py-4 bg-background rounded-xl border border-border shadow-sm"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="font-medium text-foreground">{option.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}