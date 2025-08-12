import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Tutorial, type Course } from "@shared/schema";

interface BreadcrumbProps {
  tutorial: Tutorial;
}

export default function Breadcrumb({ tutorial }: BreadcrumbProps) {
  const { data: course } = useQuery<Course>({
    queryKey: ["/api/courses", tutorial.courseId],
  });

  return (
    <nav className="mb-6 text-sm" data-testid="breadcrumb">
      <ol className="flex items-center space-x-2 text-gray-500">
        <li>
          <Link 
            href="/" 
            className="hover:text-primary flex items-center space-x-1"
            data-testid="breadcrumb-home"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <ChevronRight className="h-3 w-3" />
        </li>
        {course && (
          <>
            <li>
              <Link 
                href={`/course/${course.id}`} 
                className="hover:text-primary"
                data-testid="breadcrumb-course"
              >
                {course.title}
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3" />
            </li>
          </>
        )}
        <li className="text-gray-800 font-medium" data-testid="breadcrumb-tutorial">
          {tutorial.title}
        </li>
      </ol>
    </nav>
  );
}