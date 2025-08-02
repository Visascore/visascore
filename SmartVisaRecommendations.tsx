import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { 
  Filter, 
  Search, 
  Sparkles, 
  Target, 
  Brain, 
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Plane,
  TrendingUp,
  Star,
  Zap
} from "lucide-react";
import { VisaRoute, visaRoutes } from "../data/visaRoutes";
import { motion, AnimatePresence } from "framer-motion";

interface SmartVisaRecommendationsProps {
  onRouteSelected: (route: VisaRoute) => void;
  onStartAssessment: (route: VisaRoute) => void;
}

interface FilterOptions {
  category: string[];
  difficulty: string[];
  processingTime: string[];
  searchTerm: string;
  minMatchScore: number;
}

interface EnhancedRoute extends VisaRoute {
  matchScore: number;
  trending: boolean;
  recommended: boolean;
  tags: string[];
}

const categoryIcons = {
  Work: Briefcase,
  Education: GraduationCap,
  Family: Heart,
  Business: Users,
  Visit: Plane,
};

const difficultyColors = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export function SmartVisaRecommendations({ onRouteSelected, onStartAssessment }: SmartVisaRecommendationsProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    difficulty: [],
    processingTime: [],
    searchTerm: '',
    minMatchScore: 0
  });
  
  const [enhancedRoutes, setEnhancedRoutes] = useState<EnhancedRoute[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'difficulty' | 'processing'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Enhance routes with AI-generated data
    const enhanced = visaRoutes.map((route, index) => ({
      ...route,
      matchScore: Math.floor(Math.random() * 40) + 60, // Simulate AI matching
      trending: Math.random() > 0.7,
      recommended: Math.random() > 0.8,
      tags: generateTags(route)
    }));
    
    setEnhancedRoutes(enhanced);
  }, []);

  const generateTags = (route: VisaRoute): string[] => {
    const tags: string[] = [];
    
    if (route.minSalary) {
      tags.push(`£${route.minSalary.toLocaleString()}+ salary`);
    }
    
    if (route.difficulty === 'Easy') {
      tags.push('Quick process');
    }
    
    if (route.processingTime.includes('3')) {
      tags.push('Fast processing');
    }
    
    if (route.category === 'Work') {
      tags.push('Career growth');
    }
    
    if (route.category === 'Education') {
      tags.push('Study path');
    }
    
    if (route.id === 'global-talent') {
      tags.push('No job offer needed');
    }
    
    return tags;
  };

  const filteredRoutes = enhancedRoutes.filter(route => {
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(route.category)) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(route.difficulty)) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        route.name.toLowerCase().includes(searchLower) ||
        route.description.toLowerCase().includes(searchLower) ||
        route.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Match score filter
    if (route.matchScore < filters.minMatchScore) {
      return false;
    }
    
    return true;
  });

  const sortedRoutes = filteredRoutes.sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.matchScore - a.matchScore;
      case 'difficulty':
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'processing':
        return a.processingTime.localeCompare(b.processingTime);
      default:
        return 0;
    }
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFilter = (key: 'category' | 'difficulty' | 'processingTime', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      difficulty: [],
      processingTime: [],
      searchTerm: '',
      minMatchScore: 0
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">UK Visa Routes</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all available UK visa routes with AI-powered matching and personalized recommendations
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Smart Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search visas..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Match Score */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Match Score: {filters.minMatchScore}%
                  </label>
                  <Slider
                    value={[filters.minMatchScore]}
                    onValueChange={(value) => handleFilterChange('minMatchScore', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Work', 'Education', 'Family', 'Business', 'Visit'].map(category => (
                      <Button
                        key={category}
                        variant={filters.category.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilter('category', category)}
                        className="text-xs"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {['Easy', 'Medium', 'Hard'].map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={filters.difficulty.includes(difficulty) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilter('difficulty', difficulty)}
                        className="text-xs"
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={clearFilters}
                  variant="ghost"
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Global Talent visa applications are up 40% this month
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Recommended</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on current trends, consider Skilled Worker visa
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRoutes.length} of {enhancedRoutes.length} visas
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="processing">Sort by Processing Time</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="grid gap-6">
              <AnimatePresence>
                {sortedRoutes.map((route, index) => {
                  const CategoryIcon = categoryIcons[route.category as keyof typeof categoryIcons];
                  
                  return (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <CategoryIcon className="h-6 w-6 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{route.name}</h3>
                                  {route.trending && (
                                    <Badge className="bg-orange-100 text-orange-800">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Trending
                                    </Badge>
                                  )}
                                  {route.recommended && (
                                    <Badge className="bg-green-100 text-green-800">
                                      <Star className="h-3 w-3 mr-1" />
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-muted-foreground mb-3">{route.description}</p>
                                
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{route.processingTime}</span>
                                  </div>
                                  <Badge 
                                    className={`${difficultyColors[route.difficulty]} border-0`}
                                  >
                                    {route.difficulty}
                                  </Badge>
                                  <Badge variant="outline">
                                    {route.category}
                                  </Badge>
                                </div>
                                
                                {route.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {route.tags.slice(0, 3).map((tag, i) => (
                                      <Badge key={`${route.id}-tag-${i}`} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                                route.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                                route.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                <Brain className="h-3 w-3 mr-1" />
                                {route.matchScore}% match
                              </div>
                              
                              {route.minSalary && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  <span>£{route.minSalary.toLocaleString()}+</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                {route.requirements.length} requirements
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onRouteSelected(route)}
                              >
                                Learn More
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onStartAssessment(route)}
                                className="group"
                              >
                                <Zap className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                                Quick Assessment
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {filteredRoutes.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No visas found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}