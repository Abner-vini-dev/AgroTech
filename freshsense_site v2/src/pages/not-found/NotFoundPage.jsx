import { Translated } from "../../site/translations/I18nContext";

export function NotFoundPage() {
  return (
    <Translated>
      <section className="section">
        <div className="container text-center">
          <span className="tag">Rota não encontrada</span>
          <h1>Esta página saiu do percurso</h1>
          <p>O endereço pode ter mudado ou não estar mais disponível.</p>
          <a className="btn-fresh" href="/">
            Voltar ao início
          </a>
        </div>
      </section>
    </Translated>
  );
}
