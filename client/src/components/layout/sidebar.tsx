import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Course, type Tutorial } from "@shared/schema";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["frontend"]);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: tutorials = [] } = useQuery<Tutorial[]>({
    queryKey: ["/api/tutorials"],
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getTutorialsByCourse = (courseId: string) => {
    return tutorials.filter(tutorial => tutorial.courseId === courseId);
  };

  const isCurrentTutorial = (slug: string) => {
    return location === `/tutorial/${slug}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-40 w-64 h-screen bg-sidebar-bg shadow-lg border-r border-gray-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        data-testid="sidebar"
      >
        <div className="p-4 overflow-y-auto h-full">
          <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">
            Tutorials
          </h2>
          
          <div className="space-y-2">
            {courses.map((course) => {
              const courseTutorials = getTutorialsByCourse(course.id);
              const isExpanded = expandedSections.includes(course.id);
              
              return (
                <div key={course.id} className="mb-4">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-between w-full p-2 h-auto hover:bg-nav-hover"
                    onClick={() => toggleSection(course.id)}
                    data-testid={`button-toggle-${course.id}`}
                  >
                    <span className="flex items-center space-x-2">
                      <i className={`${course.icon} text-primary`} />
                      <span className="font-medium">{course.title}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {courseTutorials.map((tutorial) => (
                        <Link 
                          key={tutorial.id}
                          href={`/tutorial/${tutorial.slug}`}
                          className={cn(
                            "block p-2 text-sm rounded nav-item",
                            isCurrentTutorial(tutorial.slug)
                              ? "text-primary bg-primary bg-opacity-10"
                              : "text-gray-600 hover:text-primary hover:bg-primary hover:bg-opacity-10"
                          )}
                          data-testid={`link-tutorial-${tutorial.id}`}
                        >
                          <div className="flex items-center space-x-2">
                            <i className={getLanguageIcon(tutorial.language)} />
                            <span>{tutorial.title}</span>
                          </div>
                        </Link>
                      ))}
                      
                      {courseTutorials.length === 0 && (
                        <div className="p-2 text-sm text-gray-400 italic">
                          No tutorials available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p>No courses available</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function getLanguageIcon(language: string): string {
  const icons: Record<string, string> = {
    html: "fab fa-html5 text-orange-500",
    css: "fab fa-css3-alt text-blue-500",
    javascript: "fab fa-js-square text-yellow-500",
    react: "fab fa-react text-cyan-500",
    python: "fab fa-python text-yellow-600",
    nodejs: "fab fa-node-js text-green-600",
    php: "fab fa-php text-indigo-600",
    sql: "fas fa-database text-blue-600",
    mongodb: "fas fa-leaf text-green-600",
  };
  
  return icons[language] || "fas fa-code text-gray-500";
}
