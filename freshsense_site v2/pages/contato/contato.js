// Contato - validação completa do formulário
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContato");
  if (!form) return;

  const fields = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    mensagem: document.getElementById("mensagem"),
  };

  const errors = {
    nome: document.getElementById("nomeErro"),
    email: document.getElementById("emailErro"),
    mensagem: document.getElementById("mensagemErro"),
  };

  const counter = document.getElementById("contadorMensagem");
  const status = document.getElementById("mensagemStatus");
  const maxMessageLength = 500;
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;

  const setFieldState = (field, errorElement, message) => {
    const hasError = Boolean(message);
    field.classList.toggle("is-invalid", hasError);
    field.classList.toggle("is-valid", !hasError && field.value.trim().length > 0);
    field.setAttribute("aria-invalid", String(hasError));
    errorElement.textContent = translate(message);
  };

  const validateName = () => {
    const value = fields.nome.value.trim();
    const parts = value.split(/\s+/).filter(Boolean);
    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/;

    if (!value) return "Informe seu nome completo.";
    if (parts.length < 2) return "Digite nome e sobrenome.";
    if (!parts.every((part) => namePattern.test(part) && part.length >= 2)) {
      return "Nome e sobrenome precisam ter pelo menos 2 letras cada.";
    }

    return "";
  };

  const validateEmail = () => {
    const value = fields.email.value.trim();
    if (!value) return "Informe seu e-mail.";
    if (!fields.email.checkValidity()) return "Digite um e-mail válido, como nome@email.com.";
    return "";
  };

  const validateMessage = () => {
    const value = fields.mensagem.value.trim();
    if (!value) return "Escreva uma mensagem antes de enviar.";
    if (fields.mensagem.value.length > maxMessageLength) {
      return "A mensagem deve ter no máximo 500 caracteres.";
    }
    return "";
  };

  const updateCounter = () => {
    const total = fields.mensagem.value.length;
    counter.textContent = `${total}/${maxMessageLength} ${translate("caracteres")}`;
    counter.classList.toggle("limit-warning", total > maxMessageLength);
  };

  const setStatus = (message, className) => {
    status.dataset.statusMessage = message;
    status.textContent = translate(message);
    status.className = className;
  };

  const clearStatus = () => {
    status.textContent = "";
    status.className = "status-message";
    delete status.dataset.statusMessage;
  };

  const validateForm = () => {
    const messages = {
      nome: validateName(),
      email: validateEmail(),
      mensagem: validateMessage(),
    };

    setFieldState(fields.nome, errors.nome, messages.nome);
    setFieldState(fields.email, errors.email, messages.email);
    setFieldState(fields.mensagem, errors.mensagem, messages.mensagem);
    updateCounter();

    return !messages.nome && !messages.email && !messages.mensagem;
  };

  fields.nome.addEventListener("input", () => {
    setFieldState(fields.nome, errors.nome, validateName());
    clearStatus();
  });

  fields.email.addEventListener("input", () => {
    setFieldState(fields.email, errors.email, validateEmail());
    clearStatus();
  });

  fields.mensagem.addEventListener("input", () => {
    updateCounter();
    setFieldState(fields.mensagem, errors.mensagem, validateMessage());
    clearStatus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus("Revise os campos destacados antes de enviar.", "status-message status-error");
      const firstInvalid = form.querySelector(".is-invalid");
      firstInvalid?.focus();
      return;
    }

    setStatus("Mensagem validada com sucesso. A equipe FreshSense recebeu sua solicitação.", "status-message status-success");
    form.reset();
    updateCounter();
    Object.values(fields).forEach((field) => {
      field.classList.remove("is-valid", "is-invalid");
      field.setAttribute("aria-invalid", "false");
    });
  });

  updateCounter();

  document.addEventListener("freshsense:languagechange", () => {
    if (errors.nome.textContent) setFieldState(fields.nome, errors.nome, validateName());
    if (errors.email.textContent) setFieldState(fields.email, errors.email, validateEmail());
    if (errors.mensagem.textContent) setFieldState(fields.mensagem, errors.mensagem, validateMessage());
    if (status.dataset.statusMessage) {
      status.textContent = translate(status.dataset.statusMessage);
    }
    updateCounter();
  });
});
