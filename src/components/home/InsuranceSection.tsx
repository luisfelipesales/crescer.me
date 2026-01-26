const insurances = [{
  name: "Em breve",
  logo: "🏥"
}, {
  name: "SulAmérica",
  logo: "🏥"
}, {
  name: "Amil",
  logo: "🏥"
}, {
  name: "Unimed",
  logo: "🏥"
}, {
  name: "Porto Seguro",
  logo: "🏥"
}, {
  name: "NotreDame Intermédica",
  logo: "🏥"
}, {
  name: "Particular",
  logo: "💳"
}, {
  name: "Reembolso",
  logo: "📋"
}];
export function InsuranceSection() {
  return <section className="py-12 bg-muted/50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h3 className="font-display text-xl font-semibold text-foreground">Convênios e formas de pagamento</h3>
          <p className="text-muted-foreground mt-2">
            Aceitamos os principais convênios e oferecemos opções de pagamento flexíveis
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {insurances.map((insurance, index) => {})}
        </div>
      </div>
    </section>;
}