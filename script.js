document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const verifyButton = document.getElementById('verify-button');
    const resultDiv = document.getElementById('verification-result');
    const scrambleButton = document.getElementById('scramble-button');
    const wipingForm = document.getElementById('wiping-form');
    const wipingFormContainer = document.getElementById('wiping-form-container');
    const animationContainer = document.getElementById('animation-container');
    const successAnimation = document.getElementById('success-animation');

    // --- Certificate Page Elements ---
    const dragDropArea = document.getElementById('drag-drop-area');
    const fileUploadInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    let uploadedFile = null;

    // --- Dashboard Elements ---
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardTabContents = document.querySelectorAll('.dashboard-tab-content');
    let pieChartInstance = null;
    let lineChartInstance = null;

    // --- Valuation Modal Elements ---
    const valuationModal = document.getElementById('valuation-modal');
    const valuationModalButton = document.getElementById('valuation-modal-button');
    const valuationModalCloseButton = document.getElementById('valuation-modal-close');
    const valuationForm = document.getElementById('valuation-form');
    const valuationResultCard = document.getElementById('valuation-result-card');
    const estimatedValueEl = document.getElementById('estimated-value');
    const valuationBreakdownEl = document.getElementById('valuation-breakdown');
    
    // --- Preloader Elements ---
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');

    // --- Theme Toggle Logic ---
    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.remove('light-mode');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
         if (pieChartInstance) pieChartInstance.destroy();
         if (lineChartInstance) lineChartInstance.destroy();
         pieChartInstance = null;
         lineChartInstance = null;
    };

    themeToggleButton.addEventListener('click', () => {
        applyTheme(document.body.classList.contains('light-mode'));
    });

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === null || savedTheme === 'dark');

    // --- Hamburger Menu Logic ---
    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        menuButton.classList.toggle('menu-open');
        dropdownMenu.classList.toggle('dropdown-hidden');
    });
    
    document.addEventListener('click', (event) => {
        if (menuButton && dropdownMenu && !menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            menuButton.classList.remove('menu-open');
            dropdownMenu.classList.add('dropdown-hidden');
        }
    });

    // --- Page Navigation Logic ---
    const showPage = (pageId) => {
        pages.forEach(page => {
            page.classList.toggle('page-hidden', page.id !== `page-${pageId}`);
        });
        window.scrollTo(0, 0);
        if (menuButton && dropdownMenu) {
            menuButton.classList.remove('menu-open');
            dropdownMenu.classList.add('dropdown-hidden');
        }
        if(pageId === 'dashboard') {
            if (!pieChartInstance) createPieChart();
            if (!lineChartInstance) createLineChart();
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.dataset.page;
            if (pageId) showPage(pageId);
        });
    });

    // --- Certificate Verification Logic ---
    const handleFileSelect = (file) => {
        if (!file) return;
        uploadedFile = file;
        fileNameDisplay.textContent = file.name;
        fileNameDisplay.style.opacity = '1';
        verifyButton.disabled = false;
    };
    if(dragDropArea){
        dragDropArea.addEventListener('dragover', (e) => { e.preventDefault(); dragDropArea.classList.add('drag-over'); });
        dragDropArea.addEventListener('dragleave', () => { dragDropArea.classList.remove('drag-over'); });
        dragDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dragDropArea.classList.remove('drag-over');
            handleFileSelect(e.dataTransfer.files[0]);
        });
    }
    if(fileUploadInput) fileUploadInput.addEventListener('change', (e) => { handleFileSelect(e.target.files[0]); });

    if(verifyButton) verifyButton.addEventListener('click', () => {
        if (!uploadedFile) return;
        resultDiv.style.display = 'block';
         resultDiv.innerHTML = `<div class="flex items-center text-green-500 mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m0 0l-2-2m-2 2l2-2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><h4 class="font-bold text-lg">Certificate Valid</h4></div><div class="text-sm space-y-2"><p><strong class="font-semibold text-current">File Name:</strong> ${uploadedFile.name}</p><p><strong class="font-semibold text-current">Device Serial:</strong> SN-987654321</p><p><strong class="font-semibold text-current">Wipe Method:</strong> NIST 800-88 Purge (ATA Secure Erase)</p><p><strong class="font-semibold text-current">Completion Date:</strong> 2025-09-15 14:32 UTC</p></div><a href="#" class="inline-block bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2 rounded-lg mt-4">Download PDF</a>`;
    });
    
    // --- Wiping Form and Lottie Animation Logic ---
    if(wipingForm) wipingForm.addEventListener('submit', (event) => {
        event.preventDefault();
        wipingFormContainer.classList.add('hidden');
        animationContainer.classList.remove('hidden');
        successAnimation.play();
        setTimeout(() => { showPage('verify'); }, 3000); 
    });


    // --- Scramble Button Logic ---
    const scrambleButtonElement = document.getElementById('scramble-button');
    if (scrambleButtonElement) {
        const originalButtonText = scrambleButtonElement.dataset.text;
        let isScrambling = false;
        const scrambleEffect = (element) => {
            if (isScrambling) return;
            isScrambling = true;
            const chars = '!<>-_\\/[]{}—=+*^?#';
            const text = originalButtonText;
            let frame = 0;
            const len = text.length;
            let interval = setInterval(() => {
                let scrambledText = '';
                for (let i = 0; i < len; i++) {
                    const randomChar = chars[Math.floor(Math.random() * chars.length)];
                    if (frame / 2 > i) {
                        scrambledText += text[i];
                    } else {
                        scrambledText += randomChar;
                    }
                }
                element.textContent = scrambledText;
                frame++;
                if (scrambledText === text) {
                    clearInterval(interval);
                    isScrambling = false;
                }
            }, 40);
        };
        scrambleButtonElement.addEventListener('mouseenter', () => { scrambleEffect(scrambleButtonElement); });
    }

     // --- Dashboard Tab Logic ---
    const showTab = (tabId) => {
        dashboardTabContents.forEach(content => content.classList.toggle('hidden', content.id !== `tab-${tabId}`));
        dashboardTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
    };
    dashboardTabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));
    if(dashboardTabs.length > 0) showTab('centers');

    // --- Valuation Modal Logic ---
    const openModal = () => valuationModal.classList.remove('modal-hidden');
    const closeModal = () => valuationModal.classList.add('modal-hidden');
    
    if(valuationModalButton) valuationModalButton.addEventListener('click', openModal);
    if(valuationModalCloseButton) valuationModalCloseButton.addEventListener('click', closeModal);
    if(valuationModal) valuationModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    if(valuationForm) {
        valuationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const deviceType = document.getElementById('val-device-type').value;
            const condition = parseFloat(document.getElementById('val-condition').value);
            const conditionText = document.getElementById('val-condition').options[document.getElementById('val-condition').selectedIndex].text.split(' - ')[0];
            const storage = document.getElementById('val-storage').value;

            let baseValue = 8000;
            if (deviceType === 'laptop') baseValue = 15000;
            if (deviceType === 'server') baseValue = 50000;
            
            const storageBonus = storage ? 500 : 0;
            const calculatedValue = (baseValue * condition) + storageBonus;

            const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
            
            estimatedValueEl.textContent = formatter.format(calculatedValue);
            let breakdownText = `Base value: ${formatter.format(baseValue)} | Condition (${conditionText}): ${condition * 100}%`;
            if(storageBonus > 0) {
                breakdownText += ' | Storage bonus included';
            }
            valuationBreakdownEl.textContent = breakdownText;
            valuationResultCard.classList.remove('hidden');
        });

        valuationForm.addEventListener('reset', () => {
            valuationResultCard.classList.add('hidden');
        });
    }

    // --- Chart.js Logic ---
    const createPieChart = () => {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;
        const isLight = document.body.classList.contains('light-mode');
        pieChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cryptographic Erase', 'NIST 800-88 Purge', 'Secure Erase'],
                datasets: [{
                    data: [55, 25, 20],
                    backgroundColor: ['#38bdf8', '#34d399', '#a78bfa'],
                    borderColor: isLight ? '#ffffff' : '#0B1120',
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isLight ? '#4b5563' : '#9ca3af',
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'rectRounded'
                        }
                    }
                }
            }
        });
    };
    
    const createLineChart = () => {
        const ctx = document.getElementById('lineChart');
        if (!ctx) return;
        const isLight = document.body.classList.contains('light-mode');
        lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Devices Processed',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: isLight ? '#e5e7eb' : 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: isLight ? '#6b7280' : '#9ca3af' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: isLight ? '#6b7280' : '#9ca3af' }
                    }
                }
            }
        });
    };

    // --- Preloader Logic ---
    window.onload = () => {
        setTimeout(() => {
            if(preloader) {
                preloader.style.opacity = '0';
                mainContent.classList.add('loaded');
                setTimeout(() => {
                   preloader.style.display = 'none';
                }, 500); // match transition duration
            }
            showPage('home'); // Show the home page after everything is loaded
        }, 2500); // 2.5 second delay for animation
    };
});
