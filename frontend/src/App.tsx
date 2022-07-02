import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import { NavBar } from './components/navbar/NavBar';
import { FacultyProfilePage } from './pages/Faculty/FacultyProfile/FacultyProfilePage';
import { NetworksPage } from './pages/Faculty/Networks/NetworksPage';
import { RegionalDevelopmentPage } from './pages/Metrics/RegionalDevelopment/RegionalDevelopmentPage';
import { ResearchCostPage } from './pages/Metrics/ResearchCost/ResearchCost';
import { UtilizationPage } from './pages/Metrics/Utilization/UtilizationPage';
import { AbstractClassificationPage } from './pages/Research/AbstractClassification/AbstractClassificationPage';
import { PatentsPage } from './pages/Research/Patents/PatentsPage';
import { ResearchRelevancePage } from './pages/Research/ResearchRelevance/ResearchRelevance';

function App() {
    return (
        <div className="main-app-component">
            <BrowserRouter>
                <div className="navbar">
                    <NavBar></NavBar>
                </div>
                <Routes>
                    <Route path="research">
                        <Route
                            path="abstract-analysis"
                            element={<AbstractClassificationPage />}
                        ></Route>
                        <Route
                            path="research-relevance"
                            element={<ResearchRelevancePage />}
                        ></Route>
                        <Route path="patents" element={<PatentsPage />}></Route>
                    </Route>
                    <Route path="collaboration">
                        <Route
                            path="profile"
                            element={<FacultyProfilePage />}
                        />
                        <Route path="coauthorship" element={<NetworksPage />} />
                    </Route>
                    <Route path="metrics">
                        <Route
                            path="research-cost"
                            element={<ResearchCostPage />}
                        />
                        <Route
                            path="utilization"
                            element={<UtilizationPage />}
                        />
                        <Route
                            path="regional-development"
                            element={<RegionalDevelopmentPage />}
                        />
                    </Route>
                    <Route
                        path="/*"
                        element={<Navigate to="research/research-relevance" />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
