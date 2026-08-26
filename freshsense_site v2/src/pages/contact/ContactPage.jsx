import { PageHero } from "../../site/ui/PageHero";
import { ContactForm } from "./components/ContactForm";
import { Translated } from "../../site/translations/I18nContext";

export function ContactPage() {
  return (
    <Translated>
      <PageHero
        className="contact-hero"
        eyebrow="Transforme um ponto cego em um plano de ação"
        title="Vamos conversar sobre a cadeia fria que você precisa enxergar melhor"
        text="Compartilhe seus produtos, rotas, ativos e desafios de resposta. A FreshSense ajuda a estruturar uma jornada de visibilidade compatível com a realidade da sua operação."
      />

      <ContactForm />
    </Translated>
  );
}
