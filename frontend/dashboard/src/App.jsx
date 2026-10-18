import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./landing/LandingPage";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import DVFSAnalysis from "./pages/research/DVFSAnalysis";
import QoSScheduling from "./pages/research/QoSScheduling";
import ClusterMarketplace from "./pages/research/ClusterMarketplace";
import EnterpriseOverview from "./pages/EnterpriseOverview";
import EnterpriseHealth from "./pages/EnterpriseHealth";
import WhatIf from "./pages/WhatIf";
import Inventory from "./pages/Inventory";
import Space from "./pages/Space";
import Power from "./pages/Power";
import Cooling from "./pages/Cooling";
import Connectivity from "./pages/Connectivity";
import Change from "./pages/Change";
import DataReports from "./pages/DataReports";

function DashboardLayout({ children }) {
  return (
    <div style={styles.appShell}>
      <TopBar />
      <div style={styles.body}>
        <Sidebar />
        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/research/dvfs" element={<DashboardLayout><DVFSAnalysis /></DashboardLayout>} />
        <Route path="/dashboard/research/qos" element={<DashboardLayout><QoSScheduling /></DashboardLayout>} />
        <Route path="/dashboard/research/marketplace" element={<DashboardLayout><ClusterMarketplace /></DashboardLayout>} />
        <Route path="/dashboard/overview" element={<DashboardLayout><EnterpriseOverview /></DashboardLayout>} />
        <Route path="/dashboard/health" element={<DashboardLayout><EnterpriseHealth /></DashboardLayout>} />
        <Route path="/dashboard/what-if" element={<DashboardLayout><WhatIf /></DashboardLayout>} />
        <Route path="/dashboard/inventory" element={<DashboardLayout><Inventory /></DashboardLayout>} />
        <Route path="/dashboard/space" element={<DashboardLayout><Space /></DashboardLayout>} />
        <Route path="/dashboard/power" element={<DashboardLayout><Power /></DashboardLayout>} />
        <Route path="/dashboard/cooling" element={<DashboardLayout><Cooling /></DashboardLayout>} />
        <Route path="/dashboard/connectivity" element={<DashboardLayout><Connectivity /></DashboardLayout>} />
        <Route path="/dashboard/change" element={<DashboardLayout><Change /></DashboardLayout>} />
        <Route path="/dashboard/reports" element={<DashboardLayout><DataReports /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  appShell: { minHeight: "100vh", background: "radial-gradient(ellipse at top, #0f1a14 0%, #0a0a0a 60%)" },
  body: { display: "flex" },
  main: { flex: 1, height: "100vh", overflow: "hidden" },
};

export default App;