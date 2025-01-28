import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';


function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const generateQRData = () => {
    if (name && phone) {
      const firstName = name.split(' ')[0];
      const qrString = `${firstName.toUpperCase()}_${phone}`;
      setQrData(qrString);
    }
  };

  React.useEffect(() => {
    generateQRData();
  }, [name, phone]);

  const handleRegister = async () => {
    if (!name || !phone) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, qrData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage('Registration successful!');
      setIsRegistered(true);
    } catch (error) {
      setMessage(error.message || 'Error saving registration');
    }
  };


  const downloadQR = () => {
    const svgElement = document.querySelector('svg');
  
    if (!svgElement) {
      console.error('QR Code SVG not found!');
      return;
    }
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Canvas context not found!');
      return;
    }
  
    const padding = 20;
  
    const svgData = new XMLSerializer().serializeToString(svgElement);
  
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
  
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.drawImage(img, padding, padding);
  
      const pngFile = canvas.toDataURL('image/png');
  
      const downloadLink = document.createElement('a');
      downloadLink.download = `${qrData}_qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
  
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  return (
  <div>
    <br />
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg ">

      <h2 className="text-2xl font-bold mb-6" style={{fontFamily: ''}}>Register Here</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your phone number"
          />
        </div>

        {qrData && (
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG value={qrData} size={200} />
            <button
              onClick={handleRegister}
              disabled={isRegistered}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Register
            </button>
            {isRegistered && (
              <button
                onClick={downloadQR}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Download QR Code
              </button>
            )}
          </div>
        )}

        {message && (
          <div className={`text-center p-2 rounded ${
            message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Register;
