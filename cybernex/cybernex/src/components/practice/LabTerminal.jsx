import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { Terminal, Copy, X, PlayCircle, StopCircle, ChevronDown } from 'lucide-react';

/**
 * LabTerminal Component
 * Interactive terminal emulator for practice labs
 *
 * @param {object} props - Component props
 * @param {string} props.initialCommand - Initial command to display
 * @param {Array} props.commands - Array of command objects with input/output
 * @param {boolean} props.readOnly - Whether terminal is read-only
 * @param {boolean} props.showHeader - Whether to show terminal header
 * @param {string} props.title - Terminal title
 * @param {function} props.onCommandSubmit - Callback when command is submitted
 * @returns {JSX.Element} - Terminal component
 */
const LabTerminal = ({
  initialCommand = '',
  commands = [],
  readOnly = false,
  showHeader = true,
  title = 'CyberNex Terminal',
  onCommandSubmit = () => {}
}) => {
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [terminalLines, setTerminalLines] = useState([
    { type: 'prompt', content: initialCommand || 'cybernex@lab:~$ ' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const terminalRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Pre-populate with commands
  useEffect(() => {
    if (commands.length > 0) {
      const newLines = [];
      commands.forEach((cmd, index) => {
        newLines.push({ type: 'prompt', content: `${cmd.user}@lab:~$ ${cmd.command}` });
        if (cmd.output) {
          newLines.push({ type: 'output', content: cmd.output });
        }
        if (index < commands.length - 1) {
          newLines.push({ type: 'prompt', content: `${cmd.user}@lab:~$ ` });
        }
      });
      setTerminalLines(newLines);
    }
  }, [commands]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Handle arrow up/down for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSubmit();
    }
  };

  const handleCommandSubmit = () => {
    if (inputValue.trim() === '') return;

    const currentPrompt = getCurrentPrompt();
    const command = inputValue.trim();
    
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Update terminal lines
    setTerminalLines(prev => [
      ...prev.slice(0, -1), // Remove current prompt
      { type: 'prompt', content: `${currentPrompt}${command}` },
      { type: 'prompt', content: `${currentPrompt}` } // Add new prompt
    ]);

    // Call callback
    onCommandSubmit(command);
    setInputValue('');
  };

  const getCurrentPrompt = () => {
    const lastPrompt = terminalLines.findLast(line => line.type === 'prompt');
    return lastPrompt ? lastPrompt.content : 'cybernex@lab:~$ ';
  };

  const clearTerminal = () => {
    setTerminalLines([{ type: 'prompt', content: 'cybernex@lab:~$ ' }]);
    setInputValue('');
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  const copyToClipboard = async () => {
    const terminalText = terminalLines
      .map(line => line.content)
      .join('\n');
    try {
      await navigator.clipboard.writeText(terminalText);
      // Could add notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPromptSymbol = () => {
    if (isRunning) {
      return '...';
    }
    return '$';
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Terminal Header */}
      {showHeader && (
        <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 rounded-t-lg p-3 text-white">
          <div className="flex items-center gap-2">
            <Terminal size={16} />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTerminal}
              className="text-gray-400 hover:text-white"
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto p-4 rounded-b-lg"
      >
        {terminalLines.map((line, index) => (
          <div key={index} className={line.type === 'prompt' ? 'flex' : ''}>
            {line.type === 'prompt' ? (
              <span className="text-green-400">{line.content}</span>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {line.content.split('\n').map((text, i) => (
                  <React.Fragment key={i}>
                    {text}
                    {i < line.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      {!readOnly && (
        <div className="border-t border-gray-700 p-2 bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono">cybernex@lab:~{getPromptSymbol()}</span>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white font-mono outline-none"
              placeholder="Type command here..."
              disabled={isRunning}
              autoComplete="off"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

LabTerminal.defaultProps = {
  initialCommand: '',
  commands: [],
  readOnly: false,
  showHeader: true,
  title: 'CyberNex Terminal',
  onCommandSubmit: () => {}
};

export default LabTerminal;