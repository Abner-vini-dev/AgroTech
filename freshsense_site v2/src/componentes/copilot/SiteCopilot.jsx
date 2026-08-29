import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Translated } from "../../traducoes/I18nContext";
import { useI18n } from "../../traducoes/useI18n";
import { SITE_COPILOT_OPEN_EVENT } from "./siteCopilotEvents";
import {
  answerSiteCopilotQuestion,
  getSiteCopilotExperience,
} from "./siteCopilotModel";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteCopilot({ currentPath }) {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const launcherRef = useRef(null);
  const experience = useMemo(
    () => getSiteCopilotExperience(currentPath, language),
    [currentPath, language],
  );
  const operationalPage = currentPath === "/fase5";

  const close = useCallback(() => setOpen(false), []);
  const ask = useCallback(
    (prompt, label = prompt) => {
      const response = answerSiteCopilotQuestion(prompt, currentPath, language);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-${current.length}`,
          question: label,
          response,
        },
      ]);
      setQuestion("");
    },
    [currentPath, language],
  );

  useEffect(() => {
    const handleOpen = () => {
      if (!operationalPage) setOpen(true);
    };
    window.addEventListener(SITE_COPILOT_OPEN_EVENT, handleOpen);
    return () =>
      window.removeEventListener(SITE_COPILOT_OPEN_EVENT, handleOpen);
  }, [operationalPage]);

  useEffect(() => {
    setOpen(false);
    setMessages([]);
    setQuestion("");
  }, [currentPath]);

  useEffect(() => {
    setMessages([]);
    setQuestion("");
  }, [language]);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const launcher = launcherRef.current;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = [
        ...panelRef.current.querySelectorAll(focusableSelector),
      ];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus?.();
      else launcher?.focus?.();
    };
  }, [close, open]);

  if (operationalPage) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedQuestion = question.trim();
    if (normalizedQuestion) ask(normalizedQuestion);
  };

  return createPortal(
    <Translated>
      <button
        className="site-copilot-launcher"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir FreshSense Copilot"
        aria-expanded={open}
        ref={launcherRef}
      >
        <span className="site-copilot-launcher-mark" aria-hidden="true">
          ✦
        </span>
        <span>
          <small>Assistente inteligente</small>
          <strong>FreshSense Copilot</strong>
        </span>
        <i aria-hidden="true">↗</i>
      </button>

      {open && (
        <div className="site-copilot-layer">
          <button
            className="site-copilot-backdrop"
            type="button"
            aria-label="Fechar FreshSense Copilot"
            onClick={close}
          />
          <aside
            className="site-copilot-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-copilot-title"
            ref={panelRef}
          >
            <header className="site-copilot-header">
              <div className="site-copilot-brand">
                <span aria-hidden="true">✦</span>
                <div>
                  <small>Assistente inteligente</small>
                  <h2 id="site-copilot-title">FreshSense Copilot</h2>
                </div>
              </div>
              <button
                className="site-copilot-close"
                type="button"
                aria-label="Fechar FreshSense Copilot"
                onClick={close}
                ref={closeButtonRef}
              >
                ×
              </button>
            </header>

            <div className="site-copilot-status">
              <span>
                <i aria-hidden="true" /> {experience.available}
              </span>
              <strong>{experience.scope}</strong>
            </div>

            <div className="site-copilot-scroll">
              <section className="site-copilot-introduction">
                <span>Contexto atual</span>
                <h3>{experience.scope}</h3>
                <p>{experience.introduction}</p>
              </section>

              <section
                className="site-copilot-section"
                aria-labelledby="site-copilot-suggestions"
              >
                <span className="site-copilot-label">
                  Sugestões para esta página
                </span>
                <h3 id="site-copilot-suggestions">Como posso orientar você?</h3>
                <div className="site-copilot-prompts">
                  {experience.prompts.map((prompt) => (
                    <button
                      type="button"
                      key={prompt.id}
                      onClick={() => ask(prompt.id, prompt.label)}
                    >
                      <span aria-hidden="true">↗</span>
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="site-copilot-messages" aria-live="polite">
                {messages.map((message) => (
                  <article className="site-copilot-message" key={message.id}>
                    <p className="site-copilot-question">{message.question}</p>
                    <div className="site-copilot-answer">
                      <div className="site-copilot-answer-head">
                        <span aria-hidden="true">✦</span>
                        <strong>{message.response.title}</strong>
                      </div>
                      <p>{message.response.message}</p>
                      {!!message.response.actions.length && (
                        <div className="site-copilot-actions">
                          {message.response.actions.map((action) => (
                            <a
                              href={action.href}
                              key={`${action.href}-${action.label}`}
                            >
                              <span>
                                <strong>{action.label}</strong>
                                <small>{action.description}</small>
                              </span>
                              <i aria-hidden="true">→</i>
                            </a>
                          ))}
                        </div>
                      )}
                      <small className="site-copilot-source">
                        {message.response.sources}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <form className="site-copilot-form" onSubmit={handleSubmit}>
              <label htmlFor="site-copilot-question">
                {experience.inputLabel}
              </label>
              <div>
                <input
                  id="site-copilot-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder={experience.placeholder}
                  autoComplete="off"
                />
                <button type="submit" disabled={!question.trim()}>
                  {experience.send} <span aria-hidden="true">→</span>
                </button>
              </div>
              <small>
                Orientação baseada no conteúdo público da plataforma.
              </small>
            </form>
          </aside>
        </div>
      )}
    </Translated>,
    document.body,
  );
}
