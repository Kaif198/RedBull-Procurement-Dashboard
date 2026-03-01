import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartWithNarrative from '../components/ChartWithNarrative';
import { Calculator, TrendingUp, SlidersHorizontal, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Simulator = () => {

    // --- 1. WHAT-IF SANDBOX STATE ---
    const [freightCostDelta, setFreightCostDelta] = useState(0); // -20 to +50
    const [inflationDelta, setInflationDelta] = useState(2.5); // 0 to 10
    const [forexExposure, setForexExposure] = useState(0); // -10 to +10

    // --- 2. ROI CALCULATOR STATE ---
    const [calcSpend, setCalcSpend] = useState(15000000);
    const [calcDiscount, setCalcDiscount] = useState(5.0);
    const [calcImplementation, setCalcImplementation] = useState(150000);

    // Math for ROI
    const grossSavings = calcSpend * (calcDiscount / 100);
    const netSavings = grossSavings - calcImplementation;
    const roiPercentage = calcImplementation > 0 ? ((netSavings / calcImplementation) * 100).toFixed(1) : 0;

    // --- 3. DYNAMIC P&L CHART DATA ---
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

    // Simulate a baseline spend curve
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baselineSpend = [20, 21, 23, 21, 24, 25, 27, 26, 28, 29, 31, 32].map(v => v * 1000000);

    // Apply the slider modifiers mathematically to create the "What If" curve
    const simulatedSpend = baselineSpend.map(val => {
        const freightImpact = val * 0.15 * (freightCostDelta / 100); // Assume 15% of total spend is freight sensitive
        const inflationImpact = val * (inflationDelta / 100);
        const forexImpact = val * 0.40 * (forexExposure / 100); // Assume 40% exposed to Forex
        return val + freightImpact + inflationImpact + forexImpact;
    });

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Projected Baseline Spend',
                data: baselineSpend,
                borderColor: '#94A3B8',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Active Simulation (Stressed)',
                data: simulatedSpend,
                borderColor: '#FFCC00',
                backgroundColor: 'rgba(255, 204, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#FFCC00'
            }
        ]
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#F1F5F9', usePointStyle: true } },
            tooltip: { backgroundColor: 'rgba(19, 25, 43, 0.9)', titleColor: '#F1F5F9', bodyColor: '#FFCC00', callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } }
        },
        scales: {
            y: { grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8', callback: (val) => `$${val / 1000000}M` } },
            x: { grid: { color: 'transparent' }, ticks: { color: '#94A3B8' } }
        }
    };

    return (
        <>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: '30px' }}>
                <h2>Market Intel & Strategy Simulator</h2>
                <p className="page-desc">Interactive macro-economic sandbox modeling. Test Category P&L against market volatility and quantify immediate Strategic Sourcing ROI.</p>
            </div>

            {/* TOP ROW: Market Indicators & ROI Calculator */}
            <div className="animate-fade-in-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 400px', gap: '30px', marginBottom: '40px' }}>

                {/* MARKET DIALS */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)', background: 'rgba(9, 12, 21, 0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={20} color="var(--accent-red)" /> <h3 style={{ margin: 0 }}>Global Market Indices</h3>
                    </div>
                    <div style={{ padding: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between', flexGrow: 1 }}>

                        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                            <div style={{ padding: '15px', borderRadius: '50%', border: '4px solid #E60028', width: '100px', height: '100px', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(230, 0, 40, 0.1)' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#E60028' }}>5.2%</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logistics Fuel Surcharge</div>
                        </div>

                        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                            <div style={{ padding: '15px', borderRadius: '50%', border: '4px solid #FFCC00', width: '100px', height: '100px', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 204, 0, 0.1)' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#FFCC00' }}>3.1%</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Global Core Inflation</div>
                        </div>

                        <div style={{ flex: 1, minWidth: '120px', textAlign: 'center' }}>
                            <div style={{ padding: '15px', borderRadius: '50%', border: '4px solid #22C55E', width: '100px', height: '100px', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 197, 94, 0.1)' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#22C55E' }}>1.09</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>EUR/USD Forex Rate</div>
                        </div>

                    </div>
                </div>

                {/* ROI CALCULATOR */}
                <div className="glass-panel" style={{ borderTop: '4px solid var(--accent-yellow)' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)', background: 'rgba(9, 12, 21, 0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calculator size={20} color="var(--accent-yellow)" /> <h3 style={{ margin: 0 }}>Strategic Sourcing Calculator</h3>
                    </div>
                    <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Target Category Spend ($)</label>
                            <input type="number" value={calcSpend} onChange={(e) => setCalcSpend(Number(e.target.value))} style={{ width: '100%', background: 'rgba(9, 12, 21, 0.8)', color: 'white', border: '1px solid var(--panel-border)', padding: '10px', borderRadius: '4px' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Negotiated Discount (%)</label>
                                <input type="number" step="0.1" value={calcDiscount} onChange={(e) => setCalcDiscount(Number(e.target.value))} style={{ width: '100%', background: 'rgba(9, 12, 21, 0.8)', color: 'white', border: '1px solid var(--panel-border)', padding: '10px', borderRadius: '4px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Project/Impl. Cost ($)</label>
                                <input type="number" value={calcImplementation} onChange={(e) => setCalcImplementation(Number(e.target.value))} style={{ width: '100%', background: 'rgba(9, 12, 21, 0.8)', color: 'white', border: '1px solid var(--panel-border)', padding: '10px', borderRadius: '4px' }} />
                            </div>
                        </div>

                        <div style={{ marginTop: '10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22C55E', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: '#22C55E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Projected Net ROI</div>
                            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold', color: '#22C55E' }}>{roiPercentage}%</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Implies {formatCurrency(netSavings)} Net Hard Savings</div>
                        </div>

                    </div>
                </div>

            </div>

            {/* BOTTOM ROW: The Sandbox */}
            <div className="animate-fade-in-up stagger-3">
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><SlidersHorizontal size={22} color="var(--accent-red)" /> P&L Stress-Test Sandbox</h3>
                <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '30px', padding: '30px' }}>

                    {/* Sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingRight: '20px', borderRight: '1px solid var(--panel-border)' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Freight / Logistics Volatility</label>
                                <span style={{ color: freightCostDelta > 0 ? '#E60028' : '#22C55E', fontWeight: 'bold' }}>{freightCostDelta > 0 ? '+' : ''}{freightCostDelta}%</span>
                            </div>
                            <input type="range" min="-20" max="50" value={freightCostDelta} onChange={(e) => setFreightCostDelta(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-red)' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Simulates supply chain blockages (e.g. Red Sea/Panama routing delays).</div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Inflation Baseline Modifier</label>
                                <span style={{ color: inflationDelta > 2.5 ? '#E60028' : '#22C55E', fontWeight: 'bold' }}>{inflationDelta}%</span>
                            </div>
                            <input type="range" min="0" max="15" step="0.5" value={inflationDelta} onChange={(e) => setInflationDelta(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-yellow)' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Overrides global inflationary drift applied to structural OPEX.</div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Forex Exposure (USD/EUR Ratio)</label>
                                <span style={{ color: forexExposure > 0 ? '#E60028' : '#22C55E', fontWeight: 'bold' }}>{forexExposure > 0 ? '+' : ''}{forexExposure}%</span>
                            </div>
                            <input type="range" min="-15" max="15" value={forexExposure} onChange={(e) => setForexExposure(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', accentColor: '#94A3B8' }} />
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Stresses the 40% Euro-denominated spend portfolio against USD shifts.</div>
                        </div>

                        <button style={{ background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', transition: 'all 0.2s' }} onClick={() => { setFreightCostDelta(0); setInflationDelta(2.5); setForexExposure(0); }} onMouseOver={(e) => { e.target.style.background = 'rgba(230,0,40,0.1)'; }} onMouseOut={(e) => { e.target.style.background = 'transparent'; }}>Reset Baseline Sandbox</button>
                    </div>

                    {/* Dynamic Chart Output */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Simulated Impact Trajectory</h4>
                        <div style={{ flexGrow: 1, minHeight: '350px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>

                        {/* Dynamic Narrative generation based on slider math */}
                        <div style={{ marginTop: '20px', background: 'rgba(9, 12, 21, 0.5)', padding: '15px', borderRadius: '4px', borderLeft: `3px solid ${freightCostDelta > 10 || inflationDelta > 5 ? '#E60028' : '#FFCC00'}` }}>
                            <strong style={{ color: freightCostDelta > 10 || inflationDelta > 5 ? '#E60028' : '#FFCC00' }}>SIMULATOR OUTPUT: </strong>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {freightCostDelta > 20 ? "Severe logistics volatility is injecting millions in unplanned friction costs. Immediate contract renegotiation recommended to secure fixed-rate lane pricing. " : ""}
                                {inflationDelta > 6 ? "Runaway inflation triggers extreme P&L risk across Professional Services. " : ""}
                                {Math.abs(forexExposure) > 5 ? "Forex swings are actively eroding margin. Engage Treasury for advanced hedging on EUR/USD. " : ""}
                                {(freightCostDelta <= 20 && inflationDelta <= 6 && Math.abs(forexExposure) <= 5) ? "Market conditions are relatively stable against the procurement baseline. The current strategic hedging models remain effective." : ""}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Simulator;
