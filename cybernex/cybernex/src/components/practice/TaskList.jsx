import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { CheckSquare, Square, ChevronDown, ChevronUp, Target, Clock, Flag } from 'lucide-react';

/**
 * TaskList Component
 * Displays a list of tasks for a practice lab with completion tracking
 *
 * @param {object} props - Component props
 * @param {Array} props.tasks - Array of task objects
 * @param {boolean} props.showProgress - Whether to show overall progress
 * @param {function} props.onTaskToggle - Callback when task is toggled
 * @param {function} props.onTaskSelect - Callback when task is selected
 * @param {string} props.selectedTaskId - ID of currently selected task
 * @returns {JSX.Element} - Task list component
 */
const TaskList = ({
  tasks = [],
  showProgress = true,
  onTaskToggle = () => {},
  onTaskSelect = () => {},
  selectedTaskId = null
}) => {
  const { isDarkMode } = useTheme();
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTask = (taskId) => {
    onTaskToggle(taskId);
  };

  const selectTask = (taskId) => {
    onTaskSelect(taskId);
  };

  const toggleTaskExpand = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Calculate progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const hasSubtasks = (task) => {
    return task.subtasks && task.subtasks.length > 0;
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header with Progress */}
      {showProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lab Tasks
            </h3>
            <div className="flex items-center gap-4">
              <Badge className={getTaskStatusColor('completed')}>
                {completedTasks}/{totalTasks} Completed
              </Badge>
            </div>
          </div>
          <ProgressBar 
            value={progressPercentage} 
            max={100}
            className="h-2"
          />
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No tasks available for this lab</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = selectedTaskId === task.id;
            const isCompleted = task.status === 'completed';
            const hasChildren = hasSubtasks(task);
            const isExpanded = expandedTasks[task.id] || false;

            return (
              <div
                key={task.id}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* Main Task */}
                <div
                  className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between ${isCompleted ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                  onClick={() => selectTask(task.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className="flex-shrink-0"
                    >
                      {isCompleted ? (
                        <CheckSquare size={18} className="text-green-600" />
                      ) : (
                        <Square size={18} className="text-gray-400 hover:text-blue-600" />
                      )}
                    </button>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {task.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {task.points && `${task.points} points`}
                        {task.estimatedTime && ` • ${task.estimatedTime} min`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasChildren && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskExpand(task.id);
                        }}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <Flag size={16} className="text-green-600" />
                    )}
                  </div>
                </div>

                {/* Subtasks */}
                {hasChildren && isExpanded && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 space-y-1">
                    {task.subtasks.map((subtask, subtaskIndex) => {
                      const subtaskId = `${task.id}-${subtaskIndex}`;
                      const isSubtaskCompleted = subtask.status === 'completed';

                      return (
                        <div
                          key={subtaskId}
                          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTask(subtaskId);
                            }}
                            className="flex-shrink-0"
                          >
                            {isSubtaskCompleted ? (
                              <CheckSquare size={16} className="text-green-600" />
                            ) : (
                              <Square size={16} className="text-gray-400 hover:text-blue-600" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${isSubtaskCompleted ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                              {subtask.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

TaskList.defaultProps = {
  tasks: [],
  showProgress: true,
  onTaskToggle: () => {},
  onTaskSelect: () => {},
  selectedTaskId: null
};

export default TaskList;