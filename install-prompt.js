// PWA Install Prompt Education Modal
let deferredPrompt;
const installBtn = document.getElementById('install');
installBtn.hidden = true;
installBtn.disabled = true;

// Check if user has been shown install prompt before
const hasSeenInstallPrompt = localStorage.getItem('hasSeenInstallPrompt');

const showInstallButton = () => {
    installBtn.hidden = false;
    installBtn.disabled = false;
};

const hideInstallButton = () => {
    installBtn.hidden = true;
    installBtn.disabled = true;
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
    
    // Show install button only if user hasn't dismissed it before
    if (!hasSeenInstallPrompt) {
        // Create education modal
        const modal = document.createElement('div');
        modal.id = 'installEducationModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'installEducationModalTitle');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--dim-gray, #333);
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            color: white;
            margin: 1rem;
        `;
        
        modalContent.innerHTML = `
            <h2 id="installEducationModalTitle" style="margin-top: 0; font-size: 1.5rem;">Install Word Counter</h2>
            <p style="margin: 1rem 0;">Get quick access to Word Counter right from your home screen. Works offline!</p>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                <button id="dismissInstall" style="
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Not Now</button>
                <button id="confirmInstall" style="
                    background: #4caf50;
                    border: none;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Install</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const dismissInstallModal = () => {
            localStorage.setItem('hasSeenInstallPrompt', 'true');
            modal.remove();
            installBtn.focus();
        };
        
        // Handle dismiss
        document.getElementById('dismissInstall').addEventListener('click', () => {
            dismissInstallModal();
        });
        
        // Handle confirm
        document.getElementById('confirmInstall').addEventListener('click', () => {
            modal.remove();
            showInstallPrompt();
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                dismissInstallModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && document.body.contains(modal)) {
                dismissInstallModal();
            }
        });

        document.getElementById('confirmInstall').focus();
    } else {
        showInstallButton();
    }
});

const showInstallPrompt = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                hideInstallButton();
            } else {
                console.log('User dismissed the install prompt');
                hideInstallButton();
            }
            deferredPrompt = null;
        });
    }
};

installBtn.addEventListener('click', showInstallPrompt);

// Hide install button after successful installation
window.addEventListener('appinstalled', () => {
    hideInstallButton();
    localStorage.setItem('hasSeenInstallPrompt', 'true');
});
