import { Translated } from "../traducoes/I18nContext";
import { useI18n } from "../traducoes/useI18n";

const languages = ["pt", "en", "es"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <Translated>
      <li className="language-switcher" aria-label="Idioma">
        {languages.map((item, index) => (
          <span key={item}>
            <button
              type="button"
              className={language === item ? "active" : ""}
              aria-pressed={language === item}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </button>
            {index < languages.length - 1 && <span aria-hidden="true">|</span>}
          </span>
        ))}
      </li>
    </Translated>
  );
}
