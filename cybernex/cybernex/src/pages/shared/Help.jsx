import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Search, BookOpen, MessageCircle, Phone, HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';

const Help = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const helpCategories = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'platform', label: 'Platform Features', icon: HelpCircle },
    { id: 'assessments', label: 'Assessments', icon: MessageCircle },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Phone }
  ];

  const faqs = [
    {
      category: 'getting-started',
      questions: [
        {
          question: 'How do I get started with CyberNex?',
          answer: 'To get started, log in with your credentials or use one of our demo accounts (Admin, Faculty, or Student). Once logged in, you will see a personalized dashboard based on your role. Students can access courses and practice labs, while faculty and admin users have additional management features.'
        },
        {
          question: 'How do I navigate between different sections?',
          answer: 'Use the sidebar navigation to move between different sections of the platform. The sidebar contains quick links to your dashboard, courses, practice labs, assessments, and other features based on your user role.'
        },
        {
          question: 'Can I change my role to see different features?',
          answer: 'No, your role is assigned by the system administrator. However, you can use the demo login buttons on the login page to experience the platform from different roles (Admin, Faculty, or Student) for demonstration purposes.'
        }
      ]
    },
    {
      category: 'platform',
      questions: [
        {
          question: 'What are the different user roles?',
          answer: 'CyberNex has three main user roles: Student - can access courses, practice labs, and assessments; Faculty - can create and manage courses, labs, and assessments, view student progress; Admin - has full access to all platform features including user management, system settings, and advanced administrative functions.'
        },
        {
          question: 'How does the security scoring system work?',
          answer: 'Your security score is calculated based on your performance across various cybersecurity domains. Completing practice labs, passing assessments, and demonstrating mastery of security concepts will increase your score. The score is displayed as a percentage and updated in real-time.'
        },
        {
          question: 'Can I customize my dashboard?',
          answer: 'Yes, you can customize certain aspects of your dashboard through the Settings page. You can change themes, notification preferences, and other personal settings.'
        }
      ]
    },
    {
      category: 'assessments',
      questions: [
        {
          question: 'How do practice assessments work?',
          answer: 'Practice assessments are timed tests that evaluate your knowledge and skills in various cybersecurity domains. Each assessment contains multiple-choice questions, practical scenarios, and hands-on challenges. Your results are automatically graded and used to track your progress.'
        },
        {
          question: 'What happens if I fail an assessment?',
          answer: 'If you fail an assessment, you can retake it after a cooling period. The system will provide detailed feedback on your performance, highlighting areas that need improvement. You can review the assessment results and try again when you are ready.'
        },
        {
          question: 'Are there time limits for assessments?',
          answer: 'Yes, most assessments have time limits that vary depending on the complexity and scope of the test. The time limit is displayed at the beginning of each assessment and a countdown timer is shown during the test.'
        }
      ]
    },
    {
      category: 'troubleshooting',
      questions: [
        {
          question: 'I cannot log in. What should I do?',
          answer: 'First, double-check your email and password. Make sure you are using the correct credentials. If you still cannot log in, try using the "Forgot Password" feature or contact your system administrator for assistance.'
        },
        {
          question: 'My practice lab environment is not loading. How do I fix it?',
          answer: 'Practice labs require a stable internet connection and may take a few moments to load. Try refreshing the page or checking your internet connection. If the issue persists, clear your browser cache or try using a different browser.'
        },
        {
          question: 'How do I report a bug or technical issue?',
          answer: 'If you encounter any bugs or technical issues, please use the contact form on the Help page or reach out to your system administrator. Include as much detail as possible about the issue, including steps to reproduce it and any error messages you received.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help via email from our support team',
      action: 'support@cybernex.edu',
      icon: Mail
    },
    {
      title: 'Live Chat',
      description: 'Chat with a support agent in real-time',
      action: 'Start Chat',
      icon: MessageCircle
    },
    {
      title: 'Phone Support',
      description: 'Speak with a support representative by phone',
      action: '+1 (555) 123-4567',
      icon: Phone
    }
  ];

  const toggleFaq = (category, index) => {
    if (activeFaq === `${category}-${index}`) {
      setActiveFaq(null);
    } else {
      setActiveFaq(`${category}-${index}`);
    }
  };

  const filteredFaqs = faqs.find(f => f.category === activeCategory)?.questions || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-primary w-full pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Help Categories</h3>
            <nav className="space-y-2">
              {helpCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <category.icon size={20} />
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          {/* Quick Links */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>User Guide</span>
                <ChevronDown size={16} />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>Video Tutorials</span>
                <ChevronDown size={16} />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>API Documentation</span>
                <ChevronDown size={16} />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <span>System Requirements</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </Card>
        </div>

        {/* Main Content - FAQs */}
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {helpCategories.find(c => c.id === activeCategory)?.label || 'Getting Started'}
              </p>

              {filteredFaqs.length > 0 ? (
                <div className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-2 last:pb-0">
                      <button
                        onClick={() => toggleFaq(activeCategory, index)}
                        className="w-full flex items-center justify-between py-3 text-left"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                        {activeFaq === `${activeCategory}-${index}` ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      {activeFaq === `${activeCategory}-${index}` && (
                        <div className="pb-4 text-sm text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No FAQs found for this category.</p>
              )}
            </div>
          </Card>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center">
                <div className="flex flex-col items-center">
                  <method.icon size={32} className="mb-4 text-primary" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{method.description}</p>
                  {method.title === 'Email Support' ? (
                    <Button variant="outline" size="sm">
                      <a href={`mailto:${method.action}`} className="text-primary">{method.action}</a>
                    </Button>
                  ) : method.title === 'Phone Support' ? (
                    <Button variant="outline" size="sm">
                      <a href={`tel:${method.action}`} className="text-primary">{method.action}</a>
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm">{method.action}</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpen size={24} className="mx-auto mb-2 text-blue-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Documentation</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive guides and references</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <HelpCircle size={24} className="mx-auto mb-2 text-green-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Community Forums</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Get help from other users</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MessageCircle size={24} className="mx-auto mb-2 text-purple-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">Feature Requests</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Suggest new features and improvements</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Phone size={24} className="mx-auto mb-2 text-orange-600" />
            <h4 className="font-medium text-gray-900 dark:text-white">System Status</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Check platform status and updates</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Help;