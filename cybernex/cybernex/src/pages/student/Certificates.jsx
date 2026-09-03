import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Award, FileText, Calendar, Download, Eye, ShieldCheck } from 'lucide-react';

const Certificates = () => {
  const { user } = useAuth();
  const { courses, results, isLoading } = useData();
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    courseCompletions: 0,
    domainMasteries: 0,
    achievementAwards: 0
  });

  useEffect(() => {
    if (user && courses.length > 0 && results.length > 0) {
      // Generate certificates based on user achievements
      const userCertificates = [];
      
      // Course completion certificates
      if (user.certificates) {
        userCertificates.push(...user.certificates);
      }
      
      // Generate course completion certificates
      const completedCourses = user.progress?.courses?.completed || [];
      completedCourses.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (course) {
          userCertificates.push({
            id: `CERT-COURSE-${courseId}`,
            type: 'course_completion',
            title: `${course.code} - Course Completion`,
            name: course.title,
            issuedDate: user.progress?.courses?.completionDates?.[courseId] || new Date().toISOString(),
            expirationDate: null,
            description: `Certificate of completion for ${course.title}`,
            courseId: course.id,
            courseCode: course.code,
            domain: course.domain,
            credits: course.credits || 3,
            grade: user.progress?.courses?.grades?.[courseId] || 'A',
            status: 'active'
          });
        }
      });
      
      // Generate domain mastery certificates
      const domainScores = user.domainScores || {};
      Object.entries(domainScores).forEach(([domain, score]) => {
        if (score >= 80) {
          userCertificates.push({
            id: `CERT-DOMAIN-${domain}`,
            type: 'domain_mastery',
            title: `${domain} Mastery`,
            name: domain,
            issuedDate: new Date().toISOString(),
            expirationDate: null,
            description: `Mastery certificate for ${domain} with ${score}% proficiency`,
            score: score,
            status: 'active'
          });
        }
      });
      
      // Generate achievement awards
      if (user.achievements && user.achievements.length > 0) {
        user.achievements.forEach(achievement => {
          userCertificates.push({
            id: `CERT-ACHIEVEMENT-${achievement.id}`,
            type: 'achievement',
            title: achievement.title,
            name: achievement.name,
            issuedDate: achievement.issuedAt || new Date().toISOString(),
            expirationDate: null,
            description: achievement.description,
            achievementType: achievement.type,
            status: 'active'
          });
        });
      }
      
      setCertificates(userCertificates);
      
      // Calculate stats
      const courseCompletions = userCertificates.filter(c => c.type === 'course_completion').length;
      const domainMasteries = userCertificates.filter(c => c.type === 'domain_mastery').length;
      const achievementAwards = userCertificates.filter(c => c.type === 'achievement').length;
      
      setStats({
        total: userCertificates.length,
        courseCompletions,
        domainMasteries,
        achievementAwards
      });
    }
  }, [user, courses, results]);

  const getCertificateColor = (type) => {
    switch (type) {
      case 'course_completion':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'domain_mastery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificateIcon = (type) => {
    switch (type) {
      case 'course_completion':
        return <Certificate size={24} className="text-blue-600" />;
      case 'domain_mastery':
        return <ShieldCheck size={24} className="text-purple-600" />;
      case 'achievement':
        return <Award size={24} className="text-yellow-600" />;
      default:
        return <FileText size={24} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadCertificate = (certificate) => {
    // This would generate and download a PDF certificate in a real implementation
    console.log('Downloading certificate:', certificate.id);
    // For demo purposes, we'll simulate the download
    const blob = new Blob([
      `Certificate: ${certificate.title}\n` +
      `Issued to: ${user.name}\n` +
      `Date: ${formatDate(certificate.issuedDate)}\n` +
      `Description: ${certificate.description}`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certificate.title.replace(/\s+/g, '_')}_${user.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewCertificate = (certificate) => {
    // This would open a modal or page to view the certificate
    console.log('Viewing certificate:', certificate.id);
    alert(`Viewing certificate: ${certificate.title}\nIssued to: ${user.name}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Certificates
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Certificates
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Certificate size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.courseCompletions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Course Completions
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.domainMasteries}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Domain Masteries
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.achievementAwards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Achievements
            </div>
          </div>
        </Card>
      </div>

      {/* Certificate List */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Certificates
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {certificates.length} certificates
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No certificates earned yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete courses and achieve milestones to earn certificates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((certificate) => (
              <div 
                key={certificate.id} 
                className={`p-4 rounded-lg border-2 ${getCertificateColor(certificate.type)} dark:border-opacity-20`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getCertificateIcon(certificate.type)}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {certificate.title}
                      </h4>
                      <Badge variant={certificate.type} className="mt-1">
                        {certificate.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Issued: {formatDate(certificate.issuedDate)}
                    </span>
                  </div>
                  
                  {certificate.expirationDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Expires: {formatDate(certificate.expirationDate)}
                      </span>
                    </div>
                  )}
                  
                  {certificate.courseCode && (
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Course: {certificate.courseCode}
                      </span>
                    </div>
                  )}
                  
                  {certificate.score && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Score: {certificate.score}%
                      </span>
                    </div>
                  )}
                  
                  {certificate.credits && (
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Credits: {certificate.credits}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 mb-4">
                  {certificate.description}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewCertificate(certificate)}
                    startIcon={<Eye size={14} />}
                  >
                    View
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleDownloadCertificate(certificate)}
                    startIcon={<Download size={14} />}
                  >
                    Download
                  </Button>
                </div>
                
                {certificate.status === 'expired' && (
                  <div className="mt-2">
                    <Badge variant="danger">Expired</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Certificate Types Filter */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Certificate Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Certificate size={32} className="mx-auto mb-2 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Course Completion
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Awarded upon successful completion of courses
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <ShieldCheck size={32} className="mx-auto mb-2 text-purple-600" />
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
              Domain Mastery
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Awarded for achieving 80%+ proficiency in a domain
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Award size={32} className="mx-auto mb-2 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Achievement Awards
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Special awards for outstanding performance
            </p>
          </div>
        </div>
      </Card>

      {/* Share Certificates */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Share Your Achievements
        </h3>
        <div className="flex items-center justify-center h-32 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <Award size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              Share your certificates on social media or with employers
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Certificates;