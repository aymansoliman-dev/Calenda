class DarkThemeToggleListener {
    constructor() {
        this.toggleBtn = document.querySelector('#dark-theme-toggle');
    }

    initiate() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.toggleBtn.checked = true;
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.toggleBtn.checked = false;
        }

        this.toggleBtn.addEventListener('click', () => {
            if (this.toggleBtn.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            }
        });
    }
}

export { DarkThemeToggleListener };
