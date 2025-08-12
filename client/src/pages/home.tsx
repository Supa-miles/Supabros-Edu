import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Link } from "wouter";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { type Course, type Tutorial } from "@shared/schema";

export default function Home() {
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });

  const popularTutorials = tutorials.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Hero Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white">
                <h1 className="text-4xl font-bold mb-4">
                  Learn to Code with SupaBros Edu
                </h1>
                <p className="text-xl mb-6 opacity-90">
                  Master programming languages with interactive tutorials, hands-on exercises, and real-world projects.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="secondary" data-testid="button-get-started">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" data-testid="button-explore">
                    Explore Courses
                  </Button>
                </div>
              </div>
            </section>

            {/* Course Categories */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Course Categories
              </h2>
              
              {coursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <Card 
                      key={course.id} 
                      className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      data-testid={`card-course-${course.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: course.color + '20' }}
                          >
                            <i 
                              className={`${course.icon} text-xl`}
                              style={{ color: course.color }}
                            ></i>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {course.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {course.description}
                        </CardDescription>
                        <Link href={`/course/${course.id}`}>
                          <Button className="w-full" data-testid={`button-explore-${course.id}`}>
                            Explore Course
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Popular Tutorials */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Popular Tutorials
                </h2>
                <Link href="/tutorials">
                  <Button variant="outline" data-testid="button-view-all">
                    View All
                  </Button>
                </Link>
              </div>

              {tutorialsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularTutorials.map((tutorial) => (
                    <Card 
                      key={tutorial.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                      data-testid={`card-tutorial-${tutorial.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">
                              {tutorial.title}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{tutorial.readTime} min</span>
                              </span>
                              <Badge 
                                variant={tutorial.difficulty === 'beginner' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {tutorial.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {tutorial.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                        <Link href={`/tutorial/${tutorial.slug}`}>
                          <Button className="w-full" data-testid={`button-start-${tutorial.id}`}>
                            Start Tutorial
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Features */}
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Why Choose SupaBros Edu?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
                  <p className="text-gray-600">
                    Learn by doing with our interactive code editor and real-time feedback.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600">
                    Monitor your learning journey with detailed progress tracking and achievements.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Learn at Your Pace</h3>
                  <p className="text-gray-600">
                    Self-paced tutorials that adapt to your schedule and learning style.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
