import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { BookOpen, PlayCircle, PauseCircle, ArrowRight, ArrowLeft, Volume2, VolumeX, ExternalLink } from 'lucide-react';

/**
 * LessonViewer Component
 * Displays lesson content with rich text, embedded media, and navigation
 */
const LessonViewer = ({
  title = 'Lesson Title',
  content = '',
  type = 'text', // text, video, interactive
  videoUrl = '',
  duration = 0,
  currentTime = 0,
  isPlaying = false,
  hasPrevious = false,
  hasNext = false,
  onPrevious = () => {},
  onNext = () => {},
  onTogglePlay = () => {},
  onExternalLinkClick = () => {}
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {type === 'video' ? (
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-video bg-black flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">Video Player</p>
                  <p className="text-sm text-gray-400">{videoUrl || 'No video source'}</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="p-3 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={onTogglePlay} className="text-white">
                    {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                  </Button>
                  
                  <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  
                  <ProgressBar value={progressPercentage} max={100} className="flex-1 h-1" />
                  
                  <Button variant="ghost" onClick={() => setIsMuted(!isMuted)} className="text-white">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content || '<p>Lesson content goes here.</p>' }} />
            </div>
          )}
        </div>

        {/* External Links Section */}
        {type === 'interactive' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              External Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Lab Environment', 'Documentation', 'Additional Materials'].map((resource, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  startIcon={<ExternalLink size={14} />}
                  onClick={onExternalLinkClick}
                >
                  {resource}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              disabled={!hasPrevious}
              startIcon={<ArrowLeft size={16} />}
            >
              Previous
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <ProgressBar value={progressPercentage} max={100} className="w-48 h-2" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              onClick={onNext}
              disabled={!hasNext}
              endIcon={<ArrowRight size={16} />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

LessonViewer.defaultProps = {
  title: 'Lesson Title',
  content: '',
  type: 'text',
  videoUrl: '',
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  hasPrevious: false,
  hasNext: false,
  onPrevious: () => {},
  onNext: () => {},
  onTogglePlay: () => {},
  onExternalLinkClick: () => {}
};

export default LessonViewer;