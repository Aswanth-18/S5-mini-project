import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import { Server, Terminal, PlayCircle, Power, RefreshCw, ShieldCheck, Clock } from 'lucide-react';

/**
 * PracticalLab Component
 * Provides a practical lab environment for hands-on assessment questions
 */
const PracticalLab = ({
  labTitle = 'Practical Lab',
  description = 'Complete the hands-on exercise',
  environmentStatus = 'stopped', // stopped, starting, running, error
  connectionInfo = {},
  tasks = [],
  completedTasks = [],
  timeRemaining = null,
  onStartLab = () => {},
  onStopLab = () => {},
  onRestartLab = () => {},
  isLoading = false
}) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const getStatusColor = () => {
    switch (environmentStatus) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (environmentStatus) {
      case 'running': return 'Running';
      case 'starting': return 'Starting...';
      case 'stopping': return 'Stopping...';
      case 'error': return 'Error';
      default: return 'Not Started';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTask = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server size={24} className="text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{labTitle}</h2>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {getStatusText()}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">{description}</p>
        </div>

        {/* Connection Info */}
        {environmentStatus === 'running' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Terminal size={16} /> Connection Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-300">IP Address</p>
                <p className="font-mono font-medium text-gray-900 dark:text-white">
                  {connectionInfo.ip || '192.168.1.100'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Port</p>
                <p className="font-mono font-medium text-gray-900 dark:text-white">
                  {connectionInfo.port || '22'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Username</p>
                <p className="font-mono font-medium text-gray-900 dark:text-white">
                  {connectionInfo.username || 'labuser'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Password</p>
                <p className="font-mono font-medium text-gray-900 dark:text-white">
                  {connectionInfo.password ? '••••••••' : 'provided'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="flex-1 space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Terminal size={48} className="mx-auto mb-4 opacity-50" />
              <p>No tasks available for this lab</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => {
                const isCompleted = isTaskCompleted(task.id);
                const isExpanded = expandedTask === task.id;

                return (
                  <div
                    key={task.id}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                  >
                    <div
                      className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between ${isCompleted ? 'opacity-60' : ''}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                          {isCompleted ? <CheckCircle size={14} /> : task.number}
                        </div>
                        <div className="min-w-0">
                          <h5 className={`font-medium truncate ${isCompleted ? 'line-through' : ''}`}>
                            {task.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {task.description || ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <ShieldCheck size={16} className="text-green-600" />
                        ) : (
                          isExpanded ? <RefreshCw size={16} /> : <PlayCircle size={16} />
                        )}
                        {isExpanded ? <RefreshCw size={16} /> : null}
                      </div>
                    </div>

                    {isExpanded && !isCompleted && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{task.details}</p>
                        {task.command && (
                          <div className="p-2 bg-gray-900 rounded text-green-400 font-mono text-xs">
                            <span className="text-gray-500">$ </span>{task.command}
                          </div>
                        )}
                        {task.verification && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              Verification: {task.verification}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Time and Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span className={`font-mono ${timeRemaining <= 60 ? 'text-red-600 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                  Time: {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
              {completedTasks.length}/{tasks.length} tasks completed
            </Badge>
          </div>

          <div className="flex gap-2">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : environmentStatus === 'running' ? (
              <>
                <Button variant="outline" onClick={onRestartLab} startIcon={<RefreshCw size={14} />}>
                  Restart
                </Button>
                <Button variant="danger" onClick={onStopLab} startIcon={<Power size={14} />}>
                  Stop Lab
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                onClick={onStartLab} 
                startIcon={<PlayCircle size={14} />}
              >
                Start Lab
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

PracticalLab.defaultProps = {
  labTitle: 'Practical Lab',
  description: 'Complete the hands-on exercise',
  environmentStatus: 'stopped',
  connectionInfo: {},
  tasks: [],
  completedTasks: [],
  timeRemaining: null,
  onStartLab: () => {},
  onStopLab: () => {},
  onRestartLab: () => {},
  isLoading: false
};

export default PracticalLab;