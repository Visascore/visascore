import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { 
  CheckCircle2, 
  Target, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Lightbulb,
  Flag,
  Award,
  Loader2
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Task {
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
}

interface Milestone {
  day: number;
  title: string;
  description: string;
}

interface ActionPlan {
  planId: string;
  targetScore: number;
  estimatedDays: number;
  baseScore?: number;
  currentScore?: number;
  completedTasks?: number;
  totalTasks?: number;
  tasks: Task[];
  milestones: Milestone[];
  tips: string[];
  warningNote?: string;
  lastUpdated?: string;
}

interface ActionPlanProps {
  route: any;
  answers: any[];
  initialScore: number;
  onBack: () => void;
  onScoreUpdate: (newScore: number) => void;
}

export function ActionPlan({
  route,
  answers,
  initialScore,
  onBack,
  onScoreUpdate
}: ActionPlanProps) {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialScore);

  const supabase = createClient();

  useEffect(() => {
    loadActionPlan();
  }, []);

  const loadActionPlan = async () => {
    try {
      // First try to load from localStorage
      const storedAssessment = localStorage.getItem('lastAssessment');
      if (storedAssessment) {
        const parsedData = JSON.parse(storedAssessment);
        if (parsedData.actionPlan) {
          const plan = parsedData.actionPlan;
          plan.baseScore = initialScore;
          plan.currentScore = calculateCurrentScore(plan);
          setActionPlan(plan);
          setCurrentScore(plan.currentScore);
          setIsLoading(false);
          return;
        }
      }

      // If no stored plan, try to load from backend
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/latest-assessment`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.assessment && data.assessment.actionPlan) {
            const plan = data.assessment.actionPlan;
            plan.baseScore = initialScore;
            plan.currentScore = calculateCurrentScore(plan);
            setActionPlan(plan);
            setCurrentScore(plan.currentScore);
          }
        }
      }
    } catch (error) {
      console.error('Error loading action plan:', error);
      toast.error('Failed to load action plan');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCurrentScore = (plan: ActionPlan): number => {
    if (!plan.tasks) return plan.baseScore || initialScore;
    
    const completedTasks = plan.tasks.filter(task => task.completed);
    const totalScoreIncrease = completedTasks.reduce((sum, task) => sum + task.scoreImpact, 0);
    return Math.min(100, (plan.baseScore || initialScore) + totalScoreIncrease);
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    if (!actionPlan) return;

    setIsUpdating(true);

    try {
      // Update local state immediately for responsive UI
      const updatedTasks = actionPlan.tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      );
      
      const updatedPlan = {
        ...actionPlan,
        tasks: updatedTasks,
        lastUpdated: new Date().toISOString()
      };

      const newScore = calculateCurrentScore(updatedPlan);
      updatedPlan.currentScore = newScore;
      updatedPlan.completedTasks = updatedTasks.filter(t => t.completed).length;

      setActionPlan(updatedPlan);
      setCurrentScore(newScore);
      onScoreUpdate(newScore);

      // Update localStorage
      const storedAssessment = localStorage.getItem('lastAssessment');
      if (storedAssessment) {
        const parsedData = JSON.parse(storedAssessment);
        parsedData.actionPlan = updatedPlan;
        localStorage.setItem('lastAssessment', JSON.stringify(parsedData));
      }

      // Update backend if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session && actionPlan.planId) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/update-action-plan`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              planId: actionPlan.planId,
              taskId,
              completed
            })
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (completed) {
            toast.success(`Task completed! Score increased by ${result.scoreChange}`);
          } else {
            toast.info(`Task unmarked. Score decreased by ${result.scoreChange}`);
          }
        }
      } else {
        // Offline feedback
        const task = updatedTasks.find(t => t.id === taskId);
        if (task) {
          if (completed) {
            toast.success(`Task completed! Score increased by +${task.scoreImpact} points`);
          } else {
            toast.info(`Task unmarked. Score decreased by -${task.scoreImpact} points`);
          }
        }
      }

    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      
      // Revert local changes on error
      loadActionPlan();
    } finally {
      setIsUpdating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const completedTasksCount = actionPlan?.tasks.filter(task => task.completed).length || 0;
  const totalTasks = actionPlan?.tasks.length || 0;
  const completionPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your action plan...</p>
        </div>
      </div>
    );
  }

  if (!actionPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Action Plan Not Available</h2>
          <p className="text-muted-foreground max-w-md">
            No action plan was generated for your assessment. This usually happens when your score is already above 85%.
          </p>
          <Button onClick={onBack}>Back to Assessment</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Button>
            <Badge variant="secondary">
              {actionPlan.estimatedDays} Day Plan
            </Badge>
          </div>

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Your Personalized Action Plan</h1>
            <p className="text-muted-foreground">
              Follow this AI-generated plan to boost your {route.name} eligibility score to 85%+
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
            <CardHeader className="relative">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
                    {currentScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {actionPlan.targetScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Target Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {completedTasksCount}/{totalTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">Tasks Complete</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {actionPlan.estimatedDays}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Target</span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              {currentScore >= 85 && (
                <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    🎉 <strong>Congratulations!</strong> You've reached the target score! 
                    You're now ready to submit your visa application.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Warning Note */}
          {actionPlan.warningNote && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Important:</strong> {actionPlan.warningNote}
              </AlertDescription>
            </Alert>
          )}

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Action Items</span>
              </CardTitle>
              <CardDescription>
                Complete these tasks to improve your eligibility score. Higher priority items have more impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionPlan.tasks
                  .sort((a, b) => {
                    // Sort by priority first, then by score impact
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    const aPriority = priorityOrder[a.priority] || 0;
                    const bPriority = priorityOrder[b.priority] || 0;
                    if (aPriority !== bPriority) return bPriority - aPriority;
                    return b.scoreImpact - a.scoreImpact;
                  })
                  .map((task, index) => (
                  <Card 
                    key={task.id} 
                    className={`transition-all duration-200 ${task.completed ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="pt-1">
                          <Checkbox
                            id={task.id}
                            checked={task.completed}
                            onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                            disabled={isUpdating}
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getDifficultyColor(task.difficulty)}>
                                {task.difficulty}
                              </Badge>
                              <Badge variant="secondary">
                                +{task.scoreImpact} pts
                              </Badge>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Estimated time: {task.estimatedDays} days</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Flag className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Category: {task.category}</span>
                              </div>
                            </div>

                            {task.requirements.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-1">Requirements:</h5>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {task.requirements.slice(0, 2).map((req, idx) => (
                                    <li key={idx}>• {req}</li>
                                  ))}
                                  {task.requirements.length > 2 && (
                                    <li>• +{task.requirements.length - 2} more...</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {task.resources.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">Helpful Resources:</h5>
                              <div className="flex flex-wrap gap-2">
                                {task.resources.slice(0, 3).map((resource, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => {
                                      if (resource.startsWith('http')) {
                                        window.open(resource, '_blank');
                                      } else {
                                        toast.info(resource);
                                      }
                                    }}
                                  >
                                    {resource.includes('http') ? (
                                      <>
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        Resource {idx + 1}
                                      </>
                                    ) : (
                                      resource.substring(0, 20) + (resource.length > 20 ? '...' : '')
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          {actionPlan.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Key Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionPlan.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {milestone.day}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          {actionPlan.tips.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <Lightbulb className="w-5 h-5" />
                  <span>Pro Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {actionPlan.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-blue-700 dark:text-blue-300">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Last Updated */}
          {actionPlan.lastUpdated && (
            <div className="text-center text-sm text-muted-foreground">
              Last updated: {new Date(actionPlan.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}