import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Loader2,
  Info,
  FileText,
  Star,
  TrendingUp,
  Eye,
  HelpCircle,
  Target,
  Zap,
  Brain,
  Lightbulb,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import { VisaRoute, Question } from '../data/visaRoutes';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface EligibilityQuestionnaireProps {
  route: VisaRoute;
  onBack: () => void;
  onComplete: (answers: Answer[], assessment: any) => void;
  navigate: (path: string) => void;
  user?: User;
}

interface Answer {
  questionId: string;
  answer: string | number | boolean | string[];
}

export function EligibilityQuestionnaire({ 
  route, 
  onBack, 
  onComplete, 
  navigate, 
  user 
}: EligibilityQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [estimatedScore, setEstimatedScore] = useState(0);
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);
  const [selectedEndorsingBody, setSelectedEndorsingBody] = useState<string>('');

  const supabase = createClient();
  
  // Filter questions based on endorsing body selection for Global Talent visa
  const getFilteredQuestions = () => {
    if (route.id !== 'global-talent') {
      return route.questions;
    }

    const endorsingBodyAnswer = answers.find(a => a.questionId === 'endorsing-body-selection')?.answer as string;
    
    if (!endorsingBodyAnswer) {
      // Show only basic questions until endorsing body is selected
      return route.questions.filter(q => 
        !q.id.startsWith('tech-') && 
        !q.id.startsWith('arts-') && 
        !q.id.startsWith('ba-') && 
        !q.id.startsWith('rs-') && 
        !q.id.startsWith('rae-') && 
        !q.id.startsWith('ukri-')
      );
    }

    // Determine which endorsing body specific questions to show
    let bodyPrefix = '';
    if (endorsingBodyAnswer.includes('Tech Nation')) bodyPrefix = 'tech-';
    else if (endorsingBodyAnswer.includes('Arts Council')) bodyPrefix = 'arts-';
    else if (endorsingBodyAnswer.includes('British Academy')) bodyPrefix = 'ba-';
    else if (endorsingBodyAnswer.includes('Royal Society')) bodyPrefix = 'rs-';
    else if (endorsingBodyAnswer.includes('Royal Academy of Engineering')) bodyPrefix = 'rae-';
    else if (endorsingBodyAnswer.includes('UK Research and Innovation')) bodyPrefix = 'ukri-';

    return route.questions.filter(q => {
      // Always include general questions
      if (!q.id.startsWith('tech-') && 
          !q.id.startsWith('arts-') && 
          !q.id.startsWith('ba-') && 
          !q.id.startsWith('rs-') && 
          !q.id.startsWith('rae-') && 
          !q.id.startsWith('ukri-')) {
        return true;
      }
      
      // Include questions for selected endorsing body
      return q.id.startsWith(bodyPrefix);
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  const completedQuestions = answers.length;

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    // Calculate estimated score based on current answers
    calculateEstimatedScore();
  }, [answers]);

  const loadUserProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error during profile load:', sessionError);
        return;
      }
      
      if (!session?.access_token) {
        console.log('No valid session found, skipping profile load');
        return;
      }

      console.log('Loading user profile...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/profile`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('User profile loaded successfully');
        setUserProfile(data.profile);
      } else {
        console.warn('Failed to load user profile:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const calculateEstimatedScore = () => {
    let score = 50; // Base score
    answers.forEach(answer => {
      const question = filteredQuestions.find(q => q.id === answer.questionId);
      if (question) {
        const weight = question.weight;
        // Simple scoring logic based on answer type and weight
        if (typeof answer.answer === 'boolean' && answer.answer) {
          score += weight * 5;
        } else if (typeof answer.answer === 'string' && answer.answer.length > 0) {
          score += weight * 4;
        } else if (Array.isArray(answer.answer) && answer.answer.length > 0) {
          score += weight * (answer.answer.length * 3);
        } else if (typeof answer.answer === 'number' && answer.answer > 0) {
          score += weight * 4;
        }
      }
    });
    setEstimatedScore(Math.min(100, Math.max(0, score)));
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion.id)?.answer;
  };

  const updateAnswer = (answer: string | number | boolean | string[]) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      const newAnswers = [...filtered, { questionId: currentQuestion.id, answer }];
      
      // If this is the endorsing body selection, we need to reset the current question index
      // because the available questions will change
      if (currentQuestion.id === 'endorsing-body-selection') {
        setTimeout(() => {
          // Move to next question after the selection is processed
          setCurrentQuestionIndex(prev => prev + 1);
        }, 100);
      }
      
      return newAnswers;
    });
  };

  const handleNext = () => {
    const currentAnswer = getCurrentAnswer();
    
    if (currentQuestion.required && (currentAnswer === undefined || currentAnswer === '' || (Array.isArray(currentAnswer) && currentAnswer.length === 0))) {
      toast.error('Please answer this question before continuing.');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowQuestionOverview(false);
    setShowHint(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please sign in again.');
        return;
      }

      if (!session?.access_token) {
        console.error('No valid session or access token found');
        toast.error('Please sign in to continue with the assessment');
        return;
      }

      console.log('Starting AI-powered eligibility assessment...');
      console.log('Route:', route.name);
      console.log('Answers count:', answers.length);
      console.log('User profile:', userProfile ? 'Available' : 'Not available');
      console.log('User ID:', session.user?.id);
      console.log('Session valid:', !!session.access_token);

      // Send to AI for comprehensive assessment
      console.log('Sending assessment request to:', `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/assess-eligibility`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/assess-eligibility`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            visaRoute: route,
            answers: answers,
            userProfile: userProfile || {}
          })
        }
      );

      console.log('Assessment response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Assessment API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        if (response.status === 401) {
          toast.error('Authentication failed. Please sign in again.');
          // Could redirect to sign in here if needed
          return;
        }
        
        throw new Error(errorData.error || `Assessment failed (${response.status}): ${response.statusText}`);
      }

      const assessmentResult = await response.json();
      console.log('Assessment completed:', assessmentResult);
      
      // Validate that we received proper AI assessment data
      if (!assessmentResult.success || !assessmentResult.assessment) {
        throw new Error('Invalid assessment response from AI');
      }

      const { assessment, actionPlan, assessmentId, ukviApplicationUrl } = assessmentResult;
      
      // Store comprehensive assessment data
      const assessmentData = {
        route: {
          id: route.id,
          name: route.name,
          description: route.description,
          category: route.category,
          difficulty: route.difficulty,
          ukviUrl: route.ukviUrl
        },
        answers,
        assessment,
        assessmentId,
        actionPlan,
        ukviApplicationUrl,
        timestamp: assessmentResult.timestamp,
        aiPowered: true,
        version: '2.0'
      };
      
      localStorage.setItem('lastAssessment', JSON.stringify(assessmentData));

      // Show success message with score
      const score = assessment.overallScore;
      const status = assessment.eligibilityStatus;
      
      toast.success(`Assessment completed! Score: ${score}% - ${status}`);
      
      // Pass the full assessment result to the parent
      onComplete(answers, assessmentResult);
      navigate('eligibility-results');

    } catch (error) {
      console.error('Assessment error:', error);
      
      // Provide more specific error messages based on error type
      if (error.message?.includes('Authentication') || error.message?.includes('401')) {
        toast.error('Authentication failed. Please sign in again.');
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Assessment failed: ${error.message}. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionHint = (question: Question) => {
    const hints = {
      'What is your current nationality?': 'Some nationalities have specific visa advantages or requirements. This helps us understand which routes are available to you.',
      'Do you have a UK job offer?': 'A confirmed job offer is essential for most work visas and significantly increases your chances.',
      'What is your highest qualification level?': 'Higher qualifications often lead to better visa options and higher success rates.',
      'What is your annual salary?': 'Many UK visas have minimum salary requirements. Higher salaries improve your eligibility.',
      'Do you have sufficient funds?': 'Financial requirements vary by visa type but are crucial for approval.',
      'How many years of work experience do you have?': 'Experience in your field strengthens your application significantly.',
      'Are you currently in the UK?': 'Your current location affects application processes and timelines.',
      'What is your English proficiency level?': 'English language skills are mandatory for most UK visas.'
    };
    return hints[question.text] || 'This question helps our AI provide more accurate eligibility assessment.';
  };

  const getQuestionIcon = (question: Question) => {
    if (question.weight >= 8) return <Star className="w-4 h-4 text-yellow-500" />;
    if (question.weight >= 5) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    return <Info className="w-4 h-4 text-muted-foreground" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const renderQuestionInput = () => {
    const currentAnswer = getCurrentAnswer();

    switch (currentQuestion.type) {
      case 'boolean':
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={currentAnswer?.toString()} 
              onValueChange={(value) => updateAnswer(value === 'true')}
              className="space-y-4"
            >
              <div className="relative">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200">
                  <RadioGroupItem value="true" id="yes" className="w-5 h-5" />
                  <Label htmlFor="yes" className="cursor-pointer text-base flex-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Yes</span>
                    </div>
                  </Label>
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200">
                  <RadioGroupItem value="false" id="no" className="w-5 h-5" />
                  <Label htmlFor="no" className="cursor-pointer text-base flex-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>No</span>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case 'single':
        return (
          <div className="space-y-3">
            <RadioGroup 
              value={currentAnswer?.toString()} 
              onValueChange={(value) => updateAnswer(value)}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => {
                const isEndorsingBodySelection = currentQuestion.id === 'endorsing-body-selection';
                let description = '';
                let icon = null;
                
                if (isEndorsingBodySelection) {
                  if (option.includes('Tech Nation')) {
                    description = 'AI, fintech, cybersecurity, digital technology innovations';
                    icon = <Zap className="w-5 h-5 text-blue-500" />;
                  } else if (option.includes('Arts Council')) {
                    description = 'Visual arts, performing arts, literature, cultural activities';
                    icon = <Star className="w-5 h-5 text-purple-500" />;
                  } else if (option.includes('British Academy')) {
                    description = 'Humanities, social sciences, historical research';
                    icon = <BookOpen className="w-5 h-5 text-green-500" />;
                  } else if (option.includes('Royal Society')) {
                    description = 'Science, mathematics, pure research, academic excellence';
                    icon = <Brain className="w-5 h-5 text-indigo-500" />;
                  } else if (option.includes('Royal Academy of Engineering')) {
                    description = 'Engineering innovations, technical leadership, industrial applications';
                    icon = <Target className="w-5 h-5 text-orange-500" />;
                  } else if (option.includes('UK Research and Innovation')) {
                    description = 'Cross-disciplinary research, innovation, academic-industry collaboration';
                    icon = <Lightbulb className="w-5 h-5 text-yellow-500" />;
                  }
                }
                
                return (
                  <div key={index} className="relative">
                    <div className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 ${
                      isEndorsingBodySelection ? 'min-h-[80px]' : ''
                    }`}>
                      <RadioGroupItem value={option} id={`option-${index}`} className="w-5 h-5" />
                      <div className="flex-1">
                        <Label htmlFor={`option-${index}`} className="cursor-pointer text-base flex items-center space-x-2">
                          {icon}
                          <span className="font-medium">{option.split(' - ')[0]}</span>
                        </Label>
                        {description && (
                          <p className="text-sm text-muted-foreground mt-1 ml-7">{description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
            
            {currentQuestion.id === 'endorsing-body-selection' && (
              <Alert className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>💡 Choose Carefully:</strong> Each endorsing body has different mandatory and optional criteria. 
                  Your selection will determine the specific questions you'll need to answer for eligibility assessment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 'multiple':
        const multipleAnswers = (currentAnswer as string[]) || [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="relative">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200">
                  <Checkbox
                    id={`multiple-${index}`}
                    checked={multipleAnswers.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateAnswer([...multipleAnswers, option]);
                      } else {
                        updateAnswer(multipleAnswers.filter(a => a !== option));
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor={`multiple-${index}`} className="cursor-pointer text-base flex-1">{option}</Label>
                </div>
              </div>
            ))}
            <div className="text-sm text-muted-foreground flex items-center space-x-2 mt-3">
              <Info className="w-4 h-4" />
              <span>Select all that apply</span>
            </div>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <Input
              type="number"
              value={currentAnswer?.toString() || ''}
              onChange={(e) => updateAnswer(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full text-lg p-4 h-14"
            />
            <div className="text-sm text-muted-foreground">
              💡 Tip: Be accurate with numbers as they significantly impact your eligibility score
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              value={currentAnswer?.toString() || ''}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder="Please provide detailed information..."
              rows={6}
              className="w-full text-base"
            />
            <div className="text-sm text-muted-foreground">
              💡 Tip: Provide specific details - the AI analyzes your response for eligibility factors
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getMilestoneTitle = (progress: number) => {
    const endorsingBodyAnswer = answers.find(a => a.questionId === 'endorsing-body-selection')?.answer as string;
    
    if (progress >= 100) return "🎉 Assessment Complete!";
    if (progress >= 75) return "🚀 Almost There!";
    if (progress >= 50) {
      if (route.id === 'global-talent' && endorsingBodyAnswer) {
        if (endorsingBodyAnswer.includes('Tech Nation')) return "💻 Tech Criteria Assessment!";
        if (endorsingBodyAnswer.includes('Arts Council')) return "🎨 Arts Excellence Review!";
        if (endorsingBodyAnswer.includes('British Academy')) return "📚 Academic Merit Evaluation!";
        if (endorsingBodyAnswer.includes('Royal Society')) return "🔬 Scientific Achievement Review!";
        if (endorsingBodyAnswer.includes('Royal Academy of Engineering')) return "⚙️ Engineering Innovation Assessment!";
        if (endorsingBodyAnswer.includes('UK Research')) return "🧪 Research Impact Analysis!";
      }
      return "💪 Halfway Done!";
    }
    if (progress >= 25) return "🎯 Good Progress!";
    return "🌟 Getting Started!";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center space-x-2 hover:bg-accent/50 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Routes</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestionOverview(!showQuestionOverview)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Overview</span>
            </Button>
            
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </Badge>
          </div>
        </div>

        {/* Question Overview Modal */}
        {showQuestionOverview && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Assessment Overview</span>
              </CardTitle>
              <CardDescription>
                Click on any question to jump to it directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {filteredQuestions.map((question, index) => {
                  const isAnswered = answers.some(a => a.questionId === question.id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => jumpToQuestion(index)}
                      className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                        isCurrent 
                          ? 'border-primary bg-primary/10' 
                          : isAnswered 
                            ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                            : 'border-border hover:bg-accent/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isCurrent 
                            ? 'bg-primary text-primary-foreground' 
                            : isAnswered 
                              ? 'bg-green-500 text-white' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isAnswered ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{question.text}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getQuestionIcon(question)}
                            <span className="text-xs text-muted-foreground">
                              Weight: {question.weight}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowQuestionOverview(false)}
                className="w-full mt-4"
              >
                Close Overview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{route.name} Assessment</h1>
              <p className="text-muted-foreground">{getMilestoneTitle(progress)}</p>
            </div>
            
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className={`text-2xl font-bold ${getScoreColor(estimatedScore)}`}>
                  {estimatedScore}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Estimated Score</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedQuestions} of {filteredQuestions.length} answered</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Main Question Card */}
        <Card className="mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-secondary/50"></div>
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                
                <div className="flex-1">
                  <CardTitle className="text-xl mb-3 leading-relaxed">
                    {currentQuestion.text}
                    {currentQuestion.required && (
                      <span className="text-red-500 ml-2">*</span>
                    )}
                  </CardTitle>
                  
                  {showHint && (
                    <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 dark:text-blue-200">
                        <strong>💡 Helpful Context:</strong> {getQuestionHint(currentQuestion)}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {getQuestionIcon(currentQuestion)}
                      <span className={
                        currentQuestion.weight >= 8 ? 'text-yellow-600 font-medium' :
                        currentQuestion.weight >= 5 ? 'text-blue-600' :
                        'text-muted-foreground'
                      }>
                        {currentQuestion.weight >= 8 ? 'High Impact' :
                         currentQuestion.weight >= 5 ? 'Medium Impact' :
                         'Standard'}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs h-6 px-2 hover:bg-accent/50"
                    >
                      <HelpCircle className="w-3 h-3 mr-1" />
                      {showHint ? 'Hide' : 'Show'} Hint
                    </Button>
                    
                    {currentQuestion.ukviReference && (
                      <a 
                        href={currentQuestion.ukviReference} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary hover:underline text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>UKVI Reference</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={currentQuestion.weight >= 8 ? "default" : "secondary"} 
                className="flex-shrink-0 ml-4"
              >
                Weight: {currentQuestion.weight}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {renderQuestionInput()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 h-12 px-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Est. {Math.max(1, filteredQuestions.length - currentQuestionIndex)} min remaining</span>
              </div>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center space-x-2 h-12 px-6 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Analyzing...</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Complete AI Assessment</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Route Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Visa Details</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{route.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span>{route.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Cost:</span>
                    <span className="font-semibold text-green-600">£{route.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span>{route.processingTime}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Assessment Progress</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${completedQuestions >= filteredQuestions.length * 0.25 ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span className="text-sm">25% - Getting Started</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${completedQuestions >= filteredQuestions.length * 0.5 ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span className="text-sm">50% - {route.id === 'global-talent' ? 'Endorsing Body Criteria' : 'Halfway Point'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${completedQuestions >= filteredQuestions.length * 0.75 ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span className="text-sm">75% - Nearly There</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${completedQuestions >= filteredQuestions.length ? 'bg-green-500' : 'bg-muted'}`}></div>
                    <span className="text-sm">100% - AI Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Processing Info */}
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <Brain className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <div className="font-semibold flex items-center space-x-2">
                <span>🤖 AI-Powered Smart Assessment</span>
                {route.id === 'global-talent' && (
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                    Endorsing Body Specific
                  </Badge>
                )}
              </div>
              <div className="text-sm">
                Our advanced AI analyzes your responses against current UKVI requirements, considering {filteredQuestions.length} key factors 
                {route.id === 'global-talent' ? ' and specific endorsing body criteria ' : ' '}
                to provide personalized eligibility scoring, actionable recommendations, and tailored improvement plans.
              </div>
              {route.id === 'global-talent' && (
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-2 bg-blue-100/50 dark:bg-blue-900/30 p-2 rounded">
                  🎯 Global Talent assessments include mandatory and optional criteria specific to your chosen endorsing body, 
                  ensuring precise alignment with their requirements.
                </div>
              )}
              <div className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                ⚡ Results are for guidance only. Always consult official UKVI guidance for final decisions.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}