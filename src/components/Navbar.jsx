import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const navbarCollapseRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarCollapseRef.current && !navbarCollapseRef.current.contains(event.target)) {
                const bootstrapCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
                    toggle: false
                });
                if (navbarCollapseRef.current.classList.contains('show')) {
                    bootstrapCollapse.hide();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Home', path: '/home' },
        { name: 'Image Generator', path: '/image-generator'},
        { name: 'Icon Generator', path: '/icon-generator' },
        { name: 'Background Generator', path: '/background-generator' },
        { name: 'Background Remover', path: '/background-remover' },
        { name: 'PDF Generator', path: '/pdf-generator' }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-transparent fixed-top">
            <Link className="navbar-brand mx-5 home-h nav-h" to="/home">Createverse </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
                <ul className="navbar-nav mx-4 nav-i">
                    {navItems.map((item) => (
                        <li className="nav-item" key={item.name}>
                            <Link
                                className="nav-link"
                                to={item.path}
                                onClick={() => {
                                    const bootstrapCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
                                        toggle: false
                                    });
                                    bootstrapCollapse.hide();
                                }}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
