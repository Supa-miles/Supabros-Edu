import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Clock, Users, TrendingUp, CheckCircle, Star, Globe, Shield, Cloud, Brain, Wifi } from "lucide-react";
import { type Course } from "@shared/schema";

export default function CertificationPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        // Filter only certification courses
        const certificationCourses = data.filter((course: Course) => 
          ['cybersecurity', 'cloud', 'networking', 'marketing', 'ai-ml', 'iot-robotics'].includes(course.category)
        );
        setCourses(certificationCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cybersecurity': return Shield;
      case 'cloud': return Cloud;
      case 'networking': return Globe;
      case 'marketing': return TrendingUp;
      case 'ai-ml': return Brain;
      case 'iot-robotics': return Wifi;
      default: return BookOpen;
    }
  };

  const getCategoryStats = (category: string) => {
    const coursesInCategory = courses.filter(course => course.category === category);
    return {
      total: coursesInCategory.length,
      professional: coursesInCategory.filter(course => course.level === 'professional').length,
      advanced: coursesInCategory.filter(course => course.level === 'advanced').length,
      intermediate: coursesInCategory.filter(course => course.level === 'intermediate').length,
    };
  };

  const certificationCategories = [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      description: 'Professional security certifications covering ethical hacking, network security, and incident response',
      color: '#DC143C',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      description: 'AWS, Azure, and Google Cloud certifications for modern cloud architecture',
      color: '#FF9900',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    },
    {
      id: 'networking',
      title: 'Networking',
      description: 'Cisco CCNA, CompTIA Network+, and wireless networking certifications',
      color: '#1BA0D7',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'marketing',
      title: 'Digital Marketing',
      description: 'Google Ads, SEO, and social media marketing professional certifications',
      color: '#FF6B35',
      bgGradient: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200'
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Professional ML engineering, deep learning, and AI prompt engineering',
      color: '#9C27B0',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      id: 'iot-robotics',
      title: 'IoT & Robotics',
      description: 'Internet of Things systems and robotics engineering certifications',
      color: '#607D8B',
      bgGradient: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading certification programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Award className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Professional Certifications
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Advance your career with industry-recognized certifications in cybersecurity, cloud computing, 
              networking, digital marketing, AI/ML, and IoT technologies.
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">{courses.length}+</div>
                <div className="text-blue-100">Certifications</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">6</div>
                <div className="text-blue-100">Specializations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">100+</div>
                <div className="text-blue-100">Hours Content</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="certifications">All Certifications</TabsTrigger>
            <TabsTrigger value="my-progress">My Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Certification Categories */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Choose Your Certification Path
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificationCategories.map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  const stats = getCategoryStats(category.id);
                  
                  return (
                    <Card 
                      key={category.id} 
                      className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${category.borderColor} bg-gradient-to-br ${category.bgGradient}`}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: category.color, opacity: 0.1 }}
                          >
                            <Icon className="h-6 w-6" style={{ color: category.color }} />
                          </div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Available Courses</span>
                            <Badge variant="secondary">{stats.total} courses</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {stats.professional > 0 && (
                              <div className="text-center">
                                <div className="font-bold text-purple-600">{stats.professional}</div>
                                <div className="text-gray-500">Professional</div>
                              </div>
                            )}
                            {stats.advanced > 0 && (
                              <div className="text-center">
                                <div className="font-bold text-red-600">{stats.advanced}</div>
                                <div className="text-gray-500">Advanced</div>
                              </div>
                            )}
                            {stats.intermediate > 0 && (
                              <div className="text-center">
                                <div className="font-bold text-blue-600">{stats.intermediate}</div>
                                <div className="text-gray-500">Intermediate</div>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            className="w-full mt-4"
                            style={{ backgroundColor: category.color }}
                            asChild
                          >
                            <Link href={`/certifications/${category.id}`}>
                              View Certifications
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Why Get Certified Section */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Why Get Certified?</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Career Growth</h3>
                  <p className="text-gray-600 text-sm">
                    Advance your career with industry-recognized credentials
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Skill Validation</h3>
                  <p className="text-gray-600 text-sm">
                    Prove your expertise with comprehensive assessments
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Network Access</h3>
                  <p className="text-gray-600 text-sm">
                    Connect with certified professionals worldwide
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Industry Recognition</h3>
                  <p className="text-gray-600 text-sm">
                    Gain recognition from employers and peers
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                All Professional Certifications
              </h2>
              <p className="text-lg text-gray-600">
                Comprehensive list of all available certification programs
              </p>
            </div>

            {certificationCategories.map((category) => {
              const categoryCourses = courses.filter(course => course.category === category.id);
              const Icon = getCategoryIcon(category.id);
              
              if (categoryCourses.length === 0) return null;
              
              return (
                <div key={category.id} className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <Icon className="h-8 w-8" style={{ color: category.color }} />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.title} Certifications
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {course.description}
                              </p>
                            </div>
                            {course.certificateAvailable && (
                              <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge 
                                variant={course.level === 'professional' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {course.level ? course.level.charAt(0).toUpperCase() + course.level.slice(1) : 'Beginner'}
                              </Badge>
                              {course.duration && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {course.duration}
                                </Badge>
                              )}
                              {course.examRequired && (
                                <Badge variant="secondary" className="text-xs">
                                  Exam Required
                                </Badge>
                              )}
                            </div>
                            
                            <Button 
                              className="w-full"
                              asChild
                              data-testid={`button-start-${course.id}`}
                            >
                              <Link href={`/tutorial/${course.id}`}>
                                Start Certification
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="my-progress" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                My Certification Progress
              </h2>
              <p className="text-lg text-gray-600">
                Track your progress across all certification programs
              </p>
            </div>

            {/* Overall Progress Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-gray-600">Certificates Earned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                  <div className="text-gray-600">Courses Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                  <div className="text-gray-600">Hours Studied</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                  <div className="text-gray-600">Average Score</div>
                </CardContent>
              </Card>
            </div>

            {/* In Progress Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Courses in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No courses in progress yet</p>
                  <p className="text-sm">Start a certification program to track your progress here</p>
                  <Button className="mt-4" asChild>
                    <Link href="#certifications">Browse Certifications</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Completed Certificates */}
            <Card>
              <CardHeader>
                <CardTitle>Earned Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No certificates earned yet</p>
                  <p className="text-sm">Complete certification exams to earn your professional certificates</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}