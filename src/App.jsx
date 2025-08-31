import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Account from "./pages/Account";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
