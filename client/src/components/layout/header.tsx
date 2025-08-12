import { useState } from "react";
import { Search, Menu, Code, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Tutorial } from "@shared/schema";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: searchResults = [] } = useQuery<Tutorial[]>({
    queryKey: ["/api/search", { q: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onToggleSidebar}
            data-testid="button-sidebar-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">SupaBros Edu</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tutorials..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                data-testid="input-search"
              />
              
              {showSearchResults && searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-64 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults.slice(0, 5).map((tutorial) => (
                      <Link 
                        key={tutorial.id}
                        href={`/tutorial/${tutorial.slug}`}
                        className="block px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        data-testid={`search-result-${tutorial.id}`}
                      >
                        <div className="font-medium text-sm">{tutorial.title}</div>
                        <div className="text-xs text-gray-500 capitalize">{tutorial.difficulty}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No tutorials found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-sm text-gray-600">Progress:</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div className="w-3/5 h-2 bg-primary rounded-full progress-bar"></div>
            </div>
            <span className="text-sm text-gray-600" data-testid="text-progress">60%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
