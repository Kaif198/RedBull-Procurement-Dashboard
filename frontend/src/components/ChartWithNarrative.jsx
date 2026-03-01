import React from 'react';

const ChartWithNarrative = ({ title, children, narrative }) => {
    return (
        <div className="chart-module">
            <div className="chart-module-header">
                <h3>{title}</h3>
            </div>
            <div className="chart-module-body">
                {children}
            </div>
            {narrative && (
                <div className="narrative-box">
                    <p><strong>Strategic Context:</strong> {narrative}</p>
                </div>
            )}
        </div>
    );
};

export default ChartWithNarrative;
