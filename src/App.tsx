import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <br /><br /><br />
        <nav className="bg-white-600 text-white p-5">
          <div className="container mx-auto flex justify-between items-center">
        
            
             <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src="LOGO.png"
                alt="cominQR Logo"
                className="h-20"
              />
            </div>           
          </div>
        </nav> 
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;