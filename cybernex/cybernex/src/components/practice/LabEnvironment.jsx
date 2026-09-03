import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { Server, Network, HardDrive, Cpu, MemoryStick, Power, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * LabEnvironment Component
 * Displays and controls the virtual lab environment
 *
 * @param {object} props - Component props
 * @param {string} props.environmentType - Type of environment (vm, container, cloud)
 * @param {string} props.status - Current environment status
 * @param {object} props.resources - Resource usage information
 * @param {function} props.onStart - Callback to start environment
 * @param {function} props.onStop - Callback to stop environment
 * @param {function} props.onRestart - Callback to restart environment
 * @param {boolean} props.isLoading - Whether environment operations are loading
 * @returns {JSX.Element} - Lab environment component
 */
const LabEnvironment = ({
  environmentType = 'vm',
  status = 'stopped',
  resources = { cpu: 0, memory: 0, disk: 0, network: 0 },
  onStart = () => {},
  onStop = () => {},
  onRestart = () => {},
  isLoading = false
}) => {
  const { isDarkMode } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Environment status colors
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Connection status colors
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Simulate connection monitoring
  useEffect(() => {
    if (status === 'running') {
      setConnectionStatus('connected');
      // Simulate time remaining for lab session
      const startTime = Date.now();
      const endTime = startTime + (2 * 60 * 60 * 1000); // 2 hours
      
      const timer = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setConnectionStatus('disconnected');
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setConnectionStatus('disconnected');
      setTimeRemaining(null);
    }
  }, [status]);

  const formatTimeRemaining = (ms) => {
    if (!ms) return '00:00:00';
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getEnvironmentIcon = () => {
    switch (environmentType) {
      case 'container': return <Network size={24} />;
      case 'cloud': return <Server size={24} />;
      case 'bare-metal': return <Cpu size={24} />;
      default: return <HardDrive size={24} />; // vm
    }
  };

  const handleStart = () => {
    onStart();
  };

  const handleStop = () => {
    onStop();
  };

  const handleRestart = () => {
    onRestart();
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lab Environment
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {environmentType.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getEnvironmentIcon()}
          </div>
        </div>

        {/* Status Display */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <Badge className={`text-white ${status === 'running' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : 'bg-gray-600'}`}>
                  {status}
                </Badge>
                <span className={`text-sm ${getConnectionStatusColor()}`}>
                  {connectionStatus}
                </span>
              </div>
            </div>
            
            {timeRemaining && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Time Remaining</p>
                <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
                  {formatTimeRemaining(timeRemaining)}
                </p>
              </div>
            )}
          </div>

          {/* Resource Usage */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <ResourceMeter
              icon={<Cpu size={16} />}
              label="CPU"
              value={resources.cpu}
              max={100}
              unit="%"
              dangerThreshold={90}
            />
            <ResourceMeter
              icon={<MemoryStick size={16} />}
              label="Memory"
              value={resources.memory}
              max={resources.memoryMax || 100}
              unit="%"
              dangerThreshold={90}
            />
            <ResourceMeter
              icon={<HardDrive size={16} />}
              label="Disk"
              value={resources.disk}
              max={resources.diskMax || 100}
              unit="%"
              dangerThreshold={95}
            />
            <ResourceMeter
              icon={<Network size={16} />}
              label="Network"
              value={resources.network}
              max={100}
              unit="%"
              dangerThreshold={80}
            />
          </div>
        </div>

        {/* Connection Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Connection Details</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">IP Address</span>
              <span className="font-mono text-gray-900 dark:text-white">192.168.1.100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Port</span>
              <span className="font-mono text-gray-900 dark:text-white">22</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Credentials</span>
              <span className="font-mono text-gray-900 dark:text-white">user:labuser</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex-1 flex items-end justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <>
              {status === 'running' ? (
                <>
                  <Button
                    variant="danger"
                    onClick={handleStop}
                    startIcon={<Power size={16} />}
                  >
                    Stop Environment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRestart}
                    startIcon={<RefreshCw size={16} />}
                  >
                    Restart
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleStart}
                  startIcon={<Power size={16} />}
                  disabled={isLoading}
                >
                  Start Environment
                </Button>
              )}
              
              {status === 'error' && (
                <Button
                  variant="outline"
                  startIcon={<AlertTriangle size={16} />}
                >
                  View Error
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

// Resource Meter Subcomponent
const ResourceMeter = ({ icon, label, value, max, unit, dangerThreshold }) => {
  const percentage = Math.min(100, (value / max) * 100);
  const isDanger = percentage >= dangerThreshold;
  const isWarning = percentage >= dangerThreshold * 0.8;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${
            isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
        {Math.round(value)} {unit}
      </p>
    </div>
  );
};

LabEnvironment.defaultProps = {
  environmentType: 'vm',
  status: 'stopped',
  resources: { cpu: 0, memory: 0, disk: 0, network: 0 },
  onStart: () => {},
  onStop: () => {},
  onRestart: () => {},
  isLoading: false
};

export default LabEnvironment;