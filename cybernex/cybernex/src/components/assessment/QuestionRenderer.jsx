import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { QUESTION_TYPES } from '../../utils/constants';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  FileText,
  Code,
  Terminal,
  ListOrdered,
  CheckSquare,
  Square,
  Type,
  Flag
} from 'lucide-react';

/**
 * Question Renderer component for displaying different question types
 *
 * @param {object} props - Component props
 * @param {object} props.question - Question object
 * @param {any} props.value - Current selected value
 * @param {function} props.onChange - Function to call when answer changes
 * @param {boolean} props.disabled - Whether question is disabled
 * @param {boolean} props.readOnly - Whether question is read-only
 * @param {boolean} props.showCorrectAnswer - Whether to show correct answer
 * @param {boolean} props.isCorrect - Whether the answer is correct
 * @param {number} props.questionNumber - Question number
 * @param {number} props.totalQuestions - Total number of questions
 * @param {function} props.onHint - Function to call when hint is requested
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Question Renderer component
 */
const QuestionRenderer = ({
  question,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  showCorrectAnswer = false,
  isCorrect,
  questionNumber = 1,
  totalQuestions = 1,
  onHint,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [showHint, setShowHint] = useState(false);

  // Update local state when value prop changes
  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  // Handle value changes
  const handleChange = useCallback((newValue) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  // Get icon for question type
  const getTypeIcon = useCallback(() => {
    switch (question.type) {
      case QUESTION_types.MULTIPLE_CHOICE:
        return CheckCircle;
      case QUESTION_TYPES.MULTIPLE_SELECT:
        return CheckSquare;
      case QUESTION_TYPES.TRUE_FALSE:
        return Type;
      case QUESTION_TYPES.SHORT_ANSWER:
        return FileText;
      case QUESTION_TYPES.FLAG_SUBMISSION:
        return Flag;
      case QUESTION_TYPES.ORDERING:
        return ListOrdered;
      case QUESTION_TYPES.SCENARIO_DECISION:
        return HelpCircle;
      case QUESTION_TYPES.LOG_ANALYSIS:
        return Code;
      default:
        return FileText;
    }
  }, [question.type]);

  // Get answer status color
  const getAnswerStatus = useCallback(() => {
    if (showCorrectAnswer) {
      if (isCorrect) return 'success';
      if (value && value !== '') return 'danger';
    }
    return selectedValue && selectedValue !== '' ? 'primary' : 'gray';
  }, [showCorrectAnswer, isCorrect, value, selectedValue]);

  // Render Multiple Choice question
  const renderMultipleChoice = useCallback(() => {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const optionValue = option.value || option;
          const isSelected = selectedValue === optionValue;
          const isCorrectAnswer = showCorrectAnswer && question.correctAnswer === optionValue;

          return (
            <button
              key={index}
              onClick={() => !disabled && !readOnly && handleChange(optionValue)}
              disabled={disabled || readOnly}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all
                \${
                  isSelected
                    ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20 \${
                      showCorrectAnswer
                        ? isCorrectAnswer
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : ''
                    }`
                    : `border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 \${
                      showCorrectAnswer && isCorrectAnswer
                        ? 'border-emerald-300 bg-emerald-100 dark:bg-emerald-900/20'
                        : ''
                    }`
                }
                \${
                  disabled || readOnly
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }
              `}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                \${isSelected
                  ? 'border-blue-500 bg-blue-500'
                  : showCorrectAnswer && isCorrectAnswer
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
                {showCorrectAnswer && !isSelected && isCorrectAnswer && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className={`flex-1 ${isSelected || (showCorrectAnswer && isCorrectAnswer) ? 'font-medium' : ''}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer]);

  // Render Multiple Select question
  const renderMultipleSelect = useCallback(() => {
    const selectedValues = Array.isArray(selectedValue) ? selectedValue : [];
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const optionValue = option.value || option;
          const isSelected = selectedValues.includes(optionValue);
          const isCorrectAnswer = showCorrectAnswer &&
            (Array.isArray(question.correctAnswer)
              ? question.correctAnswer.includes(optionValue)
              : question.correctAnswer === optionValue);

          return (
            <button
              key={index}
              onClick={() => {
                if (disabled || readOnly) return;

                const newSelected = isSelected
                  ? selectedValues.filter(v => v !== optionValue)
                  : [...selectedValues, optionValue];

                handleChange(newSelected);
              }}
              disabled={disabled || readOnly}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all
                \${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : `border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 \${
                      showCorrectAnswer && isCorrectAnswer
                        ? 'border-emerald-300 bg-emerald-100 dark:bg-emerald-900/20'
                        : ''
                    }`
                }
                \${
                  disabled || readOnly
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }
              `}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                \${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : showCorrectAnswer && isCorrectAnswer
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
                {showCorrectAnswer && !isSelected && isCorrectAnswer && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className={`flex-1 ${isSelected || (showCorrectAnswer && isCorrectAnswer) ? 'font-medium' : ''}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer]);

  // Render True/False question
  const renderTrueFalse = useCallback(() => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { value: true, label: 'True' },
          { value: false, label: 'False' }
        ].map((option) => {
          const isSelected = selectedValue === option.value;
          const isCorrectAnswer = showCorrectAnswer && question.correctAnswer === option.value;

          return (
            <button
              key={option.value ? 'true' : 'false'}
              onClick={() => !disabled && !readOnly && handleChange(option.value)}
              disabled={disabled || readOnly}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                \${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : `border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 \${
                      showCorrectAnswer && isCorrectAnswer
                        ? 'border-emerald-300 bg-emerald-100 dark:bg-emerald-900/20'
                        : ''
                    }`
                }
                \${
                  disabled || readOnly
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }
              `}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                \${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : showCorrectAnswer && isCorrectAnswer
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
                {showCorrectAnswer && !isSelected && isCorrectAnswer && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className={`font-medium ${isSelected || (showCorrectAnswer && isCorrectAnswer) ? 'font-bold' : ''}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer]);

  // Render Short Answer question
  const renderShortAnswer = useCallback(() => {
    return (
      <div className="space-y-3">
        <textarea
          value={selectedValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled || readOnly}
          placeholder="Enter your answer..."
          rows={4}
          className={`w-full p-4 rounded-lg border \${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } \${
            showCorrectAnswer
              ? isCorrect
                ? 'border-emerald-500'
                : 'border-red-500'
              : selectedValue
                ? 'border-blue-500'
                : 'border-gray-300 dark:border-gray-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />

        {showCorrectAnswer && !isCorrect && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Correct answer:</strong> {question.correctAnswer}
            </p>
          </div>
        )}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer, isCorrect, isDarkMode]);

  // Render Flag Submission question
  const renderFlagSubmission = useCallback(() => {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Flag className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">
            Flag format: CYBERNEX{{...}}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-mono text-gray-400">CYBERNEX{</span>
          <input
            type="text"
            value={selectedValue || ''}
            onChange={(e) => handleChange(`CYBERNEX{${e.target.value}}`)}
            disabled={disabled || readOnly}
            placeholder="Enter flag here"
            className={`flex-1 p-3 rounded-lg border font-mono \${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } \${
              showCorrectAnswer
                ? isCorrect
                  ? 'border-emerald-500'
                  : 'border-red-500'
                : selectedValue
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          <span className="text-2xl font-mono text-gray-400">}</span>
        </div>

        {showCorrectAnswer && !isCorrect && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Correct flag:</strong> {question.correctAnswer}
            </p>
          </div>
        )}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer, isCorrect, isDarkMode]);

  // Render Ordering question
  const renderOrdering = useCallback(() => {
    const [orderedItems, setOrderedItems] = useState(
      question.options?.map((option, index) => ({
        value: option.value || option,
        label: option.label || option,
        order: index
      })) || []
    );

    // Handle drag and drop
    const handleDragStart = (e, index) => {
      e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
    };

    const handleDrop = (e, index) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const newOrderedItems = [...orderedItems];
      const [removed] = newOrderedItems.splice(fromIndex, 1);
      newOrderedItems.splice(index, 0, removed);
      setOrderedItems(newOrderedItems);
      handleChange(newOrderedItems.map(item => item.value));
    };

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop to arrange in the correct order:
        </p>

        <div className="space-y-2">
          {orderedItems.map((item, index) => {
            const isCorrect = showCorrectAnswer &&
              JSON.stringify(orderedItems.map(i => i.value)) ===
              JSON.stringify(question.correctAnswer);

            return (
              <div
                key={item.value || index}
                draggable={!disabled && !readOnly}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors
                  \${
                    showCorrectAnswer
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                  \${disabled || readOnly ? 'opacity-50 cursor-default' : 'cursor-grab active:cursor-grabbing'}
                `}
              >
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill