import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LabProgress from '../../components/practice/LabProgress';
import LabTerminal from '../../components/practice/LabTerminal';
import LabInstructions from '../../components/practice/LabInstructions';
import TaskList from '../../components/practice/TaskList';
import HintSystem from '../../components/practice/HintSystem';
import FlagChecker from '../../components/practice/FlagChecker';
import { 
  Shield, 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Award, 
  Terminal, 
  FileText, 
  ListCheck, 
  Lightbulb, 
  Flag, 
  ArrowLeft, 
  ArrowRight,
  X,
  CheckSquare,
  Square
} from 'lucide-react';

const PracticeLabDetail = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredLabs, filteredCourses, filteredLessons, isLoading } = useData();
  const [lab, setLab] = useState(null);
  const [activeTab, setActiveTab] = useState('instructions');
  const [labProgress, setLabProgress] = useState(0);
  const [completionStatus, setCompletionStatus] = useState('not-started');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [flagInput, setFlagInput] = useState('');
  const [flagCheckResult, setFlagCheckResult] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Find the lab
    const foundLab = filteredLabs.find(l => l.id === labId);
    if (foundLab) {
      setLab(foundLab);
      
      // Check user's progress with this lab
      const userLabs = user?.progress?.labs || {};
      if (userLabs.completed?.includes(labId)) {
        setCompletionStatus('completed');
        setLabProgress(100);
      } else if (userLabs.inProgress?.includes(labId)) {
        setCompletionStatus('in-progress');
        setLabProgress(userLabs.progress?.[labId] || 50);
      }
      
      // Set tasks from lab data
      setTasks(foundLab.tasks || [
        { id: 1, title: 'Understand the lab objectives', description: 'Read through the lab instructions carefully', completed: false },
        { id: 2, title: 'Set up the environment', description: 'Configure the lab environment as described', completed: false },
        { id: 3, title: 'Complete the main challenge', description: 'Solve the primary security challenge', completed: false },
        { id: 4, title: 'Submit the flag', description: 'Capture and submit the flag to complete the lab', completed: false }
      ]);
    } else {
      // Lab not found, redirect to practice labs page
      navigate('/student/practice');
    }
  }, [labId, filteredLabs, user, navigate]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startLab = () => {
    setIsRunning(true);
    setCompletionStatus('in-progress');
    // In a real app, update user's progress
  };

  const completeLab = () => {
    setIsRunning(false);
    setCompletionStatus('completed');
    setLabProgress(100);
    setTasks(tasks.map(task => ({ ...task, completed: true })));
    // In a real app, update user's progress and award XP
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
    
    // Update lab progress based on completed tasks
    const newCompletedTasks = completedTasks.includes(taskId) 
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    const progress = Math.round((newCompletedTasks.length / tasks.length) * 100);
    setLabProgress(progress);
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      // In a real app, you might track hint usage
    }
  };

  const checkFlag = () => {
    // In a real app, this would check the flag against the correct answer
    if (flagInput === lab?.flag) {
      setFlagCheckResult({ success: true, message: 'Correct! Flag accepted.' });
      // Complete the flag task
      const flagTask = tasks.find(t => t.title.toLowerCase().includes('flag'));
      if (flagTask && !completedTasks.includes(flagTask.id)) {
        toggleTask(flagTask.id);
      }
    } else {
      setFlagCheckResult({ success: false, message: 'Incorrect flag. Try again!' });
    }
    
    // Clear after 5 seconds
    setTimeout(() => setFlagCheckResult(null), 5000);
  };

  const executeCommand = (command) => {
    if (!isRunning && completionStatus !== 'in-progress') {
      setTerminalOutput(prev => [...prev, { type: 'error', content: 'Please start the lab first' }]);
      return;
    }
    
    setTerminalInput('');
    
    // Simulate command execution
    setTerminalOutput(prev => [
      ...prev,
      { type: 'command', content: `$ ${command}` },
      { type: 'output', content: `Executing: ${command}` },
      { type: 'output', content: 'Command executed successfully' }
    ]);
  };

  const getStatusBadge = () => {
    const statusLabels = {
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: PlayCircle },
      'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800', icon: Shield }
    };
    const status = statusLabels[completionStatus] || statusLabels['not-started'];
    const Icon = status.icon;
    return (
      <Badge className={`px-3 py-1 ${status.color} flex items-center gap-1`}>
        <Icon size={14} /> {status.label}
      </Badge>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const difficultyColors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Easy': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result = [];
    if (hrs > 0) result.push(`${hrs}h`);
    if (mins > 0) result.push(`${mins}m`);
    result.push(`${secs}s`);
    return result.join(' ');
  };

  if (isLoading || !lab) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Find related course
  const relatedCourse = lab.courseId ? filteredCourses.find(c => c.id === lab.courseId) : null;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Link to="/student/practice" className="hover:text-primary transition-colors">
          Practice Labs
        </Link>
        <ArrowRight size={14} />
        <span className="text-gray-900 dark:text-white font-medium">{lab.title}</span>
      </div>

      {/* Lab Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{lab.title}</h1>
              <p className="text-lg opacity-90 max-w-2xl">{lab.description}</p>
              
              <div className="flex gap-4 mt-6">
                {getStatusBadge()}
                <Badge className={`px-3 py-1 ${getDifficultyColor(lab.difficulty)}`}>
                  {lab.difficulty || 'Medium'}
                </Badge>
                <Badge className="px-3 py-1 bg-white/20 text-white">
                  {lab.domain}
                </Badge>
                {lab.featured && (
                  <Badge className="px-3 py-1 bg-yellow-400 text-yellow-900">
                    Featured
                  </Badge>
                )}
                {lab.popular && (
                  <Badge className="px-3 py-1 bg-purple-400 text-purple-900">
                    Popular
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-6 mt-4 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> Estimated: {lab.estimatedTime || '30'} minutes
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} /> {lab.xp || 50} XP
                </div>
                {completionStatus === 'in-progress' && (
                  <div className="flex items-center gap-2">
                    <Terminal size={16} /> {formatTime(timeSpent)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {completionStatus === 'not-started' ? (
                <Button onClick={startLab} variant="white" startIcon={<PlayCircle size={16} />}>
                  Start Lab
                </Button>
              ) : completionStatus === 'in-progress' ? (
                <Button onClick={completeLab} variant="white" startIcon={<CheckCircle size={16} />}>
                  Complete Lab
                </Button>
              ) : (
                <Button variant="outline-white" startIcon={<CheckCircle size={16} />}>
                  Lab Completed
                </Button>
              )}
              
              <Link to="/student/practice">
                <Button variant="outline-white" startIcon={<ArrowLeft size={16} />}>
                  Back to Labs
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] bg-cover bg-center"></div>
        </div>
      </div>

      {/* Progress Bar */}
      {completionStatus !== 'not-started' && (
        <Card>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Lab Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Complete all tasks to finish the lab
              </p>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {labProgress}%
            </div>
          </div>
          <ProgressBar value={labProgress} max={100} className="mt-2 h-3" />
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Card>
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <button
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'instructions' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'terminal' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'tasks' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Tasks ({completedTasks.length}/{tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  activeTab === 'hints' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Hints <Badge className="bg-red-500 text-white text-xs">{hintsUsed}/3</Badge>
              </button>
              <button
                onClick={() => setActiveTab('flag')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'flag' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'
                }`}
              >
                Submit Flag
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'instructions' && (
              <LabInstructions 
                instructions={lab.instructions || 'Complete the lab objectives as described. Follow the tasks in order and use the terminal to execute commands. Submit the flag when you are done.'}
                objectives={lab.objectives || ['Understand the security challenge', 'Use appropriate tools and techniques', 'Capture the flag']}
              />
            )}

            {activeTab === 'terminal' && (
              <LabTerminal
                input={terminalInput}
                onInputChange={setTerminalInput}
                onSubmit={executeCommand}
                output={terminalOutput}
                isRunning={isRunning && completionStatus === 'in-progress'}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskList
                tasks={tasks.map(task => ({
                  ...task,
                  completed: completedTasks.includes(task.id)
                }))}
                onToggleTask={toggleTask}
              />
            )}

            {activeTab === 'hints' && (
              <HintSystem
                hints={lab.hints || [
                  'Hint 1: Start by understanding the lab objectives and requirements.',
                  'Hint 2: Look for common patterns or vulnerabilities in the given scenario.',
                  'Hint 3: Use the available tools and commands to explore the environment.'
                ]}
                hintsUsed={hintsUsed}
                onUseHint={useHint}
                maxHints={3}
              />
            )}

            {activeTab === 'flag' && (
              <FlagChecker
                value={flagInput}
                onChange={setFlagInput}
                onSubmit={checkFlag}
                result={flagCheckResult}
                isCompleted={completionStatus === 'completed'}
              />
            )}
          </Card>

          {/* Lab Notes */}
          {completionStatus === 'in-progress' && (
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lab Notes</h3>
              <textarea
                placeholder="Take notes as you work through the lab..."
                rows={4}
                className="textarea textarea-primary w-full"
              />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Lab Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lab Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lab.type || 'Practical Lab'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lab.domain}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lab.estimatedTime || '30'} minutes
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lab.xp || 50} XP
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ListCheck size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {tasks.length} tasks
                </span>
              </div>
            </div>
          </Card>

          {/* Related Course */}
          {relatedCourse && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Course</h3>
              <Link to={`/student/learning/${relatedCourse.id}`} className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{relatedCourse.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{relatedCourse.domain}</p>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {/* Requirements */}
          {lab.requirements && lab.requirements.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
              <ul className="space-y-3">
                {lab.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Resources */}
          {lab.resources && lab.resources.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <div className="space-y-3">
                {lab.resources.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FileText size={18} className="text-gray-500" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{resource.type}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-500" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Lab Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            <div className="space-y-3">
              {completionStatus === 'not-started' ? (
                <Button onClick={startLab} variant="primary" className="w-full" startIcon={<PlayCircle size={16} />}>
                  Start Lab
                </Button>
              ) : completionStatus === 'in-progress' ? (
                <>
                  <Button onClick={completeLab} variant="primary" className="w-full" startIcon={<CheckCircle size={16} />}>
                    Complete Lab
                  </Button>
                  <Button variant="outline" className="w-full" startIcon={<X size={16} />}>
                    Reset Lab
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="w-full" startIcon={<CheckCircle size={16} />}>
                  Review Lab
                </Button>
              )}
              
              <Link to="/student/practice">
                <Button variant="outline" className="w-full" startIcon={<ArrowLeft size={16} />}>
                  Back to Labs
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Tips */}
      {completionStatus !== 'completed' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Take Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use the notes section to keep track of your findings and commands.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Use Hints Wisely</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Each hint reduces your final score. Try to solve challenges independently.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Check All Tasks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Make sure to complete all tasks before submitting your flag.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PracticeLabDetail;