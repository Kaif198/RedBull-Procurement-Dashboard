document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initDashboard(data);
        })
        .catch(error => console.error("Error loading data:", error));
});

let dashboardData = {};

function initDashboard(data) {
    dashboardData = data;

    // Setup Chart Defaults
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(19, 25, 43, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#F1F5F9';
    Chart.defaults.plugins.tooltip.bodyColor = '#F1F5F9';
    Chart.defaults.plugins.tooltip.borderColor = '#172F55';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.scale.grid.color = 'rgba(30, 41, 59, 0.5)';

    populateKPIs(data.kpis);
    renderTimeSeries(data.timeSeries);
    renderCategoryChart(data.categories);
    renderRiskChart(data.supplierRisk);
    renderSustainabilityChart(data.sustainability);
    renderRecommendations(data.recommendations);

    // Setup Intersection Observer for Animations AFTER data is loaded
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.id === 'exec-summary' && !window.kpiAnimated) {
                    animateKPIs();
                    window.kpiAnimated = true;
                }
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.dashboard-section').forEach(section => {
        observer.observe(section);
    });
}

// Format numbers
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);

function populateKPIs(kpis) {
    document.getElementById('kpi-spend').dataset.target = kpis.totalSpend;
    document.getElementById('kpi-savings').dataset.target = kpis.yoySavings;
    document.getElementById('kpi-accuracy').dataset.target = kpis.forecastAccuracy;
    document.getElementById('kpi-suppliers').dataset.target = kpis.supplierCount;
}

function animateKPIs() {
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200; // lower is slower

    counters.forEach(counter => {
        let current = 0;
        const updateCount = () => {
            const target = +counter.dataset.target;

            const isCurrency = counter.id === 'kpi-spend' || counter.id === 'kpi-savings';
            const isPercent = counter.id === 'kpi-accuracy';

            const inc = target / speed;

            if (current < target) {
                current += inc;
                if (current > target) current = target;

                if (isCurrency) {
                    let formatted = "";
                    if (current >= 1000000000) {
                        formatted = "$" + (current / 1000000000).toFixed(2) + "B";
                    } else {
                        formatted = "$" + (current / 1000000).toFixed(1) + "M";
                    }
                    counter.innerText = formatted;
                } else if (isPercent) {
                    counter.innerText = current.toFixed(1) + "%";
                } else {
                    counter.innerText = Math.ceil(current);
                }
                setTimeout(updateCount, 10);
            } else {
                // Final format
                if (isCurrency) {
                    if (target >= 1000000000) counter.innerText = "$" + (target / 1000000000).toFixed(2) + "B";
                    else counter.innerText = "$" + (target / 1000000).toFixed(1) + "M";
                } else if (isPercent) {
                    counter.innerText = target.toFixed(1) + "%";
                } else {
                    counter.innerText = formatNumber(target);
                }
            }
        };
        updateCount();
    });
}

function renderTimeSeries(ts) {
    const ctx = document.getElementById('timeSeriesChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ts.labels,
            datasets: [
                {
                    label: 'Historical Spend',
                    data: ts.historical,
                    borderColor: '#94A3B8',
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHitRadius: 10
                },
                {
                    label: 'Prophet (Bayesian)',
                    data: ts.prophet,
                    borderColor: '#FFCC00',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#FFCC00'
                },
                {
                    label: 'ARIMA (Deterministic)',
                    data: ts.arima,
                    borderColor: '#E60028',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'SARIMA (Seasonal)',
                    data: ts.sarima,
                    borderColor: '#172F55',
                    borderWidth: 2,
                    borderDash: [2, 4],
                    tension: 0.4,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#F1F5F9', usePointStyle: true, boxWidth: 8 }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function (value) {
                            return "$" + (value / 1000000).toFixed(0) + "M";
                        }
                    }
                }
            }
        }
    });
}

function renderCategoryChart(categories) {
    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');

    // Sort by spend
    categories.sort((a, b) => b.spend - a.spend);

    // Using a Doughnut as a beautiful alternative to Treemap
    const data = {
        labels: categories.map(c => c.name),
        datasets: [{
            data: categories.map(c => c.spend),
            backgroundColor: [
                '#E60028', // Red Bull Red
                '#FFCC00', // Sun Yellow
                '#172F55', // Blue
                '#0A1D3A', // Dark Blue
                '#94A3B8', // Silver
                '#64748B', // Dark Silver
                '#334155'  // Deep slate
            ],
            borderWidth: 2,
            borderColor: '#13192B',
            hoverOffset: 10
        }]
    };

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    updateCategoryPanel(categories[idx]);
                }
            }
        }
    });

    // Initialize panel with first category
    if (categories.length > 0) updateCategoryPanel(categories[0]);
}

function updateCategoryPanel(category) {
    document.getElementById('cat-title').innerText = category.name;

    const html = `
        <div class="detail-row">
            <span class="detail-label">Total Category Spend</span>
            <span class="detail-val" style="color:var(--accent-yellow)">${formatCurrency(category.spend)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Identified Savings Pipeline</span>
            <span class="detail-val" style="color:var(--accent-red)">${formatCurrency(category.savingsPipeline)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Top Market Suppliers</span>
            <span class="detail-val">${category.topSuppliers.join(', ')}</span>
        </div>
        <div class="detail-row" style="flex-direction: column; border-bottom: none; margin-top:10px;">
            <span class="detail-label" style="margin-bottom: 10px;">Contract Health</span>
            <div style="width: 100%; height: 8px; background: #334155; border-radius: 4px; display: flex; overflow: hidden;">
                <div style="width: ${category.contractStatus.active}%; background: #22C55E;" title="Active: ${category.contractStatus.active}%"></div>
                <div style="width: ${category.contractStatus.expiring}%; background: #FFCC00;" title="Expiring: ${category.contractStatus.expiring}%"></div>
                <div style="width: ${category.contractStatus.expired}%; background: #E60028;" title="Expired: ${category.contractStatus.expired}%"></div>
            </div>
            <div style="display:flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); margin-top:5px;">
                <span>Active (${category.contractStatus.active}%)</span>
                <span>Expiring (${category.contractStatus.expiring}%)</span>
                <span>Off-Contract (${category.contractStatus.expired}%)</span>
            </div>
        </div>
    `;

    document.getElementById('detail-content').innerHTML = html;
}

function renderRiskChart(riskData) {
    const ctx = document.getElementById('riskChart').getContext('2d');

    const scatterData = riskData.map(r => ({
        x: r.likelihood,
        y: r.impact,
        r: r.spend / 5000000, // Bubble radius based on spend
        name: r.name,
        spend: r.spend
    }));

    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Supplier Risk Matrix',
                data: scatterData,
                backgroundColor: 'rgba(230, 0, 40, 0.6)', // Red Bull Red, semi-transparent
                borderColor: '#E60028',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 204, 0, 0.8)',
                hoverBorderColor: '#FFCC00'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const point = context.raw;
                            return `${point.name} - Spend: ${formatCurrency(point.spend)} | L:${point.x} I:${point.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Risk Likelihood (1-5)', color: '#94A3B8' },
                    min: 0,
                    max: 5.5
                },
                y: {
                    title: { display: true, text: 'Business Impact (1-5)', color: '#94A3B8' },
                    min: 0,
                    max: 5.5
                }
            }
        }
    });
}

function renderSustainabilityChart(susData) {
    const ctx = document.getElementById('sustainabilityChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: susData.labels,
            datasets: [
                {
                    label: 'Red Bull Portfolio',
                    data: susData.scores_redbull,
                    backgroundColor: 'rgba(255, 204, 0, 0.2)',
                    borderColor: '#FFCC00',
                    pointBackgroundColor: '#FFCC00',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FFCC00'
                },
                {
                    label: 'Industry Benchmark',
                    data: susData.scores_benchmark,
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    borderColor: '#94A3B8',
                    pointBackgroundColor: '#94A3B8',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#94A3B8',
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(30, 41, 59, 0.5)' },
                    grid: { color: 'rgba(30, 41, 59, 0.5)' },
                    pointLabels: { color: '#F1F5F9', font: { size: 11 } },
                    ticks: {
                        display: false,
                        min: 40,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#F1F5F9' }
                }
            }
        }
    });
}

function renderRecommendations(recs) {
    const container = document.getElementById('recs-container');
    container.innerHTML = '';

    recs.forEach(rec => {
        const isHigh = rec.difficulty === 'High';
        const card = document.createElement('div');
        card.className = `rec-card ${isHigh ? 'high-impact' : ''}`;

        card.innerHTML = `
            <div class="rec-tag">${rec.metric} | ${rec.category}</div>
            <h4>${rec.title}</h4>
            <p>${rec.action}</p>
            <div class="rec-impact">+ ${formatCurrency(rec.impact)}</div>
        `;

        container.appendChild(card);
    });
}
