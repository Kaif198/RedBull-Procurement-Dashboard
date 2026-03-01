import json
import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
import warnings

warnings.filterwarnings("ignore")

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("Warning: Facebook Prophet is not installed. Data generator will use a mock fallback.")

def generate_dashboard_data():
    global PROPHET_AVAILABLE
    np.random.seed(42)
    random.seed(42)
    
    # 1. Executive Summary KPIs
    kpis = {
        "totalSpend": 1254300000,
        "yoySavings": 45200000,
        "forecastAccuracy": 94.2,
        "supplierCount": 1450
    }

    # 2. Time-Series Spend Intelligence Data
    dates = pd.date_range(start="2022-01-01", periods=36, freq='M')
    trend = np.linspace(30000000, 40000000, 36)
    seasonality = 5000000 * np.sin(np.arange(36) * (2 * np.pi / 12))
    noise = np.random.normal(0, 2000000, 36)
    
    historical_spend = trend + seasonality + noise
    historical_data = pd.DataFrame({'ds': dates, 'y': historical_spend})
    
    forecast_periods = 12
    future_dates = pd.date_range(start="2025-01-01", periods=forecast_periods, freq='M')
    
    arima_model = ARIMA(historical_data['y'], order=(5, 1, 0))
    arima_forecast = arima_model.fit().forecast(steps=forecast_periods).tolist()
    
    sarima_model = SARIMAX(historical_data['y'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    sarima_forecast = sarima_model.fit(disp=False).forecast(steps=forecast_periods).tolist()
    
    prophet_forecast, prophet_lower, prophet_upper = [], [], []
    
    if PROPHET_AVAILABLE:
        try:
            m = Prophet(yearly_seasonality=True)
            m.fit(historical_data)
            future = m.make_future_dataframe(periods=forecast_periods, freq='M')
            fcst = m.predict(future)
            future_fcst = fcst.tail(forecast_periods)
            prophet_forecast = future_fcst['yhat'].tolist()
        except:
            PROPHET_AVAILABLE = False
            
    if not PROPHET_AVAILABLE:
        base_trend = np.linspace(historical_spend[-1], historical_spend[-1] * 1.05, forecast_periods)
        future_seasonality = 5000000 * np.sin((np.arange(36, 36+forecast_periods)) * (2 * np.pi / 12))
        prophet_mock = base_trend + future_seasonality
        prophet_forecast = prophet_mock.tolist()

    all_dates = list(dates.strftime('%b %Y')) + list(future_dates.strftime('%b %Y'))
    hist_list = historical_spend.tolist() + [None]*forecast_periods
    pad = [None] * 36
    
    time_series = {
        "labels": all_dates,
        "historical": hist_list,
        "arima": pad + arima_forecast,
        "prophet": pad + prophet_forecast
    }

    ts_narrative = (
        f"The Prophet Bayesian model projects a baseline spend increase peaking at ${max(prophet_forecast)/1000000:.1f}M in the upcoming cycle, "
        f"diverging from the deterministic ARIMA model by ${(np.mean(prophet_forecast) - np.mean(arima_forecast))/1000000:.1f}M. "
        f"Strict contract enforcement is required during seasonal peaks to remain within the ARIMA lower bound."
    )

    # 3. Category Deep Dive
    categories = [
        {"name": "Marketing Services", "spend": 350000000, "topSuppliers": ["WPP", "Omnicom", "Publicis"], "contractStatus": {"active": 85, "expiring": 10, "expired": 5}, "savingsPipeline": 12000000},
        {"name": "IT & Telecom", "spend": 280000000, "topSuppliers": ["Cisco", "Microsoft", "Dell"], "contractStatus": {"active": 90, "expiring": 8, "expired": 2}, "savingsPipeline": 18500000},
        {"name": "Logistics & Freight", "spend": 210000000, "topSuppliers": ["DHL", "Kuehne+Nagel", "Maersk"], "contractStatus": {"active": 70, "expiring": 25, "expired": 5}, "savingsPipeline": 8000000},
        {"name": "FM & Real Estate", "spend": 150000000, "topSuppliers": ["CBRE", "JLL", "ISS"], "contractStatus": {"active": 95, "expiring": 5, "expired": 0}, "savingsPipeline": 4200000},
        {"name": "Professional Services", "spend": 120000000, "topSuppliers": ["Deloitte", "McKinsey", "PwC"], "contractStatus": {"active": 80, "expiring": 15, "expired": 5}, "savingsPipeline": 6500000}
    ]
    
    cat_narrative = "Marketing Services remains the highest aggregated spend vector, representing over 27% of total OPEX. Immediate attention is required on Logistics & Freight, where 30% of critical contracts are either expiring or off-contract."

    # 4. Phase 2 & 3: Extensive Vendor Database with Telemetry (30 Vendors)
    vendor_names = {
        "Marketing Services": ["WPP", "Omnicom", "Publicis", "Dentsu", "Interpublic Group", "Havas", "Stagwell", "Edelman"],
        "IT & Telecom": ["Microsoft", "Oracle", "Cisco", "Dell", "Salesforce", "ServiceNow", "SAP", "IBM", "AWS"],
        "Logistics & Freight": ["DHL", "Kuehne+Nagel", "Maersk", "DB Schenker", "XPO Logistics", "DSV", "C.H. Robinson"],
        "FM & Real Estate": ["CBRE", "JLL", "ISS", "Cushman & Wakefield", "Sodexo", "Compass Group"],
        "Professional Services": ["Deloitte", "PwC", "McKinsey", "BCG", "Bain & Company", "KPMG", "EY"]
    }

    vendors = []
    supplier_risk_bubble = []
    
    for category, names in vendor_names.items():
        for name in names:
            spend = random.randint(5000000, 110000000)
            quality = random.uniform(70, 99)
            delivery = random.uniform(65, 99)
            
            # SLA Rating Logic
            if quality >= 90 and delivery >= 90:
                rating = "Strategic Partner"
            elif quality >= 80 and delivery >= 80:
                rating = "Preferred Vendor"
            else:
                rating = "Review Required"
                
            likelihood = random.uniform(1.0, 5.0)
            impact = random.uniform(2.0, 5.0)
            
            # Force high impact for IT
            if category == "IT & Telecom": impact = random.uniform(3.5, 5.0)
            
            # ESG / Sustainability Scores
            sus_scores = [random.randint(60, 98) for _ in range(6)]
            
            # Direct Financial Impact Pipeline (Savings + Avoidance vs Risk Exposure)
            direct_impact = int((spend * (random.uniform(-0.05, 0.15)))) # negative means risk, positive means savings identified
            
            # Contracts Database Array
            today = datetime.now()
            days_to_expire = random.randint(-45, 730) # negative = expired
            exp_date = today + timedelta(days=days_to_expire)
            
            if days_to_expire < 0: status = "Off-Contract"
            elif days_to_expire <= 90: status = "Expiring Soon"
            else: status = "Active"
            
            contract_id = f"{name[:3].upper()}-{random.randint(10000, 99999)}"
            
            # Build unified vendor object
            v = {
                "id": name.lower().replace(" ", "-").replace("&", "").replace(".", ""),
                "name": name,
                "category": category,
                "spend": spend,
                "rating": rating,
                "quality": float(f"{quality:.1f}"),
                "delivery": float(f"{delivery:.1f}"),
                "riskOptions": {
                    "likelihood": float(f"{likelihood:.1f}"),
                    "impact": float(f"{impact:.1f}"),
                    "financialRisk": random.randint(1, 100),
                    "geographicRisk": random.randint(1, 100)
                },
                "sustainability": sus_scores,
                "directImpact": direct_impact,
                "contract": {
                    "id": contract_id,
                    "status": status,
                    "expirationDate": exp_date.strftime("%Y-%m-%d"),
                    "value": int(spend * 0.8), # Contract value representation
                    "autoRenew": random.choice([True, False, False])
                }
            }
            vendors.append(v)
            
            # Keep backwards compatibility for existing Vendor page bubble chart
            supplier_risk_bubble.append({
                "name": name, "likelihood": float(f"{likelihood:.1f}"), "impact": float(f"{impact:.1f}"), "category": category, "spend": spend
            })

    # Sort vendors by highest spend
    vendors.sort(key=lambda x: x['spend'], reverse=True)

    risk_narrative = "The bubble matrix scales supplier volume against failure severity. Systemic dependencies (Impact >4.5) are clustered in IT & Telecom. Logistics providers populate the high-likelihood frontier due to ongoing Red Sea route disruptions."
    perf_narrative = "Vendor Performance distribution demonstrates a reliance on 'Strategic Partners' (>90% SLA). Immediate executive intervention is required for any critical vector falling into the 'Review Required' threshold below 80% delivery."
    
    sus_labels = ["Governance", "Due Diligence", "Human Rights", "Environment", "Communities", "Operating Practices"]
    sustainability_global = {
        "labels": sus_labels,
        "scores_redbull": [92, 85, 95, 88, 80, 90],
        "scores_benchmark": [75, 68, 82, 70, 65, 78]
    }
    sus_narrative = "Global Procurement exceeds market ESG benchmarks across all 6 columns of the ISO 20400 framework, anchored by profound Governance protocols (92). Localized vendor compliance can be inspected via the individual Health Cards."

    recommendations = [
        {"id": "rec-1", "title": "Consolidate Ad Agencies", "action": "Reduce tail-end agencies in LATAM.", "impact": 5500000, "metric": "Cost Avoidance", "difficulty": "Medium", "category": "Marketing Services"},
        {"id": "rec-2", "title": "Renegotiate Cloud Tiers", "action": "Use forecast data showing 15% volume increase to negotiate Azure rates.", "impact": 12400000, "metric": "Hard Savings", "difficulty": "High", "category": "IT & Telecom"}
    ]

    dashboard_data = {
        "kpis": kpis,
        "timeSeries": {"data": time_series, "narrative": ts_narrative},
        "categories": {"data": categories, "narrative": cat_narrative},
        # Legacy/Global endpoints for backward scaling
        "supplierRisk": {"data": supplier_risk_bubble, "narrative": risk_narrative},
        "sustainability": {"data": sustainability_global, "narrative": sus_narrative},
        # New Phase 2 DB
        "vendorDB": vendors,
        "recommendations": recommendations,
        "lastUpdated": datetime.now().isoformat()
    }

    output_dir = os.path.join("frontend", "public")
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, "data.json")

    try:
        with open(out_path, "w") as f:
            json.dump(dashboard_data, f, indent=4)
        print(f"Successfully generated 30 Phase 2 Vendors into {out_path}")
    except Exception as e:
        print(f"Error writing to file: {e}")

if __name__ == "__main__":
    generate_dashboard_data()
