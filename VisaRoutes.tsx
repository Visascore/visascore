import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Zap,
  Target,
  Users,
  FileText,
  ArrowRight,
  Eye,
  Brain,
  Lightbulb,
  Award,
  Globe,
  Building,
  GraduationCap,
  Heart,
  Briefcase,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
  Shield,
  Calendar,
  MapPin
} from 'lucide-react';
import { VisaRoute, visaRoutes } from '../data/visaRoutes';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

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

interface VisaRoutesProps {
  authState?: AuthState;
  onSelectRoute: (route: VisaRoute) => void;
  onViewDetails: (route: VisaRoute) => void;
  navigate: (path: string) => void;
}

interface UserPreferences {
  nationality?: string;
  currentLocation?: string;
  hasJobOffer?: boolean;
  educationLevel?: string;
  workExperience?: string;
  familyInUK?: boolean;
  budget?: string;
  urgency?: string;
}

export function VisaRoutes({ authState, onSelectRoute, onViewDetails, navigate }: VisaRoutesProps) {
  // Provide default authState to prevent errors
  const safeAuthState = authState || {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    session: null
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'cost' | 'difficulty' | 'processing' | 'popularity'>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [showPreferencesWizard, setShowPreferencesWizard] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    maxCost: '',
    maxProcessingTime: '',
    difficultyLevel: '',
    hasJobRequirement: false,
    hasEducationRequirement: false
  });

  const supabase = createClient();

  useEffect(() => {
    if (safeAuthState.isAuthenticated) {
      loadUserPreferences();
    }
  }, [safeAuthState.isAuthenticated]);

  useEffect(() => {
    if (Object.keys(userPreferences).length > 0) {
      generateRecommendations();
    }
  }, [userPreferences, safeAuthState.isAuthenticated]);

  const loadUserPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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
        if (data.profile) {
          setUserPreferences({
            nationality: data.profile.nationality,
            currentLocation: data.profile.currentLocation,
            hasJobOffer: data.profile.hasJobOffer,
            educationLevel: data.profile.educationLevel,
            workExperience: data.profile.workExperience,
            familyInUK: data.profile.familyInUK
          });
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const generateRecommendations = async () => {
    if (!safeAuthState.isAuthenticated) return;
    
    setIsLoadingRecommendations(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/ai-recommendations`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userProfile: userPreferences,
            preferences: { includeAlternatives: true, focusOnHighSuccess: true }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Routes', icon: Globe, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    { id: 'work', name: 'Work Visas', icon: Briefcase, color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { id: 'study', name: 'Study Visas', icon: GraduationCap, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
    { id: 'family', name: 'Family Visas', icon: Heart, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' },
    { id: 'visit', name: 'Visit Visas', icon: MapPin, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
    { id: 'business', name: 'Business Visas', icon: Building, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' }
  ];

  const filteredAndSortedRoutes = useMemo(() => {
    let filtered = visaRoutes.filter(route => {
      // Search filter
      if (searchQuery && !route.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !route.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && route.category !== selectedCategory) {
        return false;
      }

      // Advanced filters
      if (selectedFilters.maxCost && parseInt(route.cost) > parseInt(selectedFilters.maxCost)) {
        return false;
      }

      if (selectedFilters.difficultyLevel && route.difficulty !== selectedFilters.difficultyLevel) {
        return false;
      }

      return true;
    });

    // Sort routes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'cost':
          return parseInt(a.cost) - parseInt(b.cost);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'processing':
          return a.processingTime.localeCompare(b.processingTime);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'recommended':
        default:
          // Custom recommendation logic
          if (recommendations) {
            const aRecommended = recommendations.primaryRecommendations?.some((r: any) => r.visaRoute === a.name);
            const bRecommended = recommendations.primaryRecommendations?.some((r: any) => r.visaRoute === b.name);
            if (aRecommended && !bRecommended) return -1;
            if (!aRecommended && bRecommended) return 1;
          }
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return filtered;
  }, [visaRoutes, searchQuery, selectedCategory, sortBy, selectedFilters, recommendations]);

  const getRouteMatchScore = (route: VisaRoute): number => {
    let score = 50; // Base score

    if (recommendations?.primaryRecommendations?.some((r: any) => r.visaRoute === route.name)) {
      score += 40;
    } else if (recommendations?.alternativeOptions?.some((r: any) => r.visaRoute === route.name)) {
      score += 20;
    }

    // Add points based on user preferences
    if (userPreferences.hasJobOffer && route.category === 'work') score += 20;
    if (userPreferences.educationLevel === 'Degree' && route.category === 'study') score += 15;
    if (userPreferences.familyInUK && route.category === 'family') score += 25;

    return Math.min(100, score);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || Globe;
  };

  const getRecommendationLevel = (route: VisaRoute): 'primary' | 'alternative' | 'not-recommended' | null => {
    if (!recommendations) return null;
    
    if (recommendations.primaryRecommendations?.some((r: any) => r.visaRoute === route.name)) {
      return 'primary';
    }
    if (recommendations.alternativeOptions?.some((r: any) => r.visaRoute === route.name)) {
      return 'alternative';
    }
    if (recommendations.notSuitable?.some((r: any) => r.visaRoute === route.name)) {
      return 'not-recommended';
    }
    return null;
  };

  const QuickStart = () => (
    <div className="mb-8">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">AI-powered matching</p>
              </div>
            </div>
            <p className="text-sm mb-4">Get personalized visa route recommendations based on your profile and goals.</p>

          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Quick Assessment</h3>
                <p className="text-sm text-muted-foreground">5-minute eligibility check</p>
              </div>
            </div>
            <p className="text-sm mb-4">Take a quick assessment to see which visa routes you're most likely to qualify for.</p>

          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold">Explore All Routes</h3>
                <p className="text-sm text-muted-foreground">Browse comprehensive guides</p>
              </div>
            </div>
            <p className="text-sm mb-4">Explore detailed information about all UK visa routes with official UKVI guidance.</p>

          </CardContent>
        </Card>
      </div>
    </div>
  );

  const PreferencesWizard = () => (
    <Card className="mb-8 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary" />
          <span>Tell us about yourself for better recommendations</span>
        </CardTitle>
        <CardDescription>
          Help our AI understand your situation to provide the most relevant visa routes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nationality">Current Nationality</Label>
            <Input
              id="nationality"
              value={userPreferences.nationality || ''}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, nationality: e.target.value }))}
              placeholder="e.g., Indian, Nigerian, American"
            />
          </div>
          <div>
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              value={userPreferences.currentLocation || ''}
              onChange={(e) => setUserPreferences(prev => ({ ...prev, currentLocation: e.target.value }))}
              placeholder="e.g., India, Nigeria, USA"
            />
          </div>
          <div>
            <Label htmlFor="education">Highest Education Level</Label>
            <Select 
              value={userPreferences.educationLevel || ''} 
              onValueChange={(value) => setUserPreferences(prev => ({ ...prev, educationLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Professional Qualification">Professional Qualification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="experience">Work Experience</Label>
            <Select 
              value={userPreferences.workExperience || ''} 
              onValueChange={(value) => setUserPreferences(prev => ({ ...prev, workExperience: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2 years">0-2 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="6-10 years">6-10 years</SelectItem>
                <SelectItem value="10+ years">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasJobOffer"
              checked={userPreferences.hasJobOffer || false}
              onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, hasJobOffer: checked as boolean }))}
            />
            <Label htmlFor="hasJobOffer" className="text-sm">I have a UK job offer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="familyInUK"
              checked={userPreferences.familyInUK || false}
              onCheckedChange={(checked) => setUserPreferences(prev => ({ ...prev, familyInUK: checked as boolean }))}
            />
            <Label htmlFor="familyInUK" className="text-sm">I have family in the UK</Label>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={generateRecommendations} disabled={isLoadingRecommendations}>
            {isLoadingRecommendations ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get My Recommendations
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setShowPreferencesWizard(false)}>
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RecommendationsSection = () => {
    if (!recommendations || !safeAuthState.isAuthenticated) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <span>AI Recommendations for You</span>
        </h2>

        {recommendations.primaryRecommendations?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <span>Best Matches</span>
            </h3>
            <div className="grid gap-4">
              {recommendations.primaryRecommendations.slice(0, 2).map((rec: any, index: number) => {
                const route = visaRoutes.find(r => r.name === rec.visaRoute);
                if (!route) return null;

                return (
                  <Card key={route.id} className="border-2 border-green-200 bg-green-50/50 dark:bg-green-900/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{route.name}</h4>
                            <p className="text-sm text-muted-foreground">{route.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {rec.matchScore}% Match
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Why this fits you:</h5>
                          <ul className="text-sm space-y-1">
                            {rec.reasoning?.slice(0, 2).map((reason: string, idx: number) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Quick Info:</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Cost:</span>
                              <span className="font-medium">£{route.cost}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Processing:</span>
                              <span className="font-medium">{route.processingTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Likelihood:</span>
                              <span className="font-medium text-green-600">{rec.likelihood}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button onClick={() => onSelectRoute(route)} className="flex-1">
                          <Target className="w-4 h-4 mr-2" />
                          Start Assessment
                        </Button>
                        <Button variant="outline" onClick={() => onViewDetails(route)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {recommendations.alternativeOptions?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span>Alternative Options</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.alternativeOptions.slice(0, 4).map((rec: any, index: number) => {
                const route = visaRoutes.find(r => r.name === rec.visaRoute);
                if (!route) return null;

                return (
                  <Card key={route.id} className="border border-yellow-200 bg-yellow-50/30 dark:bg-yellow-900/10 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{route.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.matchScore}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.reasoning?.[0]}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onViewDetails(route)}>
                          Learn More
                        </Button>
                        <Button size="sm" onClick={() => onSelectRoute(route)}>
                          Assess
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your UK Visa Route
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the best visa pathway for your unique situation with AI-powered recommendations and real-time eligibility analysis.
          </p>
        </div>

        {/* Quick Start Section */}
        {safeAuthState.isAuthenticated && !recommendations && <QuickStart />}

        {/* Preferences Wizard */}
        {showPreferencesWizard && safeAuthState.isAuthenticated && <PreferencesWizard />}

        {/* AI Recommendations */}
        <RecommendationsSection />

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search visa routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="flex space-x-3">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">🎯 Recommended</SelectItem>
                  <SelectItem value="cost">��� Lowest Cost</SelectItem>
                  <SelectItem value="difficulty">📈 Easiest First</SelectItem>
                  <SelectItem value="processing">⏰ Fastest Processing</SelectItem>
                  <SelectItem value="popularity">⭐ Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Advanced Filters</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxCost">Maximum Cost (£)</Label>
                    <Input
                      id="maxCost"
                      type="number"
                      placeholder="e.g., 2000"
                      value={selectedFilters.maxCost}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, maxCost: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={selectedFilters.difficultyLevel} 
                      onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, difficultyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any difficulty</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => setSelectedFilters({
                      maxCost: '',
                      maxProcessingTime: '',
                      difficultyLevel: '',
                      hasJobRequirement: false,
                      hasEducationRequirement: false
                    })}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedRoutes.length} of {visaRoutes.length} visa routes
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Visa Routes Grid */}
        <div className="grid gap-6">
          {filteredAndSortedRoutes.map(route => {
            const matchScore = getRouteMatchScore(route);
            const recommendationLevel = getRecommendationLevel(route);
            const CategoryIcon = getCategoryIcon(route.category);

            return (
              <Card 
                key={route.id} 
                className={`group hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                  recommendationLevel === 'primary' ? 'border-2 border-green-200 bg-green-50/30 dark:bg-green-900/10' :
                  recommendationLevel === 'alternative' ? 'border border-yellow-200 bg-yellow-50/20 dark:bg-yellow-900/10' :
                  recommendationLevel === 'not-recommended' ? 'opacity-60' :
                  'hover:border-primary/50'
                }`}
              >
                {/* Recommendation Badge */}
                {recommendationLevel === 'primary' && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Star className="w-3 h-3 mr-1" />
                      Top Match
                    </Badge>
                  </div>
                )}
                {recommendationLevel === 'alternative' && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Alternative
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categories.find(c => c.id === route.category)?.color || 'bg-gray-100'}`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold">{route.name}</h3>
                          {safeAuthState.isAuthenticated && matchScore > 70 && (
                            <Badge variant="secondary" className="text-xs">
                              {matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{route.description}</p>
                        
                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-medium">£{route.cost}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{route.processingTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge className={getDifficultyColor(route.difficulty)} variant="secondary">
                              {route.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span>{route.popularity || 0} applicants</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Requirements Preview */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Key Requirements</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      {route.requirements.essential.slice(0, 4).map((req, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{req}</span>
                        </div>
                      ))}
                    </div>
                    {route.requirements.essential.length > 4 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        +{route.requirements.essential.length - 4} more requirements
                      </p>
                    )}
                  </div>

                  {/* Success Indicators */}
                  {safeAuthState.isAuthenticated && matchScore > 60 && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm text-green-800 dark:text-green-200">
                          Good eligibility potential
                        </span>
                      </div>
                      <Progress value={matchScore} className="h-2" />
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => onSelectRoute(route)}
                      className="flex-1 h-11"
                      disabled={!safeAuthState.isAuthenticated}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Start AI Assessment
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => onViewDetails(route)}
                      className="h-11 px-6"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-11 w-11"
                      onClick={() => window.open(route.ukviGuidanceUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  {!safeAuthState.isAuthenticated && (
                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Sign in</strong> to get personalized recommendations and start assessments.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAndSortedRoutes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No visa routes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find relevant visa routes.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedFilters({
                    maxCost: '',
                    maxProcessingTime: '',
                    difficultyLevel: '',
                    hasJobRequirement: false,
                    hasEducationRequirement: false
                  });
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our AI assistant can provide personalized guidance, answer questions about specific visa routes, 
                and help you understand the application process.
              </p>
              <Button onClick={() => navigate('ai-assistant')} size="lg">
                <Brain className="w-5 h-5 mr-2" />
                Chat with AI Assistant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}