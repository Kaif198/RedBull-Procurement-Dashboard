import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartWithNarrative from '../components/ChartWithNarrative';

ChartJS.register(ArcElement, Tooltip, Legend);

const Categories = ({ categories }) => {
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

    // Sort categories by spend to ensure consistency
    const sortedCategories = [...categories.data].sort((a, b) => b.spend - a.spend);
    const [activeCat, setActiveCat] = useState(sortedCategories[0]);

    const data = {
        labels: sortedCategories.map(c => c.name),
        datasets: [{
            data: sortedCategories.map(c => c.spend),
            backgroundColor: [
                '#E60028', '#FFCC00', '#172F55', '#0A1D3A', '#94A3B8', '#64748B', '#334155'
            ],
            borderWidth: 2,
            borderColor: '#13192B',
            hoverOffset: 15
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { position: 'right', labels: { color: '#F1F5F9', usePointStyle: true, padding: 20 } },
            tooltip: {
                backgroundColor: 'rgba(19, 25, 43, 0.9)',
                titleColor: '#F1F5F9',
                bodyColor: '#F1F5F9',
                borderColor: '#172F55',
                borderWidth: 1,
                callbacks: {
                    label: (context) => ` ${formatCurrency(context.raw)}`
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const idx = elements[0].index;
                setActiveCat(sortedCategories[idx]);
            }
        }
    };

    return (
        <>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: '30px' }}>
                <h2>Strategic Category Analysis</h2>
                <p className="page-desc">Macro-level distribution breakdown and foundational vendor density mapping.</p>
            </div>

            <div className="grid-2">
                <div className="animate-fade-in-up stagger-2 glass-panel" style={{ padding: '20px' }}>
                    <ChartWithNarrative title="Global Category Spend Distribution">
                        <div style={{ height: '350px' }}><Doughnut data={data} options={options} /></div>
                    </ChartWithNarrative>
                </div>

                <div className="animate-fade-in-up stagger-3 glass-panel" style={{ padding: '20px' }}>
                    <ChartWithNarrative title="Sub-Category Profiling">
                        <div style={{ padding: '10px 0' }}>
                            <h3 style={{ color: 'var(--accent-yellow)', fontSize: '1.5rem', marginBottom: '25px' }}>{activeCat.name}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Total Category Spend</span>
                                    <span style={{ color: 'var(--accent-yellow)', fontWeight: '700' }}>{formatCurrency(activeCat.spend)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Identified Savings Pipeline</span>
                                    <span style={{ color: 'var(--accent-red)', fontWeight: '700' }}>{formatCurrency(activeCat.savingsPipeline)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--panel-border)', paddingBottom: '10px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Market Suppliers</span>
                                    <span style={{ fontWeight: '700' }}>{activeCat.topSuppliers.join(', ')}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                    <span style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Contract Health Lifecycle</span>
                                    <div style={{ width: '100%', height: '8px', background: '#334155', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                                        <div style={{ width: `${activeCat.contractStatus.active}%`, background: '#22C55E' }} title={`Active: ${activeCat.contractStatus.active}%`}></div>
                                        <div style={{ width: `${activeCat.contractStatus.expiring}%`, background: '#FFCC00' }} title={`Expiring: ${activeCat.contractStatus.expiring}%`}></div>
                                        <div style={{ width: `${activeCat.contractStatus.expired}%`, background: '#E60028' }} title={`Off-Contract: ${activeCat.contractStatus.expired}%`}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                        <span>Active ({activeCat.contractStatus.active}%)</span>
                                        <span>Expiring ({activeCat.contractStatus.expiring}%)</span>
                                        <span>Off-Contract ({activeCat.contractStatus.expired}%)</span>
                                    </div>
                                </div>
                            </div>

                            <p style={{ marginTop: '30px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                <em>* Click segments on the doughnut chart to switch category profile.</em>
                            </p>
                        </div>
                    </ChartWithNarrative>
                </div>
            </div>
        </>
    );
};

export default Categories;
