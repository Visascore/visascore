import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star,
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Lightbulb,
  Heart,
  Zap,
  Map,
  AlertCircle,
  Gift,
  Plus,
  RotateCcw,
  Flame,
  Award,
  ChevronRight,
  X,
  Loader2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Assessment {
  id: string;
  visaType: string;
  score: number;
  completedAt: string;
  status: 'completed' | 'in-progress' | 'recommended';
  nextSteps?: string[];
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: 'preparation' | 'research' | 'documentation' | 'skill-building' | 'networking';
  priority: 'high' | 'medium' | 'low';
  points: number;
  estimatedTime: string;
  completed: boolean;
  completedAt?: string;
  dueDate: string;
  visaRoute?: string;
  aiGenerated: boolean;
}

interface UserProgress {
  totalPoints: number;
  currentStreak: number;
  lastActivityDate: string;
  completedTasks: string[];
  level: number;
  achievements: string[];
  weeklyGoal: number;
  dailyTasksCompleted: number;
}

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any;
}

interface UserProfile {
  name: string;
  email: string;
  completed_onboarding: boolean;
  [key: string]: any;
}

interface Subscription {
  status: string;
  plan: string;
  trial_end?: string;
  current_period_end?: string;
  is_expired?: boolean;
  days_remaining?: number;
}

interface UserDashboardProps {
  authState: AuthState;
  userProfile: UserProfile | null;
  subscription: Subscription | null;
  navigate: (path: string) => void;
}

export function UserDashboard({ 
  authState,
  userProfile,
  subscription,
  navigate
}: UserDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    currentStreak: 0,
    lastActivityDate: '',
    completedTasks: [],
    level: 1,
    achievements: [],
    weeklyGoal: 5,
    dailyTasksCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'preparation' as const,
    priority: 'medium' as const,
    estimatedTime: '30 minutes'
  });
  const [generatingTasks, setGeneratingTasks] = useState(false);

  // Safety check for user object
  if (!authState.isAuthenticated || !authState.user || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-8 mobile-container">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl mb-2">Loading your dashboard...</h2>
              <p className="text-muted-foreground">Please wait while we set up your account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    console.log('UserDashboard mounting with user:', authState.user);
    loadDashboardData();
  }, [authState.user]);

  const loadDashboardData = async () => {
    console.log('Loading dashboard data...');
    setLoading(true);
    try {
      // Load user progress
      const savedProgress = localStorage.getItem(`user-progress-${authState.user?.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }

      // Load daily tasks
      const savedTasks = localStorage.getItem(`daily-tasks-${authState.user?.id}`);
      if (savedTasks) {
        setDailyTasks(JSON.parse(savedTasks));
      } else {
        // Generate initial AI-powered tasks
        await generateAITasks();
      }

      // Load mock assessments
      const mockAssessments: Assessment[] = [
        {
          id: '1',
          visaType: 'Global Talent',
          score: 78,
          completedAt: '2025-01-18',
          status: 'completed',
          nextSteps: ['Prepare portfolio', 'Get endorsement', 'Submit application']
        },
        {
          id: '2',
          visaType: 'Skilled Worker',
          score: 65,
          completedAt: '2025-01-15',
          status: 'completed',
          nextSteps: ['Find sponsor', 'Improve English score', 'Gather documents']
        },
        {
          id: '3',
          visaType: 'Student Visa',
          score: 0,
          completedAt: '',
          status: 'recommended'
        }
      ];

      setAssessments(mockAssessments);
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      console.log('Dashboard loading complete');
    }
  };

  const generateAITasks = async () => {
    setGeneratingTasks(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/generate-daily-tasks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: authState.user?.id,
            userProfile: {
              name: userProfile?.name,
              completedAssessments: assessments.filter(a => a.status === 'completed'),
              currentLevel: userProgress.level,
              preferences: 'UK visa preparation'
            }
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.tasks) {
          setDailyTasks(result.tasks);
          localStorage.setItem(`daily-tasks-${authState.user?.id}`, JSON.stringify(result.tasks));
          toast.success('AI generated personalized tasks for you!');
        }
      } else {
        throw new Error('Failed to generate tasks');
      }
    } catch (error) {
      console.error('Error generating AI tasks:', error);
      // Fallback to default tasks
      const defaultTasks: DailyTask[] = [
        {
          id: '1',
          title: 'Research UK visa requirements',
          description: 'Spend 30 minutes reading official UKVI guidance for your target visa route',
          category: 'research',
          priority: 'high',
          points: 50,
          estimatedTime: '30 minutes',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          aiGenerated: false
        },
        {
          id: '2',
          title: 'Update your CV',
          description: 'Review and update your CV with recent achievements and skills',
          category: 'documentation',
          priority: 'medium',
          points: 40,
          estimatedTime: '45 minutes',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          aiGenerated: false
        },
        {
          id: '3',
          title: 'Practice English vocabulary',
          description: 'Learn 10 new professional English words relevant to your field',
          category: 'skill-building',
          priority: 'medium',
          points: 30,
          estimatedTime: '20 minutes',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          aiGenerated: false
        }
      ];
      setDailyTasks(defaultTasks);
      localStorage.setItem(`daily-tasks-${authState.user?.id}`, JSON.stringify(defaultTasks));
    } finally {
      setGeneratingTasks(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    // Update task completion
    const updatedTasks = dailyTasks.map(t => 
      t.id === taskId 
        ? { ...t, completed: true, completedAt: new Date().toISOString() }
        : t
    );
    setDailyTasks(updatedTasks);
    localStorage.setItem(`daily-tasks-${authState.user?.id}`, JSON.stringify(updatedTasks));

    // Update user progress
    const newProgress = {
      ...userProgress,
      totalPoints: userProgress.totalPoints + task.points,
      completedTasks: [...userProgress.completedTasks, taskId],
      lastActivityDate: new Date().toISOString(),
      currentStreak: calculateStreak(userProgress.lastActivityDate),
      level: Math.floor((userProgress.totalPoints + task.points) / 100) + 1,
      dailyTasksCompleted: userProgress.dailyTasksCompleted + 1
    };

    // Check for achievements
    const newAchievements = checkAchievements(newProgress, userProgress);
    if (newAchievements.length > 0) {
      newProgress.achievements = [...userProgress.achievements, ...newAchievements];
    }

    setUserProgress(newProgress);
    localStorage.setItem(`user-progress-${authState.user?.id}`, JSON.stringify(newProgress));

    // Send to backend
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/update-user-progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: authState.user?.id,
            taskId,
            pointsEarned: task.points,
            progress: newProgress
          })
        }
      );
    } catch (error) {
      console.error('Error updating backend progress:', error);
    }

    // Show celebration
    toast.success(`🎉 +${task.points} points! Task completed!`);

    // Show special celebrations for milestones
    if (newAchievements.length > 0) {
      setTimeout(() => {
        newAchievements.forEach(achievement => {
          toast.success(`🏆 Achievement unlocked: ${achievement}!`);
        });
      }, 500);
    }
  };

  const calculateStreak = (lastActivityDate: string) => {
    if (!lastActivityDate) return 1;
    
    const lastActivity = new Date(lastActivityDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return userProgress.currentStreak; // Same day
    if (diffDays === 1) return userProgress.currentStreak + 1; // Next day
    return 1; // Streak broken
  };

  const checkAchievements = (newProgress: UserProgress, oldProgress: UserProgress) => {
    const achievements: string[] = [];
    
    if (newProgress.totalPoints >= 100 && oldProgress.totalPoints < 100) {
      achievements.push('First 100 Points');
    }
    if (newProgress.currentStreak >= 7 && oldProgress.currentStreak < 7) {
      achievements.push('Week Warrior');
    }
    if (newProgress.level >= 5 && oldProgress.level < 5) {
      achievements.push('Rising Star');
    }
    if (newProgress.dailyTasksCompleted >= 10 && oldProgress.dailyTasksCompleted < 10) {
      achievements.push('Task Master');
    }
    
    return achievements;
  };

  const handleAddCustomTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const task: DailyTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      points: newTask.priority === 'high' ? 60 : newTask.priority === 'medium' ? 40 : 20,
      estimatedTime: newTask.estimatedTime,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      aiGenerated: false
    };

    const updatedTasks = [...dailyTasks, task];
    setDailyTasks(updatedTasks);
    localStorage.setItem(`daily-tasks-${authState.user?.id}`, JSON.stringify(updatedTasks));

    setNewTask({
      title: '',
      description: '',
      category: 'preparation',
      priority: 'medium',
      estimatedTime: '30 minutes'
    });
    setShowAddTask(false);
    toast.success('Custom task added!');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    return `Good evening, ${name}! 🌙`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research': return <BookOpen className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'skill-building': return <TrendingUp className="w-4 h-4" />;
      case 'networking': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const todaysTasks = dailyTasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]);
  const completedToday = todaysTasks.filter(task => task.completed).length;
  const dailyProgress = todaysTasks.length > 0 ? (completedToday / todaysTasks.length) * 100 : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Loading your dashboard...</h3>
              <p className="text-muted-foreground">Setting up your personalized experience</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Avatar className="h-16 w-16 border-4 border-primary/20">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.name || 'user'}`} />
            <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {getInitials(userProfile?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl mb-2">{getGreeting()}</h1>
            <p className="text-muted-foreground text-lg">
              {userProgress.currentStreak > 0 && `🔥 ${userProgress.currentStreak} day streak! `}
              Keep building your UK visa journey!
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-semibold text-primary">{userProgress.totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-2xl font-semibold text-orange-600">{userProgress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-2xl font-semibold text-green-600">{completedToday}</div>
              <div className="text-sm text-muted-foreground">Tasks Today</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-semibold text-purple-600">{userProgress.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="today" className="text-xs sm:text-sm">Today's Tasks</TabsTrigger>
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="assessments" className="text-xs sm:text-sm">Assessments</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Daily Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Today's Progress</span>
                </CardTitle>
                <Badge variant="outline">
                  {completedToday}/{todaysTasks.length} completed
                </Badge>
              </div>
              <CardDescription>
                Complete daily tasks to build momentum and earn points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Goal Progress</span>
                    <span>{Math.round(dailyProgress)}%</span>
                  </div>
                  <Progress value={dailyProgress} className="h-3" />
                </div>
                
                {dailyProgress === 100 && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      🎉 Amazing! You've completed all your tasks for today!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Today's Tasks</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddTask(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAITasks}
                    disabled={generatingTasks}
                  >
                    {generatingTasks ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    AI Tasks
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {todaysTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all ${
                        task.completed 
                          ? 'opacity-60 bg-green-50 border-green-200 dark:bg-green-900/20' 
                          : getPriorityColor(task.priority)
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`mt-1 h-6 w-6 p-0 rounded-full ${
                            task.completed 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'hover:bg-primary/10'
                          }`}
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={task.completed}
                        >
                          {task.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-muted-foreground rounded-full" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {task.aiGenerated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Zap className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                +{task.points} pts
                              </Badge>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm mb-2 ${task.completed ? 'text-muted-foreground' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              {getCategoryIcon(task.category)}
                              <span className="capitalize">{task.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedTime}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                task.priority === 'high' ? 'border-red-300 text-red-600' :
                                task.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                'border-green-300 text-green-600'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.completed && task.completedAt && (
                            <div className="mt-2 text-xs text-green-600">
                              ✅ Completed {new Date(task.completedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {todaysTasks.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tasks for today</h3>
                    <p className="text-muted-foreground mb-4">
                      Add custom tasks or let AI generate personalized tasks for you
                    </p>
                    <Button onClick={generateAITasks} disabled={generatingTasks}>
                      {generatingTasks ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      Generate AI Tasks
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Task Modal */}
          <AnimatePresence>
            {showAddTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddTask(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-background rounded-lg max-w-md w-full p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add Custom Task</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddTask(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Task Title</label>
                      <Input
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="e.g., Review visa documentation"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Brief description of the task..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select
                          value={newTask.category}
                          onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                          className="mt-1 w-full p-2 border border-input rounded-md bg-background"
                        >
                          <option value="preparation">Preparation</option>
                          <option value="research">Research</option>
                          <option value="documentation">Documentation</option>
                          <option value="skill-building">Skill Building</option>
                          <option value="networking">Networking</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                          className="mt-1 w-full p-2 border border-input rounded-md bg-background"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Estimated Time</label>
                      <Input
                        value={newTask.estimatedTime}
                        onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                        placeholder="e.g., 30 minutes"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button onClick={handleAddCustomTask} className="flex-1">
                        Add Task
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddTask(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions for You</span>
              </CardTitle>
              <CardDescription>
                Based on your progress, here's what you can do next
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate('/ai-assistant')}
                  className="h-auto p-4 flex-col space-y-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <span className="text-sm">Try New Assessment</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/action-plan/1')}
                  className="h-auto p-4 flex-col space-y-2 border-2 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Continue Action Plan</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/ai-assistant')}
                  className="h-auto p-4 flex-col space-y-2 border-2 border-blue-200 hover:bg-blue-50"
                >
                  <Heart className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Get Personal Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="h-5 w-5 text-blue-500" />
                <span>Your Visa Journey Map</span>
              </CardTitle>
              <CardDescription>
                Track your progress across different visa routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      assessment.status === 'completed' ? 'bg-green-100 text-green-600' :
                      assessment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {assessment.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                       assessment.status === 'in-progress' ? <Clock className="h-6 w-6" /> :
                       <Target className="h-6 w-6" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{assessment.visaType}</h3>
                        {assessment.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            {assessment.score}% match
                          </Badge>
                        )}
                      </div>
                      
                      {assessment.nextSteps && (
                        <div className="text-xs text-muted-foreground">
                          Next: {assessment.nextSteps[0]}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant={assessment.status === 'completed' ? 'outline' : 'default'}
                      onClick={() => 
                        assessment.status === 'completed' 
                          ? navigate(`/action-plan/${assessment.id}`)
                          : navigate('/ai-assistant')
                      }
                    >
                      {assessment.status === 'completed' ? 'Action Plan' :
                       assessment.status === 'in-progress' ? 'Continue' : 'Start'}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="grid gap-6">
            {assessments.filter(a => a.status === 'completed').map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span>{assessment.visaType} Assessment</span>
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {assessment.score}% match
                      </Badge>
                    </div>
                    <CardDescription>
                      Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Eligibility Score</span>
                          <span className="font-medium">{assessment.score}%</span>
                        </div>
                        <Progress value={assessment.score} className="h-2" />
                      </div>
                      
                      {assessment.nextSteps && (
                        <div>
                          <p className="font-medium text-sm mb-2">Recommended next steps:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {assessment.nextSteps.slice(0, 3).map((step, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="pt-4 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/action-plan/${assessment.id}`)}
                        >
                          View Action Plan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate('/ai-assistant')}
                        >
                          Retake Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Achievements */}
          {userProgress.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span>Your Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userProgress.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{achievement}</h4>
                          <p className="text-sm text-muted-foreground">Achievement unlocked!</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Personalized Insights for {userProfile?.name?.split(' ')[0] || 'You'}</span>
              </CardTitle>
              <CardDescription>
                AI-powered recommendations based on your activity and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-sm">
                      Your consistency is excellent! With {userProgress.currentStreak} days in a row, you're building strong momentum toward your UK visa goals.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm">
                      You're at Level {userProgress.level}! Focus on high-priority tasks to level up faster and unlock new opportunities.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm">
                      Based on your completed assessments, consider focusing on the Global Talent visa route for the highest success probability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}