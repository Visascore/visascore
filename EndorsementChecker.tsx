import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner@2.0.3";

interface EndorsementBody {
  id: string;
  name: string;
  field: string;
  description: string;
  pathways: string[];
  criteria: {
    exceptionalTalent: string[];
    exceptionalPromise: string[];
  };
  contactInfo: {
    website: string;
    email?: string;
    phone?: string;
  };
}

interface EndorsementCheckerProps {
  onBack: () => void;
  onContinueToApplication?: () => void;
}

export function EndorsementChecker({ onBack, onContinueToApplication }: EndorsementCheckerProps) {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedBody, setSelectedBody] = useState<EndorsementBody | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<'talent' | 'promise' | ''>('');
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});
  const [userProfile, setUserProfile] = useState({
    experience: '',
    achievements: '',
    recognition: '',
    leadership: ''
  });
  const [eligibilityScore, setEligibilityScore] = useState(0);
  const [activeTab, setActiveTab] = useState('select-body');

  const endorsementBodies: EndorsementBody[] = [
    {
      id: 'tech-nation',
      name: 'Tech Nation',
      field: 'Digital Technology',
      description: 'For individuals working in digital technology, including software development, data science, fintech, cybersecurity, and emerging technology.',
      pathways: ['Exceptional Talent', 'Exceptional Promise'],
      criteria: {
        exceptionalTalent: [
          'Proven track record as a leading talent in the digital technology sector',
          'Recognised as a leader in their field by their peers',
          'Evidence of innovation and technical excellence',
          'Significant contribution to growth and success of digital technology companies',
          'Recognition for exceptional talent through awards, media coverage, or speaking engagements'
        ],
        exceptionalPromise: [
          'Emerging leader in digital technology with potential for significant contribution',
          'Demonstrates exceptional promise in their field',
          'Evidence of rapid career progression and achievement',
          'Recognition by peers and industry experts',
          'Involvement in innovative projects or initiatives'
        ]
      },
      contactInfo: {
        website: 'https://technation.io/visa/',
        email: 'visa@technation.io'
      }
    },
    {
      id: 'arts-council',
      name: 'Arts Council England',
      field: 'Arts and Culture',
      description: 'For individuals working in arts, culture, fashion, architecture, and creative industries.',
      pathways: ['Exceptional Talent', 'Exceptional Promise'],
      criteria: {
        exceptionalTalent: [
          'Internationally recognised leading talent in arts or culture',
          'Significant track record of excellence and innovation',
          'International recognition through exhibitions, performances, or publications',
          'Awards and accolades from recognised institutions',
          'Evidence of substantial contribution to arts and culture'
        ],
        exceptionalPromise: [
          'Emerging artist or cultural professional with exceptional promise',
          'Recognition by established professionals in the field',
          'Evidence of growing reputation and influence',
          'Involvement in significant cultural projects or initiatives',
          'Potential for future leadership in arts and culture'
        ]
      },
      contactInfo: {
        website: 'https://www.artscouncil.org.uk/globaltalent'
      }
    },
    {
      id: 'royal-society',
      name: 'The Royal Society',
      field: 'Science and Research',
      description: 'For individuals working in academic research, scientific research, and applied sciences.',
      pathways: ['Exceptional Talent', 'Exceptional Promise'],
      criteria: {
        exceptionalTalent: [
          'Internationally recognised leader in scientific research',
          'Outstanding research contributions with global impact',
          'Significant publications in top-tier journals',
          'Awards and honours from prestigious institutions',
          'Leading role in major research initiatives or discoveries'
        ],
        exceptionalPromise: [
          'Early-career researcher with exceptional potential',
          'High-quality research outputs and growing reputation',
          'Recognition by senior researchers in the field',
          'Evidence of innovative research approaches',
          'Potential for future scientific leadership'
        ]
      },
      contactInfo: {
        website: 'https://royalsociety.org/grants-schemes-awards/global-talent-visa/'
      }
    },
    {
      id: 'british-academy',
      name: 'The British Academy',
      field: 'Humanities and Social Sciences',
      description: 'For individuals working in humanities, social sciences, and related academic fields.',
      pathways: ['Exceptional Talent', 'Exceptional Promise'],
      criteria: {
        exceptionalTalent: [
          'Internationally recognised scholar in humanities or social sciences',
          'Substantial body of influential research and publications',
          'Leadership in academic institutions or professional bodies',
          'International recognition through fellowships or awards',
          'Significant contribution to knowledge in their field'
        ],
        exceptionalPromise: [
          'Early-career academic with exceptional research potential',
          'High-quality publications and growing scholarly reputation',
          'Recognition by established academics in the field',
          'Innovative research contributions',
          'Potential for future academic leadership'
        ]
      },
      contactInfo: {
        website: 'https://www.thebritishacademy.ac.uk/global-talent-visa/'
      }
    },
    {
      id: 'royal-academy-engineering',
      name: 'Royal Academy of Engineering',
      field: 'Engineering',
      description: 'For individuals working in engineering disciplines and related technical fields.',
      pathways: ['Exceptional Talent', 'Exceptional Promise'],
      criteria: {
        exceptionalTalent: [
          'Internationally recognised engineer with outstanding achievements',
          'Leadership in engineering innovation and excellence',
          'Significant contributions to engineering practice or research',
          'Professional recognition through awards and honours',
          'Impact on engineering profession and society'
        ],
        exceptionalPromise: [
          'Early-career engineer with exceptional potential',
          'Evidence of engineering excellence and innovation',
          'Recognition by engineering professionals',
          'Involvement in significant engineering projects',
          'Potential for future engineering leadership'
        ]
      },
      contactInfo: {
        website: 'https://www.raeng.org.uk/global-talent-visa'
      }
    }
  ];

  const fields = Array.from(new Set(endorsementBodies.map(body => body.field)));

  useEffect(() => {
    calculateEligibilityScore();
  }, [checklist, userProfile, selectedPathway]);

  const calculateEligibilityScore = () => {
    let score = 0;
    const totalItems = Object.keys(checklist).length;
    const completedItems = Object.values(checklist).filter(Boolean).length;
    
    if (totalItems > 0) {
      score = Math.round((completedItems / totalItems) * 100);
    }

    // Adjust score based on pathway and profile
    if (selectedPathway === 'talent') {
      if (userProfile.experience && userProfile.achievements && userProfile.recognition) {
        score += 10;
      }
    } else if (selectedPathway === 'promise') {
      if (userProfile.experience && userProfile.achievements) {
        score += 5;
      }
    }

    setEligibilityScore(Math.min(100, score));
  };

  const handleFieldSelect = (field: string) => {
    setSelectedField(field);
    const body = endorsementBodies.find(b => b.field === field);
    if (body) {
      setSelectedBody(body);
      setActiveTab('pathway-selection');
    }
  };

  const handlePathwaySelect = (pathway: 'talent' | 'promise') => {
    setSelectedPathway(pathway);
    
    // Initialize checklist based on selected pathway
    const criteria = selectedBody?.criteria[pathway === 'talent' ? 'exceptionalTalent' : 'exceptionalPromise'] || [];
    const newChecklist: { [key: string]: boolean } = {};
    criteria.forEach((criterion, index) => {
      newChecklist[`${pathway}-${index}`] = false;
    });
    setChecklist(newChecklist);
    
    setActiveTab('assessment');
  };

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRecommendation = () => {
    if (eligibilityScore >= 80) {
      return {
        status: 'excellent',
        message: 'You have an excellent chance of endorsement approval',
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950'
      };
    } else if (eligibilityScore >= 60) {
      return {
        status: 'good',
        message: 'You have a good chance with some improvements',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950'
      };
    } else {
      return {
        status: 'needs-work',
        message: 'Significant improvements needed before applying',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-950'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <span>← Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Global Talent Visa</Badge>
              <Badge variant="outline">Endorsement Checker</Badge>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="mb-8 bg-gradient-to-r from-card to-card/80 border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Endorsement Eligibility Assessment</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{eligibilityScore}%</div>
                  <div className="text-sm text-muted-foreground">Readiness Score</div>
                </div>
              </CardTitle>
              <CardDescription>
                Check your eligibility for Global Talent visa endorsement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={eligibilityScore} className="h-3" />
              {eligibilityScore > 0 && (
                <div className={`mt-4 p-3 rounded-lg ${recommendation.bgColor}`}>
                  <p className={`font-medium ${recommendation.color}`}>
                    {recommendation.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Global Talent Endorsement Assessment</CardTitle>
              <CardDescription>
                Determine your eligibility and prepare for endorsement application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="select-body">Select Body</TabsTrigger>
                  <TabsTrigger value="pathway-selection" disabled={!selectedBody}>Pathway</TabsTrigger>
                  <TabsTrigger value="assessment" disabled={!selectedPathway}>Assessment</TabsTrigger>
                  <TabsTrigger value="results" disabled={eligibilityScore === 0}>Results</TabsTrigger>
                </TabsList>

                <TabsContent value="select-body" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Choose Your Field</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {fields.map((field) => {
                        const body = endorsementBodies.find(b => b.field === field);
                        return (
                          <Card 
                            key={field} 
                            className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                              selectedField === field 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleFieldSelect(field)}
                          >
                            <CardContent className="p-6">
                              <h4 className="font-medium mb-2">{body?.name}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{body?.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">{field}</Badge>
                                <span className="text-primary font-medium">Select →</span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pathway-selection" className="space-y-6">
                  {selectedBody && (
                    <div>
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Selected: {selectedBody.name}</h3>
                        <p className="text-muted-foreground">{selectedBody.description}</p>
                      </div>
                      
                      <h3 className="font-semibold mb-4">Choose Your Pathway</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card 
                          className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                            selectedPathway === 'talent' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handlePathwaySelect('talent')}
                        >
                          <CardContent className="p-6">
                            <h4 className="font-medium mb-3">Exceptional Talent</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              For recognised leaders who have already achieved exceptional status
                            </p>
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Key Requirements:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {selectedBody.criteria.exceptionalTalent.slice(0, 3).map((criterion, i) => (
                                  <li key={i} className="flex items-start space-x-2">
                                    <span className="text-primary">•</span>
                                    <span>{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {selectedPathway === 'talent' && (
                              <div className="mt-4 p-2 bg-primary/10 rounded text-primary text-sm font-medium">
                                ✓ Selected
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card 
                          className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                            selectedPathway === 'promise' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handlePathwaySelect('promise')}
                        >
                          <CardContent className="p-6">
                            <h4 className="font-medium mb-3">Exceptional Promise</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              For emerging leaders who show exceptional promise for the future
                            </p>
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Key Requirements:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {selectedBody.criteria.exceptionalPromise.slice(0, 3).map((criterion, i) => (
                                  <li key={i} className="flex items-start space-x-2">
                                    <span className="text-primary">•</span>
                                    <span>{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {selectedPathway === 'promise' && (
                              <div className="mt-4 p-2 bg-primary/10 rounded text-primary text-sm font-medium">
                                ✓ Selected
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="assessment" className="space-y-6">
                  {selectedBody && selectedPathway && (
                    <div>
                      <h3 className="font-semibold mb-4">
                        Assessment: {selectedPathway === 'talent' ? 'Exceptional Talent' : 'Exceptional Promise'}
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Criteria Checklist */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Evidence Checklist</CardTitle>
                            <CardDescription>
                              Check off the criteria you can demonstrate with evidence
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {(selectedPathway === 'talent' 
                                ? selectedBody.criteria.exceptionalTalent 
                                : selectedBody.criteria.exceptionalPromise
                              ).map((criterion, index) => {
                                const key = `${selectedPathway}-${index}`;
                                return (
                                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                                    <Checkbox
                                      checked={checklist[key] || false}
                                      onCheckedChange={(checked) => handleChecklistChange(key, !!checked)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{criterion}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Profile Questions */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Your Profile</CardTitle>
                            <CardDescription>
                              Tell us about your background and achievements
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="experience">Years of Experience in Field</Label>
                              <Input
                                id="experience"
                                placeholder="e.g., 5 years"
                                value={userProfile.experience}
                                onChange={(e) => handleProfileChange('experience', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="achievements">Key Achievements</Label>
                              <Input
                                id="achievements"
                                placeholder="e.g., Led team of 50, Built award-winning platform"
                                value={userProfile.achievements}
                                onChange={(e) => handleProfileChange('achievements', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="recognition">Recognition & Awards</Label>
                              <Input
                                id="recognition"
                                placeholder="e.g., Industry awards, Media coverage"
                                value={userProfile.recognition}
                                onChange={(e) => handleProfileChange('recognition', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="leadership">Leadership Experience</Label>
                              <Input
                                id="leadership"
                                placeholder="e.g., Team lead, Board member, Mentor"
                                value={userProfile.leadership}
                                onChange={(e) => handleProfileChange('leadership', e.target.value)}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-center">
                          <Button 
                            onClick={() => setActiveTab('results')}
                            className="bg-gradient-to-r from-primary to-primary/80"
                          >
                            View Assessment Results
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Your Endorsement Readiness Report</h3>
                    
                    {/* Score Summary */}
                    <Card className={`mb-6 border-2 ${recommendation.bgColor} border-primary/20`}>
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="text-4xl font-bold text-primary mb-2">{eligibilityScore}%</div>
                          <div className="text-lg font-medium">Endorsement Readiness</div>
                        </div>
                        <p className={`${recommendation.color} font-medium mb-4`}>
                          {recommendation.message}
                        </p>
                        <Progress value={eligibilityScore} className="h-3" />
                      </CardContent>
                    </Card>

                    {/* Detailed Breakdown */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(checklist)
                              .filter(([_, checked]) => checked)
                              .map(([key, _], index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <span className="text-green-600">✓</span>
                                  <span>Evidence requirement {index + 1} met</span>
                                </div>
                              ))}
                            {userProfile.experience && (
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-green-600">✓</span>
                                <span>Relevant experience documented</span>
                              </div>
                            )}
                            {userProfile.achievements && (
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-green-600">✓</span>
                                <span>Key achievements identified</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(checklist)
                              .filter(([_, checked]) => !checked)
                              .map(([key, _], index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <span className="text-red-600">✗</span>
                                  <span>Evidence requirement {index + 1} needs work</span>
                                </div>
                              ))}
                            {!userProfile.recognition && (
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-red-600">✗</span>
                                <span>Recognition and awards needed</span>
                              </div>
                            )}
                            {!userProfile.leadership && (
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-red-600">✗</span>
                                <span>Leadership experience to document</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Next Steps */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {eligibilityScore >= 80 ? (
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-green-600 text-sm">1</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Prepare Your Evidence Portfolio</h5>
                                  <p className="text-sm text-muted-foreground">Compile all evidence documents that support your criteria</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-green-600 text-sm">2</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Get Reference Letters</h5>
                                  <p className="text-sm text-muted-foreground">Obtain 3 reference letters from recognized experts</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-green-600 text-sm">3</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Submit Endorsement Application</h5>
                                  <p className="text-sm text-muted-foreground">Apply directly to {selectedBody?.name}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-orange-600 text-sm">1</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Build Missing Evidence</h5>
                                  <p className="text-sm text-muted-foreground">Focus on areas where you don't meet criteria</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-orange-600 text-sm">2</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Gain More Recognition</h5>
                                  <p className="text-sm text-muted-foreground">Seek opportunities for awards, speaking, or media coverage</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-orange-600 text-sm">3</span>
                                </div>
                                <div>
                                  <h5 className="font-medium">Reassess in 6-12 Months</h5>
                                  <p className="text-sm text-muted-foreground">Continue building your profile and reassess readiness</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact Information */}
                    {selectedBody && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Contact {selectedBody.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Website:</span>
                              <a 
                                href={selectedBody.contactInfo.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {selectedBody.contactInfo.website}
                              </a>
                            </div>
                            {selectedBody.contactInfo.email && (
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Email:</span>
                                <a 
                                  href={`mailto:${selectedBody.contactInfo.email}`}
                                  className="text-primary hover:underline"
                                >
                                  {selectedBody.contactInfo.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button onClick={onBack} variant="outline">
              Back to Assessment
            </Button>
            {eligibilityScore >= 80 && onContinueToApplication && (
              <Button 
                onClick={onContinueToApplication}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                Continue to Visa Application
              </Button>
            )}
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={() => toast.success("Report downloaded successfully!")}
            >
              Download Assessment Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}