import React from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CountUp from 'react-countup';
import ChartWithNarrative from '../components/ChartWithNarrative';
import { Shield, TrendingDown, Target, Zap, Server, Globe } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Overview = ({ data }) => {
    if (!data) return <div style={{ padding: '40px' }} className="animate-fade-in-up">Initializing Red Bull Subsystems...</div>;

    const { totalSpend, yoySavings, forecastAccuracy } = data.kpis;
    const timeSeries = data.timeSeries;

    // Chart Setup
    const chartData = {
        labels: timeSeries.data.labels,
        datasets: [
            {
                label: 'Historical Spend',
                data: timeSeries.data.historical,
                borderColor: '#94A3B8',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Prophet (Bayesian Forecast)',
                data: timeSeries.data.prophet,
                borderColor: '#FFCC00',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#FFCC00',
            },
            {
                label: 'ARIMA (Deterministic Model)',
                data: timeSeries.data.arima,
                borderColor: '#E60028',
                borderDash: [2, 4],
                tension: 0.4,
                pointRadius: 0,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'top', labels: { color: '#F1F5F9', usePointStyle: true, padding: 20, font: { family: "'Inter', sans-serif" } } },
            tooltip: { backgroundColor: 'rgba(11, 14, 20, 0.95)', titleColor: '#F1F5F9', bodyColor: '#94A3B8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 }
        },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { color: '#94A3B8', callback: (value) => `$${(value / 1000000).toFixed(1)}M` } },
            x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
        }
    };

    return (
        <>
            {/* HEADER SECTION */}
            <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Executive Dashboard
                        <span style={{ fontSize: '0.4em', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '4px 10px', borderRadius: '20px', letterSpacing: '2px', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 'bold' }}>LIVE</span>
                    </h2>
                    <p className="page-desc">Real-time pulse of global indirect expenditure, predictive metrics, and premium asset rendering.</p>
                </div>
            </div>

            {/* TOP ROW: KPIs + 3D Video Hero */}
            <div className="animate-fade-in-up stagger-2 grid-3" style={{ gridTemplateColumns: 'minmax(400px, 1.5fr) 1fr 1fr' }}>

                {/* RED BULL 3D HERO CONTAINER */}
                <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: 0, height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                    {/* Fallback pattern if video fails/loads */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #0B0E14, #1A1F2E)', opacity: 0.8, zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', zIndex: 0 }}></div>

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    >
                        <source src="/assets/new_redbull_video.mp4" type="video/mp4" />
                    </video>

                    <div style={{ position: 'absolute', bottom: '15px', left: '20px', zIndex: 2 }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>Procurement Engine</div>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '1px' }}>ENTERPRISE SYNC <Zap size={16} color="var(--accent-yellow)" style={{ display: 'inline', verticalAlign: 'middle' }} /></div>
                    </div>
                </div>

                {/* KPI: SPEND */}
                <div className="glass-panel kpi-card">
                    <div className="kpi-title">Total Verified Spend</div>
                    <div className="kpi-value text-gradient-light">
                        $<CountUp end={totalSpend / 1000000000} decimals={2} duration={2} separator="," />B
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px' }}><TrendingDown size={14} color="var(--status-good)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> 3.4% beneath aggressive baseline</p>
                </div>

                {/* KPI: SAVINGS */}
                <div className="glass-panel kpi-card" style={{ borderTop: '3px solid var(--accent-yellow)' }}>
                    <div className="kpi-title" style={{ color: 'var(--accent-yellow)' }}>Yield / Hard Savings</div>
                    <div className="kpi-value" style={{ color: 'var(--accent-yellow)' }}>
                        $<CountUp end={yoySavings / 1000000} decimals={1} duration={2} separator="," />M
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '10px' }}>Negotiated directly across 30+ MSAs</p>
                </div>

            </div>

            {/* CHART ROW */}
            <div className="animate-fade-in-up stagger-3" style={{ marginBottom: '30px' }}>
                <ChartWithNarrative title="Predictive Spend Pipeline & Machine Learning Overlays">
                    <div style={{ height: '400px', padding: '10px 0' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </ChartWithNarrative>
            </div>

            {/* RECOMMENDATIONS */}
            <div className="animate-fade-in-up stagger-4">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Target size={20} color="var(--accent-red)" /> Strategic Imperatives
                </h3>
                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                    <div className="glass-panel" style={{ padding: '25px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(230,0,40,0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Server size={24} color="var(--accent-red)" />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Consolidate IT & Telecom</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Fragmented software licensing identified across US and EU divisions. Projected $4.2M avoidance via Enterprise Agreement centralization.</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '25px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(255,204,0,0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Shield size={24} color="var(--accent-yellow)" />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Harden Logistics SLAs</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Tier 1 freight vendors sliding beneath 92% Delivery Target. Implement strict penalty clauses before Q4 peak volumes crash the docks.</p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '25px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'rgba(34,197,94,0.1)', padding: '12px', borderRadius: '50%' }}>
                            <Globe size={24} color="#22C55E" />
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Accelerate ISO Target</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Marketing Services agencies trailing in localized ESG scores. Mandate immediate sustainability audits to secure compliance baseline.</p>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Overview;
