import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import TaskListPage from "./pages/TaskListPage";
import { Navbar } from "./components/Navbar";
import CreateTaskPage from "./pages/CreateTaskPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/add" element={<CreateTaskPage />} />
          <Route path="/*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

