import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCountdown } from '../../hooks/useCountdown';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AssessmentHeader from '../../components/assessment/AssessmentHeader.jsx';
import AssessmentTimer from '../../components/assessment/AssessmentTimer.jsx';
import AssessmentFooter from '../../components/assessment/AssessmentFooter.jsx';
import QuestionNavigation from '../../components/assessment/QuestionNavigation.jsx';
import QuestionRenderer from '../../components/assessment/QuestionRenderer.jsx';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Flag, 
  AlertCircle,
  ChevronLeft, 
  ChevronRight,
  PlayCircle,
  PauseCircle,
  Square,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';

const AssessmentTaking = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredAssessments, filteredResults, isLoading } = useData();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState({});

  // Get assessment details
  useEffect(() => {
    const foundAssessment = filteredAssessments.find(a => a.id === assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      
      // For demo purposes, use sample questions or generate questions from assessment data
      if (foundAssessment.questions && foundAssessment.questions.length > 0) {
        setQuestions(foundAssessment.questions);
      } else {
        // Generate sample questions based on assessment type
        const sampleQuestions = generateSampleQuestions(foundAssessment);
        setQuestions(sampleQuestions);
      }
      
      // Check if there's an existing in-progress result
      const existingResult = filteredResults.find(r => 
        r.studentId === user?.id && 
        r.assessmentId === assessmentId && 
        r.status === 'in-progress'
      );
      
      if (existingResult && existingResult.answers) {
        setAnswers(existingResult.answers);
        setSavedAnswers(existingResult.answers);
        if (existingResult.currentQuestion) {
          setCurrentQuestionIndex(existingResult.currentQuestion);
        }
      }
    } else {
      navigate('/student/assessments');
    }
  }, [assessmentId, filteredAssessments, filteredResults, user, navigate]);

  // Initialize countdown timer
  const assessmentDuration = assessment?.duration || 60; // in minutes
  const { 
    formattedTime, 
    isRunning, 
    start: startTimer, 
    pause: pauseTimer, 
    resume: resumeTimer 
  } = useCountdown(assessmentDuration * 60, false);

  // Start timer when assessment loads
  useEffect(() => {
    if (assessment && questions.length > 0) {
      startTimer();
    }
  }, [assessment, questions.length, startTimer]);

  // Handle pausing/unpausing
  useEffect(() => {
    if (isPaused) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  }, [isPaused, pauseTimer, resumeTimer]);

  // Save answers periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        setSavedAnswers(prev => ({ ...prev, ...answers }));
        // In a real app, save to localStorage or API
      }
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [answers]);

  const generateSampleQuestions = (assessment) => {
    const questionTypes = ['multiple-choice', 'true-false', 'short-answer', 'coding', 'practical'];
    const domains = assessment.domain ? [assessment.domain] : ['Web Security', 'Network Security', 'Linux', 'Windows'];
    
    const sampleQuestions = [];
    const totalQuestions = assessment.totalQuestions || 10;
    
    for (let i = 0; i < totalQuestions; i++) {
      const questionType = assessment.type === 'Practical' 
        ? 'practical' 
        : questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      const question = {
        id: `Q${i + 1}`,
        questionNumber: i + 1,
        text: generateQuestionText(questionType, domain, i + 1),
        type: questionType,
        points: assessment.pointsPerQuestion || 1,
        domain: domain,
        difficulty: assessment.difficulty || 'Medium',
        options: generateOptions(questionType),
        correctAnswer: generateCorrectAnswer(questionType),
        explanation: `This is the explanation for question ${i + 1}.`
      };
      
      if (questionType === 'practical') {
        question.scenario = `In this practical scenario, you need to ${generateScenarioText(domain)}.`;
        question.flag = `FLAG-${assessmentId}-Q${i + 1}`;
        question.hint = `Hint: Look for the ${generateHintText(domain)}.`;
      }
      
      sampleQuestions.push(question);
    }
    
    return sampleQuestions;
  };

  const generateQuestionText = (type, domain, number) => {
    const questionTemplates = {
      'multiple-choice': {
        'Web Security': `What is the most common vulnerability in web applications according to OWASP Top 10 (Question ${number})?`,
        'Network Security': `Which protocol is typically used to secure network communications (Question ${number})?`,
        'Linux': `Which command would you use to list all running processes in Linux (Question ${number})?`,
        'Windows': `What is the primary tool for managing Windows firewall settings (Question ${number})?`
      },
      'true-false': {
        'Web Security': `SQL Injection can be prevented by using prepared statements (Question ${number}).`,
        'Network Security': `A firewall can protect against all types of cyber attacks (Question ${number}).`,
        'Linux': `The 'root' user in Linux has the least privileges (Question ${number}).`,
        'Windows': `Windows Defender provides complete protection against all malware (Question ${number}).`
      },
      'short-answer': {
        'Web Security': `Explain what CSRF is and how it works (Question ${number}).`,
        'Network Security': `Describe the three-way handshake process in TCP (Question ${number}).`,
        'Linux': `What does the 'chmod' command do in Linux (Question ${number})?`,
        'Windows': `What is the purpose of Active Directory in Windows environments (Question ${number})?`
      },
      'coding': {
        'Web Security': `Write a Python script to detect SQL injection attempts (Question ${number}).`,
        'Network Security': `Create a Python script to scan open ports on a target host (Question ${number}).`,
        'Linux': `Write a bash script to automate system backups (Question ${number}).`,
        'Windows': `Create a PowerShell script to list all installed software (Question ${number}).`
      },
      'practical': {
        'Web Security': `Exploit the vulnerable web application to retrieve the hidden flag (Question ${number}).`,
        'Network Security': `Capture and analyze network traffic to find the flag (Question ${number}).`,
        'Linux': `Find and read the hidden file containing the flag (Question ${number}).`,
        'Windows': `Access the restricted directory to retrieve the flag (Question ${number}).`
      }
    };
    
    return questionTemplates[type]?.[domain] || `What is the answer to question ${number}?`;
  };

  const generateOptions = (type) => {
    if (type === 'multiple-choice') {
      return ['Option A', 'Option B', 'Option C', 'Option D'];
    }
    if (type === 'true-false') {
      return ['True', 'False'];
    }
    return [];
  };

  const generateCorrectAnswer = (type) => {
    if (type === 'multiple-choice') {
      return 'Option A';
    }
    if (type === 'true-false') {
      return 'True';
    }
    return 'Sample answer';
  };

  const generateScenarioText = (domain) => {
    const scenarios = {
      'Web Security': 'exploit a SQL injection vulnerability to access the database',
      'Network Security': 'perform a man-in-the-middle attack to intercept sensitive data',
      'Linux': 'escalate your privileges to gain root access',
      'Windows': 'exploit a misconfigured service to gain administrative access'
    };
    return scenarios[domain] || 'complete the security challenge';
  };

  const generateHintText = (domain) => {
    const hints = {
      'Web Security': 'SQL query structure',
      'Network Security': 'ARP spoofing technique',
      'Linux': 'SUID binaries',
      'Windows': 'Service permissions'
    };
    return hints[domain] || 'vulnerability in the system';
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFlagChange = (questionId, flag) => {
    setFlags(prev => ({
      ...prev,
      [questionId]: flag
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSave = () => {
    setSavedAnswers(prev => ({ ...prev, ...answers, ...flags }));
    // In a real app, save to API
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      // Calculate score
      let score = 0;
      let correct = 0;
      
      questions.forEach(question => {
        const userAnswer = answers[question.id] || flags[question.id];
        if (userAnswer && userAnswer === question.correctAnswer) {
          score += question.points;
          correct += 1;
        }
      });
      
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const percentage = Math.round((score / totalPoints) * 100);
      const status = percentage >= (assessment?.passingScore || 70) ? 'passed' : 'failed';
      
      // Create result
      const result = {
        id: `RESULT-${Date.now()}`,
        studentId: user.id,
        studentName: user.name,
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        score: score,
        totalPoints: totalPoints,
        percentage: percentage,
        status: status,
        timeSpent: assessmentDuration * 60 - parseTimeToSeconds(formattedTime),
        answers: { ...answers, ...flags },
        submittedAt: new Date().toISOString(),
        graded: true,
        published: true
      };
      
      // In a real app, you would save this result via API
      // For now, just navigate to results
      navigate(`/student/results`);
    }, 2000);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  const parseTimeToSeconds = (timeString) => {
    // Parse MM:SS or HH:MM:SS format
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  };

  const getAnswerStatus = (questionId) => {
    if (answers[questionId] || flags[questionId]) {
      return 'answered';
    }
    return 'unanswered';
  };

  const isQuestionAnswered = (questionId) => {
    return !!(answers[questionId] || flags[questionId]);
  };

  // Calculate progress
  const answeredCount = questions.filter(q => isQuestionAnswered(q.id)).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  if (isLoading || !assessment || questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <AssessmentHeader 
        assessment={assessment}
        showTimer
        timeLeft={formattedTime}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation (Sidebar) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Questions</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {answeredCount}/{questions.length} answered
              </div>
            </div>
            
            <QuestionNavigation
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onNavigate={goToQuestion}
              getAnswerStatus={getAnswerStatus}
            />

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress}% complete
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Timer and Controls */}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AssessmentTimer 
                  timeLeft={formattedTime} 
                  isRunning={isRunning}
                  onPause={handlePause}
                />
                <Badge className={`px-3 py-1 ${
                  progress >= 75 ? 'bg-green-100 text-green-800' :
                  progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Progress: {progress}%
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="outline" size="sm" startIcon={<Save size={14} />}>
                  Save
                </Button>
                <Button onClick={handlePause} variant="outline" size="sm" 
                  startIcon={isPaused ? <PlayCircle size={14} /> : <PauseCircle size={14} />}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={handleSubmit} variant="danger" size="sm" startIcon={<Square size={14} />}>
                  Submit
                </Button>
              </div>
            </div>
          </Card>

          {/* Question Area */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {currentQuestion.questionNumber} of {questions.length}
              </h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePrevious} 
                  disabled={currentQuestionIndex === 0}
                  variant="outline" 
                  size="sm"
                  startIcon={<ChevronLeft size={14} />}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={currentQuestionIndex === questions.length - 1}
                  variant="outline" 
                  size="sm"
                  endIcon={<ChevronRight size={14} />}
                >
                  Next
                </Button>
              </div>
            </div>

            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id] || flags[currentQuestion.id] || ''}
              onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              onFlagChange={(flag) => handleFlagChange(currentQuestion.id, flag)}
            />

            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Points: {currentQuestion.points}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePrevious} 
                  disabled={currentQuestionIndex === 0}
                  variant="outline" 
                  size="sm"
                  startIcon={<ChevronLeft size={14} />}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={currentQuestionIndex === questions.length - 1}
                  variant="outline" 
                  size="sm"
                  endIcon={<ChevronRight size={14} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>

          {/* Assessment Footer */}
          <AssessmentFooter
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Submission
              </h3>
              <button onClick={cancelSubmit} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You are about to submit your assessment. You have answered 
                <strong>{answeredCount} of {questions.length}</strong> questions.
              </p>
              
              {answeredCount < questions.length && (
                <p className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} className="inline mr-1 text-yellow-600" />
                  Warning: You have unanswered questions. You may want to review them before submitting.
                </p>
              )}
              
              <p className="text-gray-600 dark:text-gray-300">
                Once submitted, you may not be able to make changes.
              </p>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button onClick={cancelSubmit} variant="outline">
                Cancel
              </Button>
              <Button onClick={confirmSubmit} variant="danger" startIcon={<Square size={16} />}>
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
              Submitting your assessment...
            </p>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Assessment Paused
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Time remaining: {formattedTime}
            </p>
            <Button onClick={handlePause} variant="primary" startIcon={<PlayCircle size={16} />}>
              Resume Assessment
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssessmentTaking;