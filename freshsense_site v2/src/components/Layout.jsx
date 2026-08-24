import { useEffect, useState } from 'react';

const links = [
  ['/', 'Início'],
  ['/problema', 'Problema'],
  ['/solucao', 'Solução'],
  ['/publico-alvo', 'Usuários'],
  ['/contato', 'Fale Conosco'],
  ['/buscar-lotes', 'Buscar Lotes'],
];

export function Layout({ page, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('freshsense-theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('freshsense-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      document.querySelector('.scroll-progress')?.style.setProperty(
        'transform',
        `scaleX(${Math.min(Math.max(progress, 0), 1)})`
      );
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    requestAnimationFrame(updateScrollProgress);

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [page]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="scroll-progress" aria-hidden="true" />
      <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
        <nav className="site-nav container" aria-label="Navegação principal">
          <a className="brand" href="/"><span>Fresh</span>Sense</a>
          <button className="nav-toggle" type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen}>
            <span aria-hidden="true">☰</span><span>Menu</span>
          </button>
          <ul className="nav-menu">
            {links.map(([href, label]) => (
              <li key={href}>
                <a className={`nav-link ${href === '/contato' ? 'nav-cta' : ''}`} aria-current={page === href ? 'page' : undefined} href={href}>{label}</a>
              </li>
            ))}
            <li><button className="theme-toggle" type="button" onClick={() => setDark(v => !v)} aria-pressed={dark}>{dark ? 'Modo claro' : 'Modo escuro'}</button></li>
          </ul>
        </nav>
      </header>
      <main id="conteudo">{children}</main>
      <footer className="footer"><div className="container footer-grid"><strong>FreshSense • Monitoramento Agrotech</strong><span>Cadeia fria, rastreabilidade e decisão em tempo real</span></div></footer>
      <button className="back-to-top" type="button" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} aria-label="Voltar ao topo">↑</button>
    </>
  );
}
