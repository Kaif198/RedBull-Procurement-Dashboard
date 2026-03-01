import React, { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend,
    RadialLinearScale, RadarController, LineElement, Filler
} from 'chart.js';
import { Bubble, Radar, Scatter } from 'react-chartjs-2';
import { Search, Filter, ShieldAlert, Activity, DollarSign, Target, Printer } from 'lucide-react';
import ChartWithNarrative from '../components/ChartWithNarrative';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, RadialLinearScale, RadarController, LineElement, Filler);

const Vendors = ({ vendorDB, sustainability }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState('All');
    const [activeVendor, setActiveVendor] = useState(vendorDB[0]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

    // Deriving dropdown options
    const categories = ['All', ...new Set(vendorDB.map(v => v.category))];
    const ratings = ['All', ...new Set(vendorDB.map(v => v.rating))];

    // Apply slicers
    const filteredVendors = useMemo(() => {
        return vendorDB.filter(v => {
            const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCat = categoryFilter === 'All' || v.category === categoryFilter;
            const matchRate = ratingFilter === 'All' || v.rating === ratingFilter;
            return matchSearch && matchCat && matchRate;
        });
    }, [vendorDB, searchQuery, categoryFilter, ratingFilter]);

    // Ensure active vendor stays relevant to filters
    useEffect(() => {
        if (filteredVendors.length > 0 && !filteredVendors.find(v => v.id === activeVendor?.id)) {
            setActiveVendor(filteredVendors[0]);
        }
    }, [filteredVendors, activeVendor]);

    // Chart 1: Localized Radar (ESG)
    const susData = {
        labels: sustainability.data.labels,
        datasets: [
            {
                label: 'Red Bull Baseline',
                data: sustainability.data.scores_redbull,
                backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: '#94A3B8', borderDash: [5, 5],
                pointBackgroundColor: '#94A3B8', pointBorderColor: '#fff', order: 2
            },
            {
                label: activeVendor ? `\${activeVendor.name} ESG Profile` : 'No Vendor Selected',
                data: activeVendor ? activeVendor.sustainability : [],
                backgroundColor: 'rgba(255, 204, 0, 0.3)', borderColor: '#FFCC00',
                pointBackgroundColor: '#FFCC00', pointBorderColor: '#fff', order: 1
            }
        ]
    };

    const susOptions = {
        responsive: true, maintainAspectRatio: false,
        scales: {
            r: { angleLines: { color: 'rgba(30, 41, 59, 0.5)' }, grid: { color: 'rgba(30, 41, 59, 0.5)' }, pointLabels: { color: '#F1F5F9', font: { size: 10 } }, ticks: { display: false, min: 40, max: 100 } }
        },
        plugins: { legend: { position: 'top', labels: { color: '#F1F5F9', usePointStyle: true } } }
    };

    // Chart 2: Dynamic Bubble Map
    const riskData = {
        datasets: [{
            label: 'Supplier Risk',
            data: filteredVendors.map(v => ({ x: v.riskOptions.likelihood, y: v.riskOptions.impact, r: Math.max(v.spend / 8000000, 5), name: v.name, spend: v.spend, id: v.id })),
            backgroundColor: (ctx) => ctx.raw?.id === activeVendor?.id ? 'rgba(255, 204, 0, 0.9)' : 'rgba(230, 0, 40, 0.3)',
            borderColor: (ctx) => ctx.raw?.id === activeVendor?.id ? '#FFCC00' : '#E60028',
            hoverBackgroundColor: '#FFCC00',
        }]
    };

    const riskOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(19, 25, 43, 0.9)', titleColor: '#F1F5F9', bodyColor: '#F1F5F9', borderColor: '#172F55', borderWidth: 1,
                callbacks: { label: (ctx) => ` ${ctx.raw.name}: ${formatCurrency(ctx.raw.spend)} (L:${ctx.raw.x}, I:${ctx.raw.y})` }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Likelihood', color: '#94A3B8' }, min: 0, max: 5.5, grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } },
            y: { title: { display: true, text: 'Impact', color: '#94A3B8' }, min: 0, max: 5.5, grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const vendorObj = filteredVendors[elements[0].index];
                setActiveVendor(vendorObj);
            }
        }
    };

    // Chart 3: Performance Scatter
    const perfData = {
        datasets: [{
            label: 'Vendor SLAs',
            data: filteredVendors.map(v => ({ x: v.quality, y: v.delivery, name: v.name, rating: v.rating, id: v.id })),
            backgroundColor: (ctx) => ctx.raw?.id === activeVendor?.id ? '#FFCC00' : (ctx.raw?.rating === 'Review Required' ? 'rgba(230, 0, 40, 0.5)' : 'rgba(34, 197, 94, 0.5)'),
            pointRadius: (ctx) => ctx.raw?.id === activeVendor?.id ? 12 : 6,
            pointHoverRadius: 10
        }]
    };

    const perfOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(19, 25, 43, 0.9)', titleColor: '#F1F5F9', bodyColor: '#F1F5F9', borderColor: '#172F55', borderWidth: 1,
                callbacks: { label: (ctx) => ` ${ctx.raw.name} - ${ctx.raw.rating} (Q:${ctx.raw.x}%, D:${ctx.raw.y}%)` }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Quality SLA (%)', color: '#94A3B8' }, min: 60, max: 100, grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } },
            y: { title: { display: true, text: 'Delivery SLA (%)', color: '#94A3B8' }, min: 60, max: 100, grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#94A3B8' } }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const vendorObj = filteredVendors[elements[0].index];
                setActiveVendor(vendorObj);
            }
        }
    };

    return (
        <>
            <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ marginBottom: '5px' }}>Vendor Deep Dive & Intelligence</h2>
                    <p className="page-desc" style={{ marginBottom: 0 }}>Interactive telemetry slicing for individual vendor health monitoring, SLA performance, and ISO 20400 benchmarking.</p>
                </div>
                <button
                    className="export-btn"
                    onClick={() => window.print()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-red)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#C00020'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--accent-red)'; }}
                >
                    <Printer size={18} /> Export Brief
                </button>
            </div>

            {/* Slicers & Filters Panel */}
            <div className="animate-fade-in-up stagger-2 slicer-panel glass-panel" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(9, 12, 21, 0.8)', border: '1px solid var(--panel-border)', padding: '10px 15px', borderRadius: '4px', flexGrow: 1, maxWidth: '400px' }}>
                    <Search size={18} color="var(--text-secondary)" style={{ marginRight: '10px' }} />
                    <input
                        type="text"
                        placeholder="Search vendor matrix..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none', fontSize: '0.95rem' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Filter size={18} color="var(--text-secondary)" />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ background: 'rgba(9, 12, 21, 0.8)', color: 'var(--text-primary)', padding: '10px', border: '1px solid var(--panel-border)', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} style={{ background: 'rgba(9, 12, 21, 0.8)', color: 'var(--text-primary)', padding: '10px', border: '1px solid var(--panel-border)', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}>
                        {ratings.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="animate-fade-in-up stagger-3" style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) minmax(350px, 400px)', gap: '30px', marginBottom: '40px' }}>

                {/* Main Charts Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <ChartWithNarrative title="Risk Heatmap (Impact vs Likelihood)">
                            <div style={{ height: '350px' }}><Bubble data={riskData} options={riskOptions} /></div>
                        </ChartWithNarrative>
                    </div>

                    <div className="grid-2" style={{ marginBottom: 0 }}>
                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <ChartWithNarrative title="SLA Trajectory vs Active Vendor">
                                <div style={{ height: '300px' }}><Scatter data={perfData} options={perfOptions} /></div>
                            </ChartWithNarrative>
                        </div>
                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <ChartWithNarrative title="ISO 20400 Localized Radar">
                                <div style={{ height: '300px' }}><Radar data={susData} options={susOptions} /></div>
                            </ChartWithNarrative>
                        </div>
                    </div>
                </div>

                {/* Localized Health Card Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="animate-fade-in-up stagger-4 glass-panel" style={{ height: '100%', borderTop: `4px solid ${activeVendor?.rating === 'Strategic Partner' ? '#22C55E' : (activeVendor?.rating === 'Review Required' ? '#E60028' : '#FFCC00')}`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '25px', borderBottom: '1px solid var(--panel-border)', background: 'rgba(9, 12, 21, 0.4)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '1px' }}>Active Vendor</div>
                            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{activeVendor ? activeVendor.name : 'Unknown'}</h3>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{activeVendor ? activeVendor.category : ''}</div>
                        </div>

                        {activeVendor ? (
                            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '25px', flexGrow: 1 }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <DollarSign size={16} /> Total Verified Spend
                                    </div>
                                    <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>{formatCurrency(activeVendor.spend)}</div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <Activity size={16} /> SLA Rating
                                    </div>
                                    <div style={{ display: 'inline-block', padding: '6px 12px', background: activeVendor.rating === 'Strategic Partner' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(230, 0, 40, 0.1)', color: activeVendor.rating === 'Strategic Partner' ? '#22C55E' : (activeVendor.rating === 'Review Required' ? '#E60028' : '#FFCC00'), borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                        {activeVendor.rating} (Q:{activeVendor.quality}% / D:{activeVendor.delivery}%)
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <ShieldAlert size={16} /> Vulnerability Matrix
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ flex: 1, background: 'rgba(9, 12, 21, 0.5)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: '600' }}>{activeVendor.riskOptions.financialRisk}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Financial Risk</div>
                                        </div>
                                        <div style={{ flex: 1, background: 'rgba(9, 12, 21, 0.5)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: '600' }}>{activeVendor.riskOptions.geographicRisk}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Geo Risk</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--panel-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <Target size={16} /> Direct Financial Impact
                                    </div>
                                    <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: activeVendor.directImpact >= 0 ? '#22C55E' : '#E60028' }}>
                                        {activeVendor.directImpact >= 0 ? '+' : ''}{formatCurrency(activeVendor.directImpact)}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {activeVendor.directImpact >= 0 ? 'Identified Strategic Hard Savings' : 'Forecasted Supply Chain Margin Risk'}
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div style={{ padding: '25px', color: 'var(--text-secondary)', textAlign: 'center' }}>None matching filters</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vendors;
