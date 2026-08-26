import { useState } from "react";
import { Translated } from "../../../site/translations/I18nContext";
import { emptyContactForm, validateContact } from "../model/contactValidation";

function SelectField({ id, label, value, onChange, children, full = false }) {
  return (
    <div className={`form-field ${full ? "full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
}

export function ContactForm() {
  const [data, setData] = useState(emptyContactForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    setStatus({ type: "", message: "" });
    if (errors[key])
      setErrors((current) => ({
        ...current,
        [key]: validateContact(next)[key] ?? "",
      }));
  };

  const fieldClass = (key) =>
    errors[key] ? "is-invalid" : data[key].trim() ? "is-valid" : "";

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateContact(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({
        type: "error",
        message: "Revise os campos destacados antes de enviar.",
      });
      setTimeout(
        () => document.querySelector(".contact-form .is-invalid")?.focus(),
        0,
      );
      return;
    }
    setStatus({
      type: "success",
      message:
        "Solicitação registrada. A equipe FreshSense entrará em contato para entender os próximos passos.",
    });
    setData(emptyContactForm);
    setErrors({});
  };

  return (
    <Translated>
      <section className="section surface">
        <div className="container contact-layout">
          <aside className="contact-panel card reveal">
            <span className="tag">Conversa consultiva</span>
            <h2>Comece pelo desafio mais relevante da sua operação</h2>
            <p>
              Não é necessário ter toda a arquitetura definida. Conte onde a
              visibilidade falha hoje e quais decisões precisam acontecer mais
              cedo, com mais contexto ou evidência.
            </p>
            <div className="contact-list">
              <div>
                <strong>Diagnóstico operacional</strong>
                <span>Pontos críticos, produtos, rotas, ativos e responsáveis.</span>
              </div>
              <div>
                <strong>Arquitetura e integração</strong>
                <span>Sensores, conectividade, dados, alertas e sistemas existentes.</span>
              </div>
              <div>
                <strong>Escala e governança</strong>
                <span>
                  Critérios de avanço, indicadores, perfis de acesso e melhoria contínua.
                </span>
              </div>
            </div>
            <div
              className="contact-metrics"
              aria-label="Indicadores de atendimento"
            >
              <div>
                <span>Abordagem</span>
                <strong>consultiva</strong>
              </div>
              <div>
                <span>Escopo</span>
                <strong>ponta a ponta</strong>
              </div>
            </div>
          </aside>
          <form
            className="contact-form card reveal"
            noValidate
            onSubmit={submit}
          >
            <div className="form-head">
              <span className="tag">Conte seu cenário</span>
              <h2>Fale com a FreshSense</h2>
              <p>
                Quanto mais contexto você compartilhar, mais objetiva será a
                primeira conversa.
              </p>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex.: Ana Silva"
                  className={fieldClass("nome")}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby="nomeHint nomeErro"
                  value={data.nome}
                  onChange={(event) => update("nome", event.target.value)}
                />
                <small id="nomeHint" className="field-hint">
                  Informe nome e sobrenome, com pelo menos 2 letras cada.
                </small>
                <small id="nomeErro" className="field-error" aria-live="polite">
                  {errors.nome}
                </small>
              </div>
              <div className="form-field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ana@email.com"
                  className={fieldClass("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="emailErro"
                  value={data.email}
                  onChange={(event) => update("email", event.target.value)}
                />
                <small
                  id="emailErro"
                  className="field-error"
                  aria-live="polite"
                >
                  {errors.email}
                </small>
              </div>
              <SelectField
                id="perfil"
                label="Perfil"
                value={data.perfil}
                onChange={(event) => update("perfil", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Produtor ou cooperativa</option>
                <option>Transporte e logística</option>
                <option>Armazenagem e distribuição</option>
                <option>Instituição pública ou social</option>
                <option>Equipe de qualidade alimentar</option>
              </SelectField>
              <SelectField
                id="assunto"
                label="Assunto"
                value={data.assunto}
                onChange={(event) => update("assunto", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Diagnóstico da cadeia fria</option>
                <option>Sensores e conectividade</option>
                <option>Rastreabilidade e gestão de alertas</option>
                <option>Implantação e integrações</option>
              </SelectField>
              <SelectField
                id="operacao"
                label="Tamanho da operação"
                full
                value={data.operacao}
                onChange={(event) => update("operacao", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Pequena operação local</option>
                <option>Cooperativa ou produtor recorrente</option>
                <option>Centro de distribuição</option>
                <option>Rede com múltiplas rotas</option>
              </SelectField>
              <div className="form-field full">
                <label htmlFor="mensagem">Descrição da mensagem</label>
                <textarea
                  id="mensagem"
                  rows="6"
                  maxLength="500"
                  placeholder="Descreva a operação, o principal ponto cego e a decisão que precisa melhorar"
                  className={fieldClass("mensagem")}
                  aria-invalid={Boolean(errors.mensagem)}
                  aria-describedby="mensagemErro contadorMensagem"
                  value={data.mensagem}
                  onChange={(event) => update("mensagem", event.target.value)}
                />
                <div className="field-meta">
                  <small
                    id="mensagemErro"
                    className="field-error"
                    aria-live="polite"
                  >
                    {errors.mensagem}
                  </small>
                  <small id="contadorMensagem" className="field-counter">
                    {data.mensagem.length}/500 caracteres
                  </small>
                </div>
              </div>
              <button className="btn-fresh btn-block" type="submit">
                Solicitar contato
              </button>
              <p
                className={`status-message ${status.type ? `status-${status.type}` : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            </div>
          </form>
        </div>
      </section>
    </Translated>
  );
}
