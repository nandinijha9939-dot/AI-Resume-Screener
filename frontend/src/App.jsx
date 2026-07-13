import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import UploadResume from "./pages/UploadResume";
import UploadJob from "./pages/UploadJob";  // ← ADD THIS
import CandidateDetails from "./pages/CandidateDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/upload-job" element={<UploadJob />} />  {/* ← ADD THIS */}
        <Route path="/candidate/:id" element={<CandidateDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;