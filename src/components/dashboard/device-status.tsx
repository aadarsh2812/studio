'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Link2Off, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';

interface DeviceStatusProps {
  className?: string;
  initialStatus?: boolean;
  // For demo purposes, we'll toggle the status automatically
  autoToggle?: boolean;
  onConnectionChange?: (isConnected: boolean) => void;
}

export default function DeviceStatus({
  className,
  initialStatus = false,
  autoToggle = false,
  onConnectionChange,
}: DeviceStatusProps) {
  // Always initialize as disconnected regardless of initialStatus prop
  const [isConnected, setIsConnected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showingPastData, setShowingPastData] = useState(false);

  // For demo purposes, toggle the connection status every 5 seconds
  useEffect(() => {
    if (!autoToggle) return;
    
    const interval = setInterval(() => {
      const newStatus = !isConnected;
      setIsConnected(newStatus);
      
      if (onConnectionChange) {
        onConnectionChange(newStatus);
      }
      
      // Dispatch global event to synchronize all status indicators
      window.dispatchEvent(new CustomEvent('global-device-status-change', { 
        detail: { connected: newStatus }
      }));
      
      if (!newStatus) {
        setShowDialog(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoToggle, isConnected, onConnectionChange]);
  
  // Listen for global device status changes
  useEffect(() => {
    const handleGlobalStatusChange = (event: CustomEvent) => {
      const { connected } = event.detail;
      setIsConnected(connected);
      
      if (onConnectionChange) {
        onConnectionChange(connected);
      }
    };
    
    window.addEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    };
  }, [onConnectionChange]);

  const handleConnect = () => {
    setIsConnected(true);
    setShowDialog(false);
    setShowingPastData(false);
    if (onConnectionChange) {
      onConnectionChange(true);
    }
    
    // Dispatch global event to synchronize all status indicators
    window.dispatchEvent(new CustomEvent('global-device-status-change', { 
      detail: { connected: true }
    }));
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowDialog(false);
    if (onConnectionChange) {
      onConnectionChange(false);
    }
    
    // Dispatch global event to synchronize all status indicators
    window.dispatchEvent(new CustomEvent('global-device-status-change', { 
      detail: { connected: false }
    }));
  };

  const handleViewPastData = () => {
    setShowDialog(false);
    setShowingPastData(true);
    // Dispatch an event to show past data
    window.dispatchEvent(new CustomEvent('show-past-data', { detail: { showPastData: true } }));
    
    // If connected, disconnect when viewing past data
    if (isConnected) {
      setIsConnected(false);
      if (onConnectionChange) {
        onConnectionChange(false);
      }
      
      // Dispatch global event to synchronize all status indicators
      window.dispatchEvent(new CustomEvent('global-device-status-change', { 
        detail: { connected: false }
      }));
    }
  };

  return (
    <>
      <div className={cn("flex items-center justify-between p-4 rounded-lg", className)}>
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="connected"
              className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full w-full cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setShowDialog(true)}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Device Connected</span>
              <Link className="h-5 w-5 ml-auto cursor-pointer" />
            </motion.div>
          ) : (
            <motion.div
              key="disconnected"
              className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-full w-full cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowDialog(true)}
            >
              <Link2Off className="h-5 w-5" />
              <span className="font-medium">Device Not Connected</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isConnected ? 'Device Options' : 'Device Not Connected'}</DialogTitle>
            <DialogDescription>
              {isConnected
                ? 'The device is connected. You can view past data or disconnect.'
                : 'Device not connected. Would you like to connect or view past data?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            {isConnected ? (
              <>
                <Button variant="outline" onClick={handleViewPastData}>
                  View Past Data
                </Button>
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleViewPastData}>
                  View Past Data
                </Button>
                <Button onClick={handleConnect}>
                  Connect Device
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}