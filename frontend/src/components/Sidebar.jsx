import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Cuboid, ShieldAlert, FileText, AlertTriangle, SlidersHorizontal, Radio } from 'lucide-react';

const Sidebar = () => {
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

    const alerts = [
        { type: 'MARKET', text: 'Aluminum commodity spot price +4.2%. Re-evaluate packaging MSAs.', color: '#FFCC00' },
        { type: 'SLA BREACH', text: 'Microsoft Q3 Quality metrics dropped to 81%. Review required.', color: '#E60028' },
        { type: 'SECURITY', text: 'Log4j vulnerability detected in Tier 3 offshore HR vendors.', color: '#E60028' },
        { type: 'LOGISTICS', text: 'Panama Canal transit delays averaging +8 days. Freight costs compounding.', color: '#FFCC00' },
        { type: 'SAVINGS', text: 'WPP consolidated global master contract executed. $12M avoidance secured.', color: '#22C55E' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
        }, 12000); // Rotate every 12 seconds
        return () => clearInterval(interval);
    }, []);

    const activeAlert = alerts[currentAlertIndex];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/1200px-RedBullEnergyDrink.svg.png"
                    alt="Red Bull Logo"
                    className="sidebar-logo"
                />
                <div className="sidebar-title">PROCUREMENT HUB</div>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Overview</span>
                </NavLink>

                <NavLink
                    to="/categories"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <Cuboid size={20} />
                    <span>Categories</span>
                </NavLink>

                <NavLink
                    to="/vendors"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <ShieldAlert size={20} />
                    <span>Vendor Analysis</span>
                </NavLink>

                <NavLink
                    to="/simulator"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <SlidersHorizontal size={20} />
                    <span>Simulator & Market</span>
                </NavLink>

                <NavLink
                    to="/contracts"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <FileText size={20} />
                    <span>Contracts</span>
                </NavLink>

                <NavLink
                    to="/risk"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <AlertTriangle size={20} />
                    <span>Risk Monitor</span>
                </NavLink>
            </nav>

            {/* LIVE TELEMETRY FEED */}
            <div className="glass-panel animate-fade-in-up stagger-5" style={{ margin: '20px', padding: '15px', border: `1px solid ${activeAlert.color}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: activeAlert.color }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Radio size={14} color={activeAlert.color} className="pulse-icon" />
                    <span style={{ fontSize: '0.7rem', color: activeAlert.color, fontWeight: 'bold', letterSpacing: '1px' }}>{activeAlert.type} ALERT</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {activeAlert.text}
                </div>
            </div>

            <div className="sidebar-footer">
                Created by<br />MOHAMMED KAIF AHMED
            </div>
        </aside>
    );
};

export default Sidebar;
