/* ==========================================================================
   THEME-TOGGLE.JS - Theme & RTL Layout Management
   ========================================================================== */

(function() {
    // 1. Theme Management (Light / Dark Mode)
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const targetTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', targetTheme);

    // 2. RTL Layout Management
    const rtlEnabled = localStorage.getItem('rtl_enabled') === 'true';
    if (rtlEnabled) {
        document.documentElement.setAttribute('dir', 'rtl');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // --- Dark/Light Mode Theme Toggle ---
    const themeTogglers = document.querySelectorAll('.theme-toggle-btn');
    updateTogglerIcons();

    themeTogglers.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateTogglerIcons();
        });
    });

    function updateTogglerIcons() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        themeTogglers.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (currentTheme === 'dark') {
                    icon.className = 'fa-solid fa-sun';
                } else {
                    icon.className = 'fa-solid fa-moon';
                }
            }
        });
    }

    // --- RTL Support Layout Toggle ---
    const rtlTogglers = document.querySelectorAll('.rtl-toggle-btn');
    updatePaginationArrows();

    rtlTogglers.forEach(btn => {
        btn.addEventListener('click', () => {
            // Disable transitions temporarily to prevent layout sweeping
            document.documentElement.classList.add('no-transition');

            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                document.documentElement.removeAttribute('dir');
                localStorage.setItem('rtl_enabled', 'false');
            } else {
                document.documentElement.setAttribute('dir', 'rtl');
                localStorage.setItem('rtl_enabled', 'true');
            }
            updatePaginationArrows();

            // Force browser reflow to apply layout immediately
            document.documentElement.offsetHeight;

            // Re-enable transitions
            setTimeout(() => {
                document.documentElement.classList.remove('no-transition');
            }, 50);
        });
    });

    function updatePaginationArrows() {
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        const paginationLinks = document.querySelectorAll('a');
        paginationLinks.forEach(link => {
            const text = link.innerHTML;
            if (text.includes('Next →') || text.includes('Next ←') || text.includes('Next &rarr;') || text.includes('Next &larr;')) {
                if (isRtl) {
                    link.innerHTML = 'Next &larr;';
                } else {
                    link.innerHTML = 'Next &rarr;';
                }
            }
        });
    }
});

