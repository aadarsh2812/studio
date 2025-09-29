'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Link2Off } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarDeviceStatusProps {
  isConnected: boolean;
  onConnect?: () => void;
}

export default function SidebarDeviceStatus({ 
  isConnected: initialConnected, 
  onConnect 
}: SidebarDeviceStatusProps) {
  const [isConnected, setIsConnected] = useState(initialConnected);
  
  // Listen for global device status changes
  useEffect(() => {
    const handleGlobalStatusChange = (event: CustomEvent) => {
      const { connected } = event.detail;
      setIsConnected(connected);
    };
    
    window.addEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    };
  }, []);
  
  // Update when prop changes
  useEffect(() => {
    setIsConnected(initialConnected);
  }, [initialConnected]);
  
  const handleConnectClick = () => {
    if (!isConnected && onConnect) {
      onConnect();
      // Also dispatch global event
      window.dispatchEvent(new CustomEvent('global-device-status-change', { 
        detail: { connected: true }
      }));
    }
  };
  
  return (
    <div className="px-2 py-3">
      <motion.div
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
          isConnected 
            ? "bg-green-500/10 text-green-500" 
            : "bg-red-500/10 text-red-500 cursor-pointer"
        )}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        onClick={!isConnected ? handleConnectClick : undefined}
      >
        {isConnected ? (
          <>
            <Link className="h-4 w-4" />
            <span>Device Connected</span>
          </>
        ) : (
          <>
            <Link2Off className="h-4 w-4" />
            <span>Device Not Connected</span>
          </>
        )}
      </motion.div>
    </div>
  );
}