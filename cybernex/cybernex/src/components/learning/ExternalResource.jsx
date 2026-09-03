import React from 'react';
import { ExternalLink, BookOpen, FileText, PlayCircle, Download, Star } from 'lucide-react';

/**
 * ExternalResource Component
 * Displays external learning resources with type indicators and quick access
 */
const ExternalResource = ({
  url = '#',
  title = 'External Resource',
  type = 'article',
  description = 'Resource description',
  author = '',
  date = '',
  rating = 0,
  onClick = () => {}
}) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClick();
  };

  const getTypeConfig = () => {
    const configs = {
      video: { icon: <PlayCircle size={20} />, color: 'text-red-600', label: 'Video' },
      article: { icon: <BookOpen size={20} />, color: 'text-blue-600', label: 'Article' },
      document: { icon: <FileText size={20} />, color: 'text-green-600', label: 'Document' },
      download: { icon: <Download size={20} />, color: 'text-purple-600', label: 'Download' },
      course: { icon: <BookOpen size={20} />, color: 'text-indigo-600', label: 'Course' }
    };
    return configs[type.toLowerCase()] || configs.document;
  };

  const typeConfig = getTypeConfig();

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors`}>
          <span className={typeConfig.color}>{typeConfig.icon}</span>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
              {title}
            </h4>
            <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className={typeConfig.color}>{typeConfig.label}</span>
              {author && <span>{author}</span>}
              {date && <span>{new Date(date).toLocaleDateString()}</span>}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ExternalResource.defaultProps = {
  url: '#',
  title: 'External Resource',
  type: 'article',
  description: 'Resource description',
  author: '',
  date: '',
  rating: 0,
  onClick: () => {}
};

export default ExternalResource;