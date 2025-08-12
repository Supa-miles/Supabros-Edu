import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { type Tutorial } from "@shared/schema";
import CodeEditor from "./code-editor";

interface TutorialContentProps {
  tutorial: Tutorial;
}

export default function TutorialContent({ tutorial }: TutorialContentProps) {
  return (
    <div className="space-y-8">
      {/* Tutorial Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-tutorial-title">
          {tutorial.title}
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          Learn {tutorial.title.toLowerCase()} with hands-on examples and interactive exercises
        </p>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span data-testid="text-read-time">{tutorial.readTime} min read</span>
          </span>
          <span className="flex items-center space-x-1 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span data-testid="text-difficulty">{tutorial.difficulty}</span>
          </span>
          <Badge variant="secondary" className="capitalize">
            {tutorial.language}
          </Badge>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="space-y-8">
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Tutorial Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: tutorial.content }}
              data-testid="tutorial-content"
            />
          </CardContent>
        </Card>

        {/* Code Example */}
        {tutorial.codeExample && (
          <Card>
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <pre className="bg-code-bg text-code-text p-4 rounded-lg overflow-x-auto">
                  <code data-testid="code-example">{tutorial.codeExample}</code>
                </pre>
              </div>
              <Button 
                className="w-full sm:w-auto"
                data-testid="button-try-yourself"
              >
                <i className="fas fa-play mr-2"></i>
                Try it Yourself
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interactive Code Editor */}
        <CodeEditor 
          initialCode={tutorial.codeExample || getDefaultCode(tutorial.language || "javascript")}
          language={tutorial.language || "javascript"}
        />

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBestPractices(tutorial.language || "javascript").map((practice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    {practice.type === 'do' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{practice.title}</h4>
                    <p className="text-gray-600 text-sm">{practice.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        {tutorial.prevTutorial ? (
          <Link href={`/tutorial/${tutorial.prevTutorial}`}>
            <Button variant="outline" data-testid="button-previous">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          </Link>
        ) : (
          <div></div>
        )}

        {tutorial.nextTutorial ? (
          <Link href={`/tutorial/${tutorial.nextTutorial}`}>
            <Button data-testid="button-next">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Complete
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

function getDefaultCode(language: string): string {
  const defaults: Record<string, string> = {
    javascript: `// Welcome to the JavaScript playground!
console.log("Hello, World!");

let name = "Developer";
let greeting = "Welcome to SupaBros Edu, " + name + "!";
console.log(greeting);`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`,
    css: `/* Welcome to the CSS playground! */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #04AA6D;
    text-align: center;
}

p {
    line-height: 1.6;
    color: #333;
}`,
    python: `# Welcome to the Python playground!
print("Hello, World!")

name = "Developer"
greeting = f"Welcome to SupaBros Edu, {name}!"
print(greeting)

# Try some basic operations
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum of numbers: {total}")`,
    sql: `-- Welcome to the SQL playground!
-- Create a sample table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Insert some data
INSERT INTO users VALUES (1, 'John Doe', 'john@example.com');
INSERT INTO users VALUES (2, 'Jane Smith', 'jane@example.com');

-- Query the data
SELECT * FROM users;`
  };

  return defaults[language] || `// Welcome to the ${language} playground!\nconsole.log("Hello, World!");`;
}

function getBestPractices(language: string) {
  const practices: Record<string, Array<{ type: 'do' | 'dont', title: string, description: string }>> = {
    javascript: [
      {
        type: 'do',
        title: 'Use const by default',
        description: 'Use const for variables that won\'t be reassigned to prevent accidental mutations.'
      },
      {
        type: 'do',
        title: 'Use let for reassignment',
        description: 'Use let when you need to reassign the variable value.'
      },
      {
        type: 'dont',
        title: 'Avoid var',
        description: 'Avoid var due to its function-scoping issues and potential for bugs.'
      }
    ],
    html: [
      {
        type: 'do',
        title: 'Use semantic HTML',
        description: 'Choose HTML elements based on their meaning, not their appearance.'
      },
      {
        type: 'do',
        title: 'Include alt attributes',
        description: 'Always include alt attributes for images for accessibility.'
      },
      {
        type: 'dont',
        title: 'Don\'t skip heading levels',
        description: 'Don\'t jump from h1 to h3, maintain proper heading hierarchy.'
      }
    ],
    css: [
      {
        type: 'do',
        title: 'Use external stylesheets',
        description: 'Keep your CSS in separate files for better organization and caching.'
      },
      {
        type: 'do',
        title: 'Use specific selectors',
        description: 'Use class and ID selectors instead of overly generic element selectors.'
      },
      {
        type: 'dont',
        title: 'Avoid !important',
        description: 'Use !important sparingly as it makes CSS harder to maintain.'
      }
    ]
  };

  return practices[language] || [
    {
      type: 'do',
      title: 'Follow best practices',
      description: 'Write clean, readable, and maintainable code.'
    }
  ];
}