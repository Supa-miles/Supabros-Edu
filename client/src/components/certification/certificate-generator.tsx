import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Calendar, CheckCircle, Share2 } from "lucide-react";
import { type Certificate, type Course } from "@shared/schema";

interface CertificateGeneratorProps {
  certificate: Certificate;
  course: Course;
  userName?: string;
}

export default function CertificateGenerator({ certificate, course, userName = "Student Name" }: CertificateGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // In a real implementation, you'd use html2canvas + jsPDF
      // For now, we'll simulate the download
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1200;
      canvas.height = 800;
      
      if (ctx) {
        // Create certificate background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = course.color || '#3b82f6';
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // Add inner border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
        
        // Certificate title
        ctx.fillStyle = course.color || '#3b82f6';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);
        
        // Course title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(course.title, canvas.width / 2, 220);
        
        // Awarded to
        ctx.fillStyle = '#6b7280';
        ctx.font = '24px Arial';
        ctx.fillText('This certificate is awarded to', canvas.width / 2, 300);
        
        // Student name
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 42px Arial';
        ctx.fillText(userName, canvas.width / 2, 360);
        
        // Achievement text
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px Arial';
        ctx.fillText('for successfully completing the professional certification program', canvas.width / 2, 420);
        
        // Score and date
        ctx.fillStyle = course.color || '#3b82f6';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Score: ${certificate.score}%`, canvas.width / 2 - 150, 500);
        ctx.fillText(`Date: ${new Date(certificate.issuedAt || Date.now()).toLocaleDateString()}`, canvas.width / 2 + 150, 500);
        
        // Certificate number
        ctx.fillStyle = '#9ca3af';
        ctx.font = '16px Arial';
        ctx.fillText(`Certificate #: ${certificate.certificateNumber}`, canvas.width / 2, 580);
        
        // Organization
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('SupaBros Education', canvas.width / 2, 660);
        
        // Download the image
        const link = document.createElement('a');
        link.download = `${course.title.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
      
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${course.title} Certificate - SupaBros Edu`,
      text: `I just earned a certificate in ${course.title} with a score of ${certificate.score}%!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Certificate details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Award className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Congratulations! 🎉
        </h1>
        <p className="text-lg text-gray-600">
          You've successfully earned your certificate in {course.title}
        </p>
      </div>

      {/* Certificate Preview */}
      <Card className="mb-6 overflow-hidden">
        <div 
          ref={certificateRef}
          className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-12"
          style={{ aspectRatio: '3/2' }}
        >
          {/* Decorative border */}
          <div 
            className="absolute inset-4 border-4 rounded-lg"
            style={{ borderColor: course.color || '#3b82f6' }}
          >
            <div className="absolute inset-2 border border-gray-200 rounded-lg"></div>
          </div>
          
          {/* Certificate content */}
          <div className="relative z-10 text-center h-full flex flex-col justify-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 
                className="text-4xl font-bold tracking-wider"
                style={{ color: course.color || '#3b82f6' }}
              >
                CERTIFICATE OF COMPLETION
              </h2>
              <div className="h-1 w-24 mx-auto bg-gray-300 rounded"></div>
            </div>
            
            {/* Course title */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {course.title}
              </h3>
              {course.level && (
                <Badge variant="secondary" className="text-sm">
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)} Level
                </Badge>
              )}
            </div>
            
            {/* Awarded to */}
            <div className="space-y-2">
              <p className="text-lg text-gray-600">
                This certificate is proudly awarded to
              </p>
              <p className="text-3xl font-bold text-gray-900 underline decoration-2 underline-offset-4">
                {userName}
              </p>
            </div>
            
            {/* Achievement description */}
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-700 leading-relaxed">
                for successfully completing the professional certification program 
                and demonstrating mastery of {course.title.toLowerCase()} concepts, 
                best practices, and industry-standard techniques.
              </p>
            </div>
            
            {/* Score and details */}
            <div className="flex justify-center space-x-12 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-xl" style={{ color: course.color || '#3b82f6' }}>
                    {certificate.score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">Final Score</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-xl text-gray-800">
                    {new Date(certificate.issuedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Date Issued</p>
              </div>
              
              {course.duration && (
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="font-bold text-xl text-gray-800">
                      {course.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Course Duration</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="space-y-4 pt-4">
              <div className="border-t border-gray-300 pt-4">
                <h4 className="text-xl font-bold text-gray-800">
                  SupaBros Education
                </h4>
                <p className="text-sm text-gray-600">
                  Professional Skills Development Platform
                </p>
              </div>
              
              <div className="text-xs text-gray-500">
                Certificate #{certificate.certificateNumber} | Verify at supabrosedu.com
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div 
            className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: course.color || '#3b82f6' }}
          ></div>
          <div 
            className="absolute bottom-8 right-8 w-12 h-12 rounded-full opacity-10"
            style={{ backgroundColor: course.color || '#3b82f6' }}
          ></div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center space-x-2"
          data-testid="button-download-certificate"
        >
          <Download className="h-5 w-5" />
          <span>{isDownloading ? "Generating..." : "Download Certificate"}</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex items-center space-x-2"
          data-testid="button-share-certificate"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Achievement</span>
        </Button>
      </div>

      {/* Certificate Details */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Certificate Details</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Course</label>
                <p className="text-gray-900">{course.title}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Level</label>
                <p className="text-gray-900 capitalize">{course.level || 'Professional'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Duration</label>
                <p className="text-gray-900">{course.duration || 'Self-paced'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Final Score</label>
                <p className="text-gray-900 font-semibold">{certificate.score}%</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Issue Date</label>
                <p className="text-gray-900">
                  {new Date(certificate.issuedAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Certificate Number</label>
                <p className="text-gray-900 font-mono">{certificate.certificateNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Skills Gained</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              {course.description} This certification validates your expertise and 
              professional competency in this field.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}