const paymentOptions = [
  { name: "Particular", description: "Pagamento direto" },
  { name: "Reembolso", description: "Nota fiscal disponível" },
  { name: "Em breve", description: "Convênios parceiros" },
];

export function InsuranceSection() {
  return (
    <section className="py-16 bg-secondary/30 border-t border-border/50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              Formas de pagamento
            </h3>
            <p className="text-muted-foreground mt-1">
              Opções flexíveis para sua conveniência
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {paymentOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-4 bg-card rounded-2xl border border-border/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">
                  {index === 0 ? "💳" : index === 1 ? "📋" : "🏥"}
                </div>
                <div>
                  <p className="font-medium text-foreground">{option.name}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
