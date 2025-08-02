import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Target,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
  completeOnboarding: (data: any) => Promise<any>;
}

interface OnboardingData {
  personalInfo: {
    name: string;
    country: string;
    age: string;
    profession: string;
  };
  visaGoals: {
    primaryRoute: string;
    timeframe: string;
    previousApplications: string;
    specificGoals: string;
  };
  background: {
    education: string;
    workExperience: string;
    englishLevel: string;
    familyTies: string;
  };
  preferences: {
    communicationStyle: string;
    priority: string;
    notifications: boolean;
  };
}

const steps = [
  { id: 'personal', title: 'Personal Info', icon: Users },
  { id: 'goals', title: 'Visa Goals', icon: Target },
  { id: 'background', title: 'Background', icon: GraduationCap },
  { id: 'preferences', title: 'Preferences', icon: Sparkles }
];

const visaRoutes = [
  { id: 'global-talent', name: 'Global Talent', description: 'For exceptional talent or promising individuals' },
  { id: 'skilled-worker', name: 'Skilled Worker', description: 'For sponsored employment' },
  { id: 'student', name: 'Student Visa', description: 'For higher education studies' },
  { id: 'graduate', name: 'Graduate Route', description: 'Post-study work visa' },
  { id: 'investor', name: 'Investor/Start-up', description: 'For entrepreneurs and investors' },
  { id: 'family', name: 'Family Visa', description: 'Joining family members in the UK' },
  { id: 'other', name: 'Other/Unsure', description: 'Exploring different options' }
];

const timeframes = [
  { id: '3-months', name: '3 months', description: 'Urgent application' },
  { id: '6-months', name: '6 months', description: 'Standard preparation' },
  { id: '1-year', name: '1 year', description: 'Thorough preparation' },
  { id: '2-years', name: '2+ years', description: 'Long-term planning' }
];

const educationLevels = [
  { id: 'phd', name: 'PhD/Doctorate' },
  { id: 'masters', name: 'Masters Degree' },
  { id: 'bachelors', name: 'Bachelor\'s Degree' },
  { id: 'diploma', name: 'Diploma/Certificate' },
  { id: 'secondary', name: 'Secondary Education' },
  { id: 'other', name: 'Other' }
];

const englishLevels = [
  { id: 'native', name: 'Native/Fluent' },
  { id: 'advanced', name: 'Advanced (C1/C2)' },
  { id: 'intermediate', name: 'Intermediate (B2)' },
  { id: 'basic', name: 'Basic (A2/B1)' },
  { id: 'beginner', name: 'Beginner (A1)' }
];

export function OnboardingFlow({ onComplete, onSkip, completeOnboarding }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      name: '',
      country: '',
      age: '',
      profession: ''
    },
    visaGoals: {
      primaryRoute: '',
      timeframe: '',
      previousApplications: '',
      specificGoals: ''
    },
    background: {
      education: '',
      workExperience: '',
      englishLevel: '',
      familyTies: '',
      specificSkills: [],
      workSector: '',
      qualificationCountry: ''
    },
    preferences: {
      communicationStyle: 'balanced',
      priority: 'accuracy',
      notifications: true,
      language: 'English',
      timezone: 'UTC'
    }
  });

  const supabase = createClient();
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateData = (section: keyof OnboardingData, field: string, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      console.log('Completing onboarding with data:', data);

      // Use the backend integration from useAuth
      const result = await completeOnboarding(data);
      
      if (result.success) {
        // Set flag for showing welcome message
        localStorage.setItem('onboardingJustCompleted', 'true');
        
        // Pass the result data to the parent
        onComplete({
          ...data,
          scores: result.scores,
          profile: result.profile
        });
      } else {
        throw new Error(result.error || 'Failed to complete onboarding');
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast.error(error.message || 'Failed to save your preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Basic local scoring function (simplified version)
  const calculateBasicScores = (onboardingData: OnboardingData) => {
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

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return data.personalInfo.name && data.personalInfo.country && data.personalInfo.profession;
      case 1: // Visa Goals
        return data.visaGoals.primaryRoute && data.visaGoals.timeframe;
      case 2: // Background
        return data.background.education && data.background.englishLevel;
      case 3: // Preferences
        return true; // Preferences have defaults
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Help us personalize your visa guidance experience with some basic information
                </p>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Basic Information
                </h3>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={data.personalInfo.name || ''}
                      onChange={(e) => updateData('personalInfo', 'name', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Current Country of Residence *
                    </Label>
                    <Input
                      id="country"
                      value={data.personalInfo.country || ''}
                      onChange={(e) => updateData('personalInfo', 'country', e.target.value)}
                      placeholder="e.g., India, Nigeria, United States"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age Range *
                    </Label>
                    <select
                      id="age"
                      value={data.personalInfo.age || ''}
                      onChange={(e) => updateData('personalInfo', 'age', e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="">Select your age range</option>
                      <option value="18-25">18-25 years</option>
                      <option value="26-30">26-30 years</option>
                      <option value="31-35">31-35 years</option>
                      <option value="36-40">36-40 years</option>
                      <option value="41-45">41-45 years</option>
                      <option value="46+">46+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Professional Background
                </h3>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profession" className="text-sm font-medium">
                      Current Profession/Field *
                    </Label>
                    <Input
                      id="profession"
                      value={data.personalInfo.profession || ''}
                      onChange={(e) => updateData('personalInfo', 'profession', e.target.value)}
                      placeholder="e.g., Software Engineer, Doctor, Teacher, Student"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workSector" className="text-sm font-medium">
                      Work Sector <span className="text-muted-foreground">(Optional)</span>
                    </Label>
                    <select
                      id="workSector"
                      value={data.background.workSector || ''}
                      onChange={(e) => updateData('background', 'workSector', e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="">Select your work sector</option>
                      <option value="technology">Technology & IT</option>
                      <option value="healthcare">Healthcare & Medicine</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="education">Education & Research</option>
                      <option value="engineering">Engineering</option>
                      <option value="creative">Creative & Design</option>
                      <option value="business">Business & Management</option>
                      <option value="legal">Legal Services</option>
                      <option value="construction">Construction</option>
                      <option value="retail">Retail & Hospitality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="bg-muted/30 border border-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary">*</span> Required fields - we need this information to provide accurate visa guidance
                </p>
              </div>
            </div>
          </div>
        );

      case 1: // Visa Goals
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Your visa goals</h2>
              <p className="text-muted-foreground">
                Which UK visa route are you most interested in?
              </p>
            </div>

            <div>
              <Label>Primary Visa Route of Interest</Label>
              <div className="grid gap-3 mt-2">
                {visaRoutes.map((route) => (
                  <Card
                    key={route.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      data.visaGoals.primaryRoute === route.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => updateData('visaGoals', 'primaryRoute', route.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{route.name}</h3>
                          <p className="text-sm text-muted-foreground">{route.description}</p>
                        </div>
                        {data.visaGoals.primaryRoute === route.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label>Application Timeframe</Label>
              <div className="grid gap-3 mt-2">
                {timeframes.map((timeframe) => (
                  <Card
                    key={timeframe.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      data.visaGoals.timeframe === timeframe.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => updateData('visaGoals', 'timeframe', timeframe.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{timeframe.name}</h4>
                          <p className="text-sm text-muted-foreground">{timeframe.description}</p>
                        </div>
                        {data.visaGoals.timeframe === timeframe.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="previousApplications">Previous UK Visa Applications</Label>
              <select
                id="previousApplications"
                value={data.visaGoals.previousApplications || ''}
                onChange={(e) => updateData('visaGoals', 'previousApplications', e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background mt-2"
              >
                <option value="">Select...</option>
                <option value="none">No previous applications</option>
                <option value="approved">Previously approved</option>
                <option value="rejected">Previously rejected</option>
                <option value="withdrawn">Previously withdrawn</option>
              </select>
            </div>

            <div>
              <Label htmlFor="specificGoals">Specific Goals or Concerns (Optional)</Label>
              <Textarea
                id="specificGoals"
                value={data.visaGoals.specificGoals || ''}
                onChange={(e) => updateData('visaGoals', 'specificGoals', e.target.value)}
                placeholder="Tell us about your specific situation, concerns, or goals..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2: // Background
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <GraduationCap className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Your background</h2>
              <p className="text-muted-foreground">
                Help us understand your qualifications and experience
              </p>
            </div>

            <div>
              <Label>Highest Education Level</Label>
              <div className="grid gap-2 mt-2">
                {educationLevels.map((level) => (
                  <Card
                    key={level.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      data.background.education === level.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => updateData('background', 'education', level.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{level.name}</span>
                        {data.background.education === level.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="workExperience">Years of Professional Work Experience</Label>
              <select
                id="workExperience"
                value={data.background.workExperience || ''}
                onChange={(e) => updateData('background', 'workExperience', e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background mt-2"
              >
                <option value="">Select...</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-5">4-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <Label>English Language Level</Label>
              <div className="grid gap-2 mt-2">
                {englishLevels.map((level) => (
                  <Card
                    key={level.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      data.background.englishLevel === level.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => updateData('background', 'englishLevel', level.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{level.name}</span>
                        {data.background.englishLevel === level.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="familyTies">Family Ties to UK (Optional)</Label>
              <select
                id="familyTies"
                value={data.background.familyTies || ''}
                onChange={(e) => updateData('background', 'familyTies', e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background mt-2"
              >
                <option value="">Select...</option>
                <option value="none">No family ties</option>
                <option value="spouse">Spouse/Partner in UK</option>
                <option value="children">Children in UK</option>
                <option value="parents">Parents in UK</option>
                <option value="siblings">Siblings in UK</option>
                <option value="other">Other family members</option>
              </select>
            </div>

            <div>
              <Label htmlFor="qualificationCountry">Country Where You Obtained Your Highest Qualification</Label>
              <Input
                id="qualificationCountry"
                value={data.background.qualificationCountry || ''}
                onChange={(e) => updateData('background', 'qualificationCountry', e.target.value)}
                placeholder="e.g., India, Nigeria, United States"
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-12 h-12 mx-auto text-primary" />
              <h2 className="text-2xl font-semibold">Customize your experience</h2>
              <p className="text-muted-foreground">
                Set your preferences for AI assistance and guidance
              </p>
            </div>

            <div>
              <Label>AI Communication Style</Label>
              <div className="grid gap-3 mt-2">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.communicationStyle === 'detailed'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'communicationStyle', 'detailed')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Detailed & Thorough</h4>
                        <p className="text-sm text-muted-foreground">
                          Comprehensive explanations with all details
                        </p>
                      </div>
                      {data.preferences.communicationStyle === 'detailed' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.communicationStyle === 'balanced'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'communicationStyle', 'balanced')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Balanced</h4>
                        <p className="text-sm text-muted-foreground">
                          Clear and concise with key details
                        </p>
                      </div>
                      {data.preferences.communicationStyle === 'balanced' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.communicationStyle === 'concise'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'communicationStyle', 'concise')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Quick & Concise</h4>
                        <p className="text-sm text-muted-foreground">
                          Brief answers with essential information
                        </p>
                      </div>
                      {data.preferences.communicationStyle === 'concise' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Label>Primary Focus</Label>
              <div className="grid gap-3 mt-2">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.priority === 'accuracy'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'priority', 'accuracy')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Accuracy & Compliance</span>
                      {data.preferences.priority === 'accuracy' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.priority === 'speed'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'priority', 'speed')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Speed & Efficiency</span>
                      {data.preferences.priority === 'speed' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    data.preferences.priority === 'guidance'
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => updateData('preferences', 'priority', 'guidance')}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Step-by-step Guidance</span>
                      {data.preferences.priority === 'guidance' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="p-6">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors ${
                        index < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack} disabled={loading}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button variant="ghost" onClick={onSkip} disabled={loading}>
                  Skip Setup
                </Button>
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!isStepValid() || loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Complete Setup
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}