import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  TrendingUp,
  Clock,
  Target,
  AlertCircle,
  FileText,
  ArrowRight,
  Lightbulb,
  Shield,
  Calendar
} from 'lucide-react';
import { VisaRoute } from '../data/visaRoutes';

interface Answer {
  questionId: string;
  answer: string | number | boolean | string[];
}

interface Assessment {
  overallScore: number;
  eligibilityStatus: 'Highly Likely' | 'Likely' | 'Possible' | 'Unlikely' | 'Not Eligible';
  assessment: {
    strengths: string[];
    weaknesses: string[];
    criticalIssues: string[];
    missingRequirements: string[];
  };
  recommendations: Array<{
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    timeframe: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
  nextSteps: string[];
  riskFactors: string[];
  applicationTimeline: string;
}

interface ActionPlan {
  planId: string;
  targetScore: number;
  estimatedDays: number;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedDays: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    scoreImpact: number;
    requirements: string[];
    resources: string[];
    completed: boolean;
  }>;
  milestones: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  tips: string[];
  warningNote?: string;
}

interface EligibilityResultsProps {
  route: VisaRoute;
  answers: Answer[];
  score: number;
  assessment?: Assessment;
  actionPlan?: ActionPlan;
  ukviApplicationUrl?: string;
  onBack: () => void;
  onRetakeQuiz: () => void;
  onCheckAnotherRoute: () => void;
  onStartActionPlan: () => void;
}

export function EligibilityResults({
  route,
  answers,
  score,
  assessment,
  actionPlan,
  ukviApplicationUrl,
  onBack,
  onRetakeQuiz,
  onCheckAnotherRoute,
  onStartActionPlan
}: EligibilityResultsProps) {
  const [showFullAssessment, setShowFullAssessment] = useState(false);

  // Load assessment data from localStorage if not provided
  useEffect(() => {
    if (!assessment) {
      const storedData = localStorage.getItem('lastAssessment');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        // Component will re-render with proper data from parent
      }
    }
  }, [assessment]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 50) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Highly Likely':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'Likely':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'Possible':
        return <Target className="w-6 h-6 text-yellow-600" />;
      case 'Unlikely':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'Not Eligible':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Target className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Use provided assessment or fallback
  const displayAssessment = assessment || {
    overallScore: score,
    eligibilityStatus: score >= 85 ? 'Highly Likely' : score >= 70 ? 'Likely' : score >= 50 ? 'Possible' : 'Unlikely',
    assessment: {
      strengths: ['Basic eligibility criteria understood'],
      weaknesses: ['Assessment data not available'],
      criticalIssues: [],
      missingRequirements: []
    },
    recommendations: [],
    nextSteps: ['Retake assessment for detailed analysis'],
    riskFactors: [],
    applicationTimeline: 'Unable to estimate without full assessment'
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {getStatusIcon(displayAssessment.eligibilityStatus)}
              <h1 className="text-3xl font-bold">{route.name} Assessment Results</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered analysis based on current UKVI requirements
            </p>
          </div>

          {/* Main Score Card */}
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 ${getScoreBackground(displayAssessment.overallScore)} opacity-10`}></div>
            <CardHeader className="text-center pb-2">
              <div className="space-y-2">
                <div className={`text-6xl font-bold ${getScoreColor(displayAssessment.overallScore)}`}>
                  {displayAssessment.overallScore}%
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-lg px-4 py-1 ${getScoreBackground(displayAssessment.overallScore)}`}
                >
                  {displayAssessment.eligibilityStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={displayAssessment.overallScore} className="w-full h-3" />
              
              {displayAssessment.overallScore >= 85 ? (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Excellent!</strong> You meet most requirements and have a strong chance of visa approval.
                    You can proceed with your application when ready.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <strong>Improvement needed.</strong> Your application has some gaps that should be addressed 
                    before applying to increase your chances of success.
                  </AlertDescription>
                </Alert>
              )}

              {/* Application Timeline */}
              <div className="flex items-center justify-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Ready to apply: {displayAssessment.applicationTimeline}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayAssessment.assessment.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayAssessment.assessment.weaknesses.length > 0 ? (
                    displayAssessment.assessment.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No major weaknesses identified</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Critical Issues */}
          {displayAssessment.assessment.criticalIssues.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>Critical Issues</span>
                </CardTitle>
                <CardDescription>
                  These issues must be resolved before applying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayAssessment.assessment.criticalIssues.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {displayAssessment.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>AI Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Prioritized actions to improve your eligibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayAssessment.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{rec.category}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                          <Badge variant="outline">{rec.timeframe}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          {displayAssessment.overallScore < 85 && actionPlan && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <Target className="w-5 h-5" />
                  <span>Personalized Action Plan Available</span>
                </CardTitle>
                <CardDescription>
                  We've created a {actionPlan.estimatedDays}-day improvement plan to boost your score to 85%+
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{actionPlan.estimatedDays}</div>
                    <div className="text-sm text-muted-foreground">Days to completion</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{actionPlan.tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Actionable tasks</div>
                  </div>
                </div>
                <Button onClick={onStartActionPlan} className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Start Action Plan
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Official Application */}
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <Shield className="w-5 h-5" />
                <span>Official UK Government Application</span>
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                When you're ready to apply, use the official UKVI portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Application Cost</h4>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">£{route.cost}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Processing Time</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">{route.processingTime}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-3">
                  <Button 
                    asChild 
                    className="flex-1"
                    disabled={displayAssessment.overallScore < 60}
                  >
                    <a 
                      href={ukviApplicationUrl || route.ukviUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>Apply Now on GOV.UK</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a 
                      href={route.ukviGuidanceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Read Guidance</span>
                    </a>
                  </Button>
                </div>
                {displayAssessment.overallScore < 60 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      We recommend addressing key eligibility gaps before applying to maximize your chances of success.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" onClick={onRetakeQuiz}>
              Retake Assessment
            </Button>
            <Button variant="outline" onClick={onCheckAnotherRoute}>
              Check Another Route
            </Button>
            <Button variant="outline" onClick={onBack}>
              Back to Results
            </Button>
          </div>

          {/* Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> This AI assessment is for guidance only and does not guarantee visa approval. 
              Immigration rules change regularly. Always consult the latest official UKVI guidance and consider 
              professional immigration advice before applying.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}