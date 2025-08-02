import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import {
  User,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Edit,
  Check,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Users,
  Award,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Settings,
  Bell,
  Shield,
  Palette,
  Save,
  RefreshCw,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Home
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface VisaScore {
  skilledWorker: number;
  globalTalent: number;
  student: number;
  graduate: number;
  family: number;
  investor: number;
}

interface Recommendation {
  visaType: string;
  score: number;
  level: 'high' | 'medium' | 'low';
  message: string;
  nextSteps: string[];
}

interface UserProfileProps {
  userProfile: any;
  authState: any;
  onProfileUpdate?: () => void;
  updateUserProfile?: (data: any) => Promise<any>;
  updateSettings?: (data: any) => Promise<any>;
  navigate?: (page: string, params?: any) => void;
}

export function UserProfile({ userProfile, authState, onProfileUpdate, updateUserProfile, updateSettings, navigate }: UserProfileProps) {
  const [visaScores, setVisaScores] = useState<VisaScore | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: userProfile?.name || '',
    country: userProfile?.country || '',
    profession: userProfile?.profession || '',
    age: userProfile?.age || '',
    ...userProfile
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [showPersonalData, setShowPersonalData] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('notifications');

  useEffect(() => {
    if (authState?.session?.access_token && userProfile?.completed_onboarding) {
      loadVisaScores();
    } else {
      setLoading(false);
    }
  }, [authState?.session, userProfile]);

  // Update editedProfile when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        name: userProfile.name || '',
        country: userProfile.country || '',
        profession: userProfile.profession || '',
        age: userProfile.age || '',
        ...userProfile
      });
    }
  }, [userProfile]);

  const loadVisaScores = async () => {
    try {
      // Try to load from backend first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/auth/visa-scores`,
        {
          headers: {
            'Authorization': `Bearer ${authState?.session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVisaScores(data.scores);
        setRecommendations(data.recommendations || []);
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.log('Backend not available, loading from local storage:', error);
      
      // Fallback to local storage
      try {
        const localData = localStorage.getItem('visa-score-onboarding');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (parsed.onboardingData) {
            // Recalculate scores from onboarding data
            const scores = calculateBasicScores(parsed.onboardingData);
            const recommendations = generateBasicRecommendations(scores);
            setVisaScores(scores);
            setRecommendations(recommendations);
          }
        } else {
          // No local data available
          console.log('No local onboarding data found');
        }
      } catch (localError) {
        console.error('Error loading local data:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Basic local scoring function (simplified version)
  const calculateBasicScores = (onboardingData: any) => {
    const { personalInfo, background } = onboardingData;
    const scores: any = {};
    
    // Simple scoring based on profile
    let baseScore = 30;
    
    // Education bonus
    if (background.education === 'phd') baseScore += 25;
    else if (background.education === 'masters') baseScore += 20;
    else if (background.education === 'bachelors') baseScore += 15;
    
    // Work experience bonus
    if (background.workExperience === '10+') baseScore += 20;
    else if (background.workExperience === '6-10') baseScore += 15;
    else if (background.workExperience === '4-5') baseScore += 10;
    
    // English level bonus
    if (background.englishLevel === 'native' || background.englishLevel === 'advanced') baseScore += 15;
    else if (background.englishLevel === 'intermediate') baseScore += 10;
    
    // Age bonus
    if (personalInfo.age === '18-25' || personalInfo.age === '26-30') baseScore += 10;
    
    scores.skilledWorker = Math.min(90, baseScore);
    scores.globalTalent = Math.min(85, baseScore - 10);
    scores.student = Math.min(80, baseScore - 5);
    scores.graduate = Math.min(75, baseScore - 15);
    scores.family = background.familyTies && background.familyTies !== 'none' ? Math.min(70, baseScore) : 20;
    scores.investor = personalInfo.profession.toLowerCase().includes('business') ? Math.min(65, baseScore) : 30;
    
    return scores;
  };

  // Basic recommendations generator
  const generateBasicRecommendations = (scores: any) => {
    const recommendations = [];
    const sortedScores = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3);

    for (const [visaType, score] of sortedScores) {
      if (score as number > 50) {
        recommendations.push({
          visaType,
          score: score as number,
          level: (score as number) > 70 ? 'high' : 'medium',
          message: `You have good potential for ${visaType} visa with ${score}% compatibility`,
          nextSteps: [`Research ${visaType} visa requirements`, `Prepare necessary documents`, `Consider professional consultation`]
        });
      }
    }

    return recommendations;
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      if (updateUserProfile) {
        // Use the provided update function from useAuth
        const result = await updateUserProfile(editedProfile);
        if (result.success) {
          setEditing(false);
          if (onProfileUpdate) onProfileUpdate();
          await loadVisaScores();
        }
      } else {
        // Fallback to direct API call
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/user/profile`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authState?.session?.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedProfile)
          }
        );

        if (response.ok) {
          toast.success('Profile updated successfully');
          setEditing(false);
          if (onProfileUpdate) onProfileUpdate();
          await loadVisaScores();
        } else {
          throw new Error('Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (settingKey: string, value: any) => {
    try {
      setSettingsLoading(true);
      
      const newSettings = {
        ...userProfile?.settings,
        [settingKey]: value
      };

      if (updateSettings) {
        const result = await updateSettings(newSettings);
        if (result.success && onProfileUpdate) {
          onProfileUpdate();
        }
      } else {
        toast.error('Settings update not available');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const exportUserData = () => {
    const dataToExport = {
      profile: userProfile,
      visaScores: visaScores,
      recommendations: recommendations,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visa-score-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Your data has been exported successfully');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const formatVisaTypeName = (type: string) => {
    const names: any = {
      skilledWorker: 'Skilled Worker',
      globalTalent: 'Global Talent',
      student: 'Student Visa',
      graduate: 'Graduate Route',
      family: 'Family Visa',
      investor: 'Investor/Start-up'
    };
    return names[type] || type;
  };

  if (!userProfile?.completed_onboarding) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
            <p className="text-muted-foreground mb-6">
              Complete the onboarding process to see your personalized visa scores and recommendations.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Complete Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{userProfile.country}</span>
                  <span className="text-border">•</span>
                  <Briefcase className="w-4 h-4" />
                  <span>{userProfile.profession}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setEditing(!editing)}
              disabled={loading}
            >
              <Edit className="w-4 h-4 mr-2" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>

        {editing && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedProfile.name || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editedProfile.country || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={editedProfile.profession || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, profession: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="age">Age Range</Label>
                <select
                  id="age"
                  value={editedProfile.age || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="18-25">18-25</option>
                  <option value="26-30">26-30</option>
                  <option value="31-35">31-35</option>
                  <option value="36-40">36-40</option>
                  <option value="41-45">41-45</option>
                  <option value="46+">46+</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSaveProfile} disabled={loading}>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="scores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scores">Visa Scores</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Visa Scores Tab */}
        <TabsContent value="scores" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Calculating your visa scores...</p>
              </CardContent>
            </Card>
          ) : visaScores ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(visaScores).map(([type, score]) => (
                <Card key={type} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{formatVisaTypeName(type)}</span>
                      <Badge variant={score >= 60 ? 'default' : 'secondary'}>
                        {getScoreLevel(score)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </span>
                        <Trophy className={`w-6 h-6 ${getScoreColor(score)}`} />
                      </div>
                      <Progress value={score} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {score >= 80 && 'Excellent compatibility for this visa route'}
                        {score >= 60 && score < 80 && 'Good match with some areas to improve'}
                        {score >= 40 && score < 60 && 'Potential match with preparation needed'}
                        {score < 40 && 'Consider improving key qualifications'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Scores Available</h3>
                <p className="text-muted-foreground">
                  Complete your profile to see personalized visa scores.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {recommendations.length > 0 ? (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span>{formatVisaTypeName(rec.visaType)}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={rec.level === 'high' ? 'default' : rec.level === 'medium' ? 'secondary' : 'outline'}
                        >
                          {rec.score}% Match
                        </Badge>
                        <Badge variant="outline">{rec.level} Priority</Badge>
                      </div>
                    </div>
                    <CardDescription>{rec.message}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        Next Steps:
                      </h4>
                      <ul className="space-y-2">
                        {rec.nextSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground">
                  Complete your visa scoring assessment to get personalized recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Profile Details Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-sm">{userProfile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{userProfile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                    <p className="text-sm">{userProfile.country}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Age Range</Label>
                    <p className="text-sm">{userProfile.age}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Profession</Label>
                    <p className="text-sm">{userProfile.profession}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Background Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.background && (
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Education</Label>
                      <p className="text-sm capitalize">{userProfile.background.education?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Work Experience</Label>
                      <p className="text-sm">{userProfile.background.workExperience} years</p>
                    </div>
                    {userProfile.background.workSector && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Work Sector</Label>
                        <p className="text-sm capitalize">{userProfile.background.workSector.replace('_', ' ')}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">English Level</Label>
                      <p className="text-sm capitalize">{userProfile.background.englishLevel}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Family Ties</Label>
                      <p className="text-sm capitalize">{userProfile.background.familyTies || 'None'}</p>
                    </div>
                    {userProfile.background.qualificationCountry && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Qualification Country</Label>
                        <p className="text-sm">{userProfile.background.qualificationCountry}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visa Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Visa Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.visa_goals && (
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Primary Route</Label>
                      <p className="text-sm capitalize">{userProfile.visa_goals.primaryRoute?.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Timeframe</Label>
                      <p className="text-sm">{userProfile.visa_goals.timeframe}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Previous Applications</Label>
                      <p className="text-sm capitalize">{userProfile.visa_goals.previousApplications || 'None'}</p>
                    </div>
                    {userProfile.visa_goals.specificGoals && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Specific Goals</Label>
                        <p className="text-sm">{userProfile.visa_goals.specificGoals}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.preferences && (
                  <div className="grid gap-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Communication Style</Label>
                      <p className="text-sm capitalize">{userProfile.preferences.communicationStyle}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                      <p className="text-sm capitalize">{userProfile.preferences.priority}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Notifications</Label>
                      <p className="text-sm">{userProfile.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    {userProfile.preferences.language && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                        <p className="text-sm">{userProfile.preferences.language}</p>
                      </div>
                    )}
                    {userProfile.preferences.timezone && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Time Zone</Label>
                        <p className="text-sm">{userProfile.preferences.timezone}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Quick Navigation */}
          {navigate && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('home')}
                      className="flex items-center space-x-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Back to Home</span>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Manage your account settings and preferences below
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {/* Settings Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'privacy', label: 'Privacy', icon: Shield },
                    { id: 'appearance', label: 'Appearance', icon: Palette },
                    { id: 'data', label: 'Data & Export', icon: User }
                  ].map(section => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={activeSettingsSection === section.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveSettingsSection(section.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {section.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Notifications Settings */}
                {activeSettingsSection === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about your visa assessments and recommendations
                            </p>
                          </div>
                          <Switch
                            checked={userProfile?.settings?.emailNotifications ?? true}
                            onCheckedChange={(checked) => handleUpdateSettings('emailNotifications', checked)}
                            disabled={settingsLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Get text messages for urgent updates and deadlines
                            </p>
                          </div>
                          <Switch
                            checked={userProfile?.settings?.smsNotifications ?? false}
                            onCheckedChange={(checked) => handleUpdateSettings('smsNotifications', checked)}
                            disabled={settingsLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Marketing Communications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive tips, guides, and promotional content
                            </p>
                          </div>
                          <Switch
                            checked={userProfile?.settings?.marketing ?? false}
                            onCheckedChange={(checked) => handleUpdateSettings('marketing', checked)}
                            disabled={settingsLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">AI Assistant Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when AI has new insights or recommendations
                            </p>
                          </div>
                          <Switch
                            checked={userProfile?.preferences?.notifications ?? true}
                            onCheckedChange={(checked) => handleUpdateSettings('notifications', checked)}
                            disabled={settingsLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSettingsSection === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Privacy & Data</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Data Sharing for Improvement</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow anonymized data to be used to improve our services
                            </p>
                          </div>
                          <Switch
                            checked={userProfile?.settings?.dataSharing ?? true}
                            onCheckedChange={(checked) => handleUpdateSettings('dataSharing', checked)}
                            disabled={settingsLoading}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Show Personal Data</Label>
                            <p className="text-sm text-muted-foreground">
                              Temporarily show your personal information for review
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPersonalData(!showPersonalData)}
                          >
                            {showPersonalData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {showPersonalData ? 'Hide' : 'Show'}
                          </Button>
                        </div>

                        {showPersonalData && (
                          <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                              <div className="mt-2 space-y-2 text-sm">
                                <p><strong>Name:</strong> {userProfile?.name}</p>
                                <p><strong>Email:</strong> {userProfile?.email}</p>
                                <p><strong>Country:</strong> {userProfile?.country}</p>
                                <p><strong>Profession:</strong> {userProfile?.profession}</p>
                                <p><strong>Account Created:</strong> {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Unknown'}</p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeSettingsSection === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Appearance & Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="theme">Theme Preference</Label>
                          <Select 
                            value={userProfile?.settings?.theme || 'dark'} 
                            onValueChange={(value) => handleUpdateSettings('theme', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="auto">Auto (System)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="language">Language</Label>
                          <Select 
                            value={userProfile?.preferences?.language || 'English'} 
                            onValueChange={(value) => handleUpdateSettings('language', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Español</SelectItem>
                              <SelectItem value="French">Français</SelectItem>
                              <SelectItem value="German">Deutsch</SelectItem>
                              <SelectItem value="Portuguese">Português</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="communication">AI Communication Style</Label>
                          <Select 
                            value={userProfile?.preferences?.communicationStyle || 'balanced'} 
                            onValueChange={(value) => handleUpdateSettings('communicationStyle', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="detailed">Detailed & Thorough</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="concise">Quick & Concise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="priority">Primary Focus</Label>
                          <Select 
                            value={userProfile?.preferences?.priority || 'accuracy'} 
                            onValueChange={(value) => handleUpdateSettings('priority', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select focus" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accuracy">Accuracy & Compliance</SelectItem>
                              <SelectItem value="speed">Speed & Efficiency</SelectItem>
                              <SelectItem value="guidance">Step-by-step Guidance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Export Settings */}
                {activeSettingsSection === 'data' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Export Your Data</h4>
                                <p className="text-sm text-muted-foreground">
                                  Download a copy of all your data including profile, assessments, and recommendations
                                </p>
                              </div>
                              <Button onClick={exportUserData} variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Export Data
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Account Statistics</h4>
                                <p className="text-sm text-muted-foreground">
                                  View your usage statistics and account information
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p><strong>Member since:</strong> {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Unknown'}</p>
                                <p><strong>Onboarding:</strong> {userProfile?.completed_onboarding ? 'Completed' : 'Pending'}</p>
                                <p><strong>Last updated:</strong> {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : 'Never'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Data Protection:</strong> Your personal information is encrypted and stored securely. 
                            We never share your personal data with third parties without your explicit consent.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}