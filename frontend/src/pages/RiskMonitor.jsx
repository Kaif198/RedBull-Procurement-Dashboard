import React from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartWithNarrative from '../components/ChartWithNarrative';
import { ShieldAlert, Globe, Banknote, TrendingUp, AlertOctagon } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const RiskMonitor = ({ vendorDB, sustainability }) => {
    // Aggregate Risk Metrics
    const avgGeoRisk = (vendorDB.reduce((sum, v) => sum + v.riskOptions.geographicRisk, 0) / vendorDB.length).toFixed(1);
    const avgFinRisk = (vendorDB.reduce((sum, v) => sum + v.riskOptions.financialRisk, 0) / vendorDB.length).toFixed(1);
    const totalVendorsInScrutiny = vendorDB.filter(v => v.rating === 'Review Required').length;

    // 1. ESG Compliance Bar Chart
    const esgData = {
        labels: sustainability.data.labels,
        datasets: [
            {
                label: 'Red Bull Baseline Score',
                data: sustainability.data.scores_redbull,
                backgroundColor: 'rgba(255, 204, 0, 0.8)',
                borderColor: '#FFCC00',
                borderWidth: 1
            },
            {
                label: 'Industry Market Median',
                data: sustainability.data.scores_benchmark,
                backgroundColor: 'rgba(148, 163, 184, 0.3)',
                borderColor: '#94A3B8',
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#F1F5F9', usePointStyle: true } },
            tooltip: { backgroundColor: 'rgba(19, 25, 43, 0.9)', titleColor: '#F1F5F9', bodyColor: '#F1F5F9', borderColor: '#172F55', borderWidth: 1 }
        },
        scales: {
            y: { min: 40, max: 100, grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } },
            x: { grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } }
        }
    };

    // Renaming for clarity in the new structure
    const susData = esgData;
    const susOptions = barOptions;

    return (
        <>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: '30px' }}>
                <h2>Enterprise Risk Monitor</h2>
                <p className="page-desc">Macro-level vulnerability tracking across Geographic, Financial, and Ethical (ISO 20400) vectors.</p>
            </div>

            <div className="animate-fade-in-up stagger-2 grid-3" style={{ marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Financial Vulnerability Index</span>
                        <TrendingUp size={20} color={avgFinRisk >= 40 ? '#E60028' : '#22C55E'} />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: avgFinRisk >= 40 ? '#E60028' : '#F1F5F9', lineHeight: '1' }}>{avgFinRisk}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>Systemic portfolio exposure calculated globally.</div>
                </div>

                <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Macro Geo-Risk Engine</span>
                        <Globe size={20} color="#FFCC00" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: '#FFCC00', lineHeight: '1' }}>{avgGeoRisk}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>Political & Logistical stability threshold. Tracking stable.</div>
                </div>

                <div className="glass-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', border: '1px solid #E60028', background: 'rgba(230,0,40,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#E60028', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Immediate Action Required</span>
                        <AlertOctagon size={20} color="#E60028" className="pulse-icon" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: '#E60028', lineHeight: '1' }}>{totalVendorsInScrutiny}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '10px' }}>Vendors with Risk Matrix scores exceeding maximum tolerance limits.</div>
                </div>
            </div>

            <div className="grid-2">
                <div className="animate-fade-in-up stagger-3 glass-panel" style={{ padding: '20px' }}>
                    <ChartWithNarrative title="ISO 20400 Performance Matrix: Red Bull vs Industry Baseline" narrative={sustainability.narrative}>
                        <div style={{ height: '350px' }}><Bar data={susData} options={susOptions} /></div>
                    </ChartWithNarrative>
                </div>
            </div>

            {/* High Risk Offender Component */}
            <h3 style={{ marginTop: '40px', marginBottom: '20px', fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: 'var(--text-primary)' }}>High-Risk Exposure Vector</h3>
            <div style={{ background: 'rgba(230, 0, 40, 0.05)', border: '1px solid #E60028', padding: '30px', borderRadius: '6px' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <strong style={{ color: '#E60028' }}>CRITICAL ALERT:</strong> The current geographic risk index indicates an ongoing disruption probability across the <strong style={{ color: '#F1F5F9' }}>Logistics & Freight</strong> category. It is highly recommended to diversify the APAC shipping routing across secondary providers to dilute the systemic {avgGeoRisk} risk exposure tracked in the telemetry layer.
                </p>
            </div>

        </>
    );
};

export default RiskMonitor;
