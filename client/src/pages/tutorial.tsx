import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import TutorialContent from "@/components/tutorial/tutorial-content";
import Breadcrumb from "@/components/tutorial/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { type Tutorial } from "@shared/schema";

export default function TutorialPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: tutorial, isLoading, error } = useQuery<Tutorial>({
    queryKey: ["/api/tutorials", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-0">
            <div className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-0">
            <div className="p-6">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <h1 className="text-2xl font-bold text-gray-900">Tutorial Not Found</h1>
                  </div>
                  <p className="text-gray-600">
                    The tutorial you're looking for doesn't exist or has been moved.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            <Breadcrumb tutorial={tutorial} />
            <TutorialContent tutorial={tutorial} />
          </div>
        </main>
      </div>
    </div>
  );
}
