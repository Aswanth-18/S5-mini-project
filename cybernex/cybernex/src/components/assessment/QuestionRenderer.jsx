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

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = useCallback((newValue) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  const renderMultipleChoice = useCallback(() => {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const optionValue = option.value || option;
          const isSelected = selectedValue === optionValue;
          const isCorrectAnswer = showCorrectAnswer && question.correctAnswer === optionValue;

          let borderClass = 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700';
          if (isSelected) {
            borderClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
          } else if (showCorrectAnswer && isCorrectAnswer) {
            borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
          } else if (showCorrectAnswer && !isCorrectAnswer) {
            borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
          }

          let cursorClass = disabled || readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

          return (
            <button
              key={index}
              onClick={() => !disabled && !readOnly && handleChange(optionValue)}
              disabled={disabled || readOnly}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${borderClass} ${cursorClass}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
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

  const renderTrueFalse = useCallback(() => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { value: true, label: 'True' },
          { value: false, label: 'False' }
        ].map((option) => {
          const isSelected = selectedValue === option.value;
          const isCorrectAnswer = showCorrectAnswer && question.correctAnswer === option.value;

          let borderClass = 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700';
          if (isSelected) {
            borderClass = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
          } else if (showCorrectAnswer && isCorrectAnswer) {
            borderClass = 'border-emerald-300 bg-emerald-100 dark:bg-emerald-900/20';
          } else if (showCorrectAnswer && !isCorrectAnswer) {
            borderClass = 'border-red-300 bg-red-100 dark:bg-red-900/20';
          }

          let cursorClass = disabled || readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

          return (
            <button
              key={option.value ? 'true' : 'false'}
              onClick={() => !disabled && !readOnly && handleChange(option.value)}
              disabled={disabled || readOnly}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${borderClass} ${cursorClass}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`flex-1 ${isSelected || (showCorrectAnswer && isCorrectAnswer) ? 'font-bold' : ''}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer]);

  const renderShortAnswer = useCallback(() => {
    let inputBorderClass = 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    if (showCorrectAnswer) {
      inputBorderClass = isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    return (
      <div className="space-y-3">
        <input
          type="text"
          value={selectedValue || ''}
          onChange={(e) => !disabled && !readOnly && handleChange(e.target.value)}
          disabled={disabled || readOnly}
          placeholder="Enter your answer"
          className={`w-full p-4 rounded-lg border ${inputBorderClass}`}
        />
        {showCorrectAnswer && question.correctAnswer && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Correct answer: <span className="font-medium text-green-600 dark:text-green-400">{question.correctAnswer}</span>
            </p>
          </div>
        )}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer, isCorrect]);

  const renderFlagSubmission = useCallback(() => {
    let inputBorderClass = 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    if (showCorrectAnswer) {
      inputBorderClass = isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Flag className="w-5 h-5 text-blue-500" />
          <span className="text-gray-700 dark:text-gray-300">
            Flag format: CYBERNEX&#123;...&#125;
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-mono text-gray-400">CYBERNEX&#123;</span>
          <input
            type="text"
            value={selectedValue || ''}
            onChange={(e) => !disabled && !readOnly && handleChange(`CYBERNEX{${e.target.value}}`)}
            disabled={disabled || readOnly}
            placeholder="Enter flag here"
            className={`flex-1 p-3 rounded-lg border font-mono ${inputBorderClass}`}
          />
          <span className="text-2xl font-mono text-gray-400">&#125;</span>
        </div>
        {showCorrectAnswer && question.correctAnswer && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isCorrect ? 'Correct flag!' : 'Try again'}
            </p>
          </div>
        )}
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer, isCorrect]);

  const renderOrdering = useCallback(() => {
    const [orderedItems, setOrderedItems] = useState(
      question.options?.map((option, index) => ({
        value: option.value || option,
        label: option.label || option,
        order: index
      })) || []
    );

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

    const isOrderedCorrectly = showCorrectAnswer &&
      JSON.stringify(orderedItems.map(i => i.value)) === JSON.stringify(question.correctAnswer);

    let containerBorderClass = 'border-gray-300 dark:border-gray-600';
    if (showCorrectAnswer) {
      containerBorderClass = isOrderedCorrectly ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    let cursorClass = disabled || readOnly ? 'opacity-50 cursor-default' : 'cursor-grab active:cursor-grabbing';

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop to arrange in the correct order:
        </p>

        <div className="space-y-2">
          {orderedItems.map((item, index) => (
            <div
              key={item.value || index}
              draggable={!disabled && !readOnly}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${containerBorderClass} ${cursorClass}`}
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
              <span className="flex-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [question, selectedValue, disabled, readOnly, handleChange, showCorrectAnswer, isCorrect, isDarkMode]);

  switch (question.type) {
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      return renderMultipleChoice();
    case QUESTION_TYPES.MULTIPLE_SELECT:
      return renderMultipleChoice();
    case QUESTION_TYPES.TRUE_FALSE:
      return renderTrueFalse();
    case QUESTION_TYPES.SHORT_ANSWER:
      return renderShortAnswer();
    case QUESTION_TYPES.FLAG_SUBMISSION:
      return renderFlagSubmission();
    case QUESTION_TYPES.ORDERING:
      return renderOrdering();
    default:
      return renderMultipleChoice();
  }
};

export default QuestionRenderer;