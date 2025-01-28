import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  React.useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);
    console.log("CAMERA");
    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify/${encodeURIComponent(decodedText)}`);
      const data = await response.json();
      setIsValid(data.isValid);
    } catch (error) {
      console.error('Error verifying QR code:', error);
      setIsValid(false);
    }
  };

  const onScanError = (error: any) => {
    console.warn(error);
  };

  return (
    <div>
      <br />
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Scan QR Code</h2>
      
      <div id="reader" className="mb-4"></div>

      {scanResult && (
        <div className={`mt-4 p-4 rounded-md ${
          isValid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <p className="text-lg font-semibold">
            {isValid ? 'ENTRY GRANTED' : 'ENTRY REJECTED'}
          </p>
          <p className="text-sm mt-2">Scanned data: {scanResult}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Scanner;