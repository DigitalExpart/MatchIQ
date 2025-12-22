import { motion } from 'motion/react';
import { Camera, ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '../../ui/button';
import { useState } from 'react';

interface ScanPassportScreenProps {
  onScanSuccess: (data: string) => void;
  onBack: () => void;
}

export function ScanPassportScreen({ onScanSuccess, onBack }: ScanPassportScreenProps) {
  const [isScanning, setIsScanning] = useState(false);

  // Simulate QR scan for demo
  const handleStartScan = () => {
    setIsScanning(true);
    // In a real implementation, this would use the device camera
    // For demo, we'll simulate a successful scan after 2 seconds
    setTimeout(() => {
      onScanSuccess('demo-passport-token-12345');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 mb-3">Scan Compatibility Passport</h1>
            <p className="text-slate-600">Position the QR code within the frame</p>
          </div>

          {/* Scanner Window */}
          <div className="relative mb-8">
            <div className="aspect-square bg-slate-900 rounded-3xl overflow-hidden relative">
              {!isScanning ? (
                /* Placeholder camera view */
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 text-sm">Camera inactive</p>
                  </div>
                </div>
              ) : (
                /* Scanning animation */
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <motion.div
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-center"
                  >
                    <QrCode className="w-24 h-24 text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Scanning...</p>
                  </motion.div>
                </div>
              )}

              {/* Scanning frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-purple-500 rounded-3xl relative">
                  {/* Corner decorations */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-pink-500 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-pink-500 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-pink-500 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-pink-500 rounded-br-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6">
            <h4 className="text-slate-800 mb-4">Instructions</h4>
            <ul className="space-y-3 text-slate-600 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-purple-600">1.</span>
                <span>Ask the person to open their Compatibility Passport QR</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600">2.</span>
                <span>Position their QR code within the scanning frame</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600">3.</span>
                <span>Hold steady until the scan completes</span>
              </li>
            </ul>
          </div>

          {/* Start Scan Button */}
          {!isScanning && (
            <Button
              onClick={handleStartScan}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
