export default function ModernNavbar() {
    return (
        <nav className="navbar navbar-expand-md px-4" style={{ backgroundColor: '#2F3E46', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="container-fluid">
                <a
                    className="navbar-brand fw-semibold"
                    href="#"
                    style={{ color: '#CAD2C5', fontWeight: '600', letterSpacing: '0.1em', fontSize: '1.25rem' }}
                >
                    STORE MATE
                </a>
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu"
                    aria-controls="navbarMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ filter: 'invert(1)', opacity: 0.75 }}
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
                    <ul className="navbar-nav gap-3 d-flex flex-row align-items-center" style={{ margin: 0 }}>
                        {['Home', 'Einstellungen', 'Hilfe'].map((text) => (
                            <li className="nav-item" key={text} style={{ margin: 0 }}>
                                <a
                                    className="nav-link px-3 py-2"
                                    href="#"
                                    style={{
                                        color: '#84A98C',
                                        fontWeight: 500,
                                        borderRadius: '0.5rem',
                                        transition: 'background-color 0.3s ease, color 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#52796F'
                                        e.currentTarget.style.color = '#CAD2C5'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = '#84A98C'
                                    }}
                                >
                                    {text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
