import { Navigate, Route, Routes } from "react-router-dom";

import HistoryPage from "./pages/HistoryPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="მთავარი" />} />
        <Route path="/მთავარი" element={<MainPage />} />
        <Route path="/ისტორია" element={<HistoryPage />} />
      </Routes>
    </>
  );
}

export default App;
