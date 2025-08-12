import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Award, AlertTriangle } from "lucide-react";
import { type Quiz } from "@shared/schema";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 1800); // 30 min default
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions: Question[] = Array.isArray(quiz.questions) 
    ? quiz.questions as Question[]
    : JSON.parse(quiz.questions as string) as Question[];

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (isCompleted) return;

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= quiz.passingScore;

    setScore(finalScore);
    setIsCompleted(true);
    setShowResults(true);
    onComplete(finalScore, passed);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (quiz.timeLimit ? quiz.timeLimit * 60 : 1800)) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  if (showResults) {
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {passed ? (
                <Award className="h-16 w-16 text-green-500" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? "Congratulations!" : "Quiz Incomplete"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="text-6xl font-bold mb-2" 
                     style={{ color: passed ? '#10B981' : '#EF4444' }}>
                  {score}%
                </div>
                <p className="text-lg text-gray-600">
                  Your Score ({selectedAnswers.filter((answer, index) => 
                    answer === questions[index]?.correctAnswer).length} / {questions.length} correct)
                </p>
              </div>

              <div className="flex justify-center">
                <Badge 
                  variant={passed ? "default" : "destructive"}
                  className="text-lg py-1 px-4"
                >
                  {passed ? `PASSED (${quiz.passingScore}%+ required)` : `FAILED (${quiz.passingScore}%+ required)`}
                </Badge>
              </div>

              {passed && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    🎉 Great job! You've successfully completed the quiz. 
                    Your progress has been saved and you can continue to the next section.
                  </p>
                </div>
              )}

              {!passed && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-800">
                    Don't worry! Review the material and try again. You need {quiz.passingScore}% to pass.
                  </p>
                  <Button 
                    className="mt-3"
                    onClick={() => window.location.reload()}
                    data-testid="button-retry-quiz"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Detailed Results */}
              <div className="text-left max-w-2xl mx-auto space-y-4">
                <h3 className="text-xl font-semibold mb-4">Question Review</h3>
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">Question {index + 1}</p>
                          <p className="text-gray-700 mb-2">{question.question}</p>
                          
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Your answer:</span>{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer !== undefined ? question.options[userAnswer] : "Not answered"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p>
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600">
                                  {question.options[question.correctAnswer]}
                                </span>
                              </p>
                            )}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                              <p className="text-blue-800 text-sm">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-gray-600 mt-1">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-2 text-lg font-mono ${getTimeColor()}`}>
                <Clock className="h-5 w-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress 
              value={(currentQuestion + 1) / questions.length * 100} 
              className="h-2"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {questions[currentQuestion]?.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleAnswerSelect(index)}
                data-testid={`option-${index}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          data-testid="button-previous-question"
        >
          Previous
        </Button>

        <div className="flex space-x-3">
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={selectedAnswers.filter(answer => answer !== undefined).length !== questions.length}
              data-testid="button-submit-quiz"
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
              data-testid="button-next-question"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>

      {/* Question Overview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-blue-500 text-white"
                    : selectedAnswers[index] !== undefined
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
                data-testid={`question-nav-${index}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex space-x-4 text-sm text-gray-600 mt-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}