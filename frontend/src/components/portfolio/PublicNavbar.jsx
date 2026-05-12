import { useState } from 'react';
import { Link } from 'react-router-dom';

function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="public-nav-shell">
      <div className="container public-nav">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark">
            <img alt="NEW OPTION TECHNOLOGY logo" src="/assets/new-option-logo.png" />
          </span>
          <span className="brand-copy">
            <strong>NEW OPTION TECHNOLOGY</strong>
            <small>Repair. Support. Performance.</small>
          </span>
        </a>

        <button
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="nav-toggle"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${isOpen ? 'nav-links--open' : ''}`}>
          <a href="#home" onClick={closeMenu}>
            Home
          </a>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <Link className="button button-small" onClick={closeMenu} to="/login">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default PublicNavbar;
