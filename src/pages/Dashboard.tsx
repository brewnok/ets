import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface RegistrationData {
  id: number;
  name: string;
  phone: string;
  qr_data: string;
  created_at: string;
}

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registeredData, setRegisteredData] = useState<RegistrationData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`);
      const data = await response.json();
      setRegisteredData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleDelete = async (qrData: string) => {
    try {
      await fetch(`http://localhost:3000/api/registrations/${encodeURIComponent(qrData)}`, {
        method: 'DELETE',
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // @ts-ignore
    doc.autoTable({
      head: [['Name', 'Phone', 'QR Data', 'Created At']],
      body: registeredData.map(entry => [
        entry.name,
        entry.phone,
        entry.qr_data,
        new Date(entry.created_at).toLocaleString()
      ]),
    });

    doc.save('registration-records.pdf');
  };

  if (!isLoggedIn) {
    return (
      <div>
        <br />
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
      </div>
    );
  }

  return (
    <div>
      <br />
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registration Records</h2>
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Download Records
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registeredData.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.qr_data}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(entry.qr_data)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;