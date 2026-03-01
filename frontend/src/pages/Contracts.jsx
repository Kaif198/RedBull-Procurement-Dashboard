import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const Contracts = ({ vendorDB }) => {
    const [filter, setFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(val);

    // Extract contracts array from Vendor DB
    const contracts = vendorDB.map(v => ({
        vendorName: v.name,
        category: v.category,
        ...v.contract
    }));

    // Summary Metrics
    const activeCount = contracts.filter(c => c.status === 'Active').length;
    const expiringCount = contracts.filter(c => c.status === 'Expiring Soon').length;
    const expiredCount = contracts.filter(c => c.status === 'Off-Contract').length;

    // Slicing & Sorting Logic
    const filteredContracts = contracts.filter(c => filter === 'All' || c.status === filter);
    const sortedContracts = [...filteredContracts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}><CheckCircle2 size={14} /> Active</span>;
            case 'Expiring Soon': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 204, 0, 0.1)', color: '#FFCC00', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}><AlertCircle size={14} /> Expiring</span>;
            case 'Off-Contract': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(230, 0, 40, 0.1)', color: '#E60028', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}><XCircle size={14} /> Off-Contract</span>;
        }
    };

    return (
        <>
            <div className="animate-fade-in-up stagger-1" style={{ marginBottom: '30px' }}>
                <h2>Master Contract Registry</h2>
                <p className="page-desc">Enterprise-wide MSA lifecycle tracking, value monitoring, and negotiation event triggers.</p>
            </div>

            <div className="animate-fade-in-up stagger-2 grid-3" style={{ marginBottom: '40px' }}>
                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #22C55E' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Secured (Active)</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22C55E', lineHeight: '1' }}>{filteredContracts.filter(c => c.status === 'Active').length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #FFCC00' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Critical Window (&lt;90 Days)</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFCC00', lineHeight: '1' }}>{filteredContracts.filter(c => c.status === 'Expiring').length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #E60028' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Non-Compliant (Off-Contract)</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#E60028', lineHeight: '1' }}>{filteredContracts.filter(c => c.status === 'Off-Contract').length}</div>
                </div>
            </div>

            <div className="animate-fade-in-up stagger-3 glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(9, 12, 21, 0.5)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="var(--accent-yellow)" /> Master Contract Registry</h3>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ background: 'rgba(9, 12, 21, 0.8)', color: 'var(--text-primary)', padding: '8px 15px', border: '1px solid var(--panel-border)', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}>
                        <option value="All">All Lifecycles</option>
                        <option value="Active">Active Only</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Off-Contract">Off-Contract</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(23, 47, 85, 0.2)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid var(--panel-border)' }} onClick={() => requestSort('vendorName')}>Vendor</th>
                                <th style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid var(--panel-border)' }} onClick={() => requestSort('category')}>Category</th>
                                <th style={{ padding: '15px 20px', borderBottom: '1px solid var(--panel-border)' }}>Contract ID</th>
                                <th style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid var(--panel-border)' }} onClick={() => requestSort('value')}>Est. Value</th>
                                <th style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid var(--panel-border)' }} onClick={() => requestSort('expirationDate')}>Expiration Date</th>
                                <th style={{ padding: '15px 20px', borderBottom: '1px solid var(--panel-border)' }}>Auto-Renew</th>
                                <th style={{ padding: '15px 20px', borderBottom: '1px solid var(--panel-border)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedContracts.map((contract, i) => (
                                <tr key={contract.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(9, 12, 21, 0.3)', borderBottom: '1px solid rgba(30, 41, 59, 0.5)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '15px 20px', fontWeight: '500' }}>{contract.vendorName}</td>
                                    <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{contract.category}</td>
                                    <td style={{ padding: '15px 20px', fontFamily: 'monospace', color: 'var(--accent-blue)' }}>{contract.id}</td>
                                    <td style={{ padding: '15px 20px', fontFamily: 'var(--font-display)', fontWeight: '600' }}>{formatCurrency(contract.value)}</td>
                                    <td style={{ padding: '15px 20px' }}>{contract.expirationDate}</td>
                                    <td style={{ padding: '15px 20px' }}>{contract.autoRenew ? <span style={{ color: '#22C55E' }}>Yes</span> : <span style={{ color: 'var(--text-secondary)' }}>No</span>}</td>
                                    <td style={{ padding: '15px 20px' }}>{getStatusBadge(contract.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Contracts;
