import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Categories from './pages/Categories';
import Vendors from './pages/Vendors';
import Contracts from './pages/Contracts';
import RiskMonitor from './pages/RiskMonitor';
import Simulator from './pages/Simulator';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="loading">Initializing Intelligence Hub...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Overview data={data} />} />
            <Route path="/categories" element={<Categories categories={data.categories} />} />
            <Route path="/vendors" element={<Vendors vendorDB={data.vendorDB} sustainability={data.sustainability} />} />
            <Route path="/contracts" element={<Contracts vendorDB={data.vendorDB} />} />
            <Route path="/risk" element={<RiskMonitor vendorDB={data.vendorDB} sustainability={data.sustainability} />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
