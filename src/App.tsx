import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ComponentDetailStub } from './pages/ComponentDetailStub';
import { ComponentCycleProvider } from './context/ComponentCycleContext';

function App() {
  return (
    <ComponentCycleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/components/:slug" element={<ComponentDetailStub />} />
          {/* Fallback to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </ComponentCycleProvider>
  );
}

export default App;

