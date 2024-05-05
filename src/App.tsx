import './App.css';
import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import TaskList from './components/TaskList';

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/tasks" element={<TaskList />} />
    <Route path='/*' element={<Navigate to='/tasks' replace />} />
  </Routes>
  </Router>
  );
}

export default App;
