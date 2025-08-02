import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  AlertTriangle, 
  Calendar, 
  GraduationCap, 
  PoundSterling,
  Clock,
  CheckCircle,
  Smartphone,
  ArrowRight,
  Info,
  FileText,
  Users
} from 'lucide-react';

interface StudentVisaGuideProps {
  onStartAssessment: () => void;
  onBack: () => void;
}

export function StudentVisaGuide({ onStartAssessment, onBack }: StudentVisaGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const keyChanges = [
    {
      icon: Smartphone,
      title: "eVisa System (Since July 15, 2025)",
      description: "All Student visas are now electronic - no physical vignette stickers",
      impact: "Must set up UKVI account and register passport",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      icon: Calendar,
      title: "Application Timing",
      description: "Apply up to 6 months before course start (3 months from within UK)",
      impact: "Processing: 3 weeks outside UK, 8 weeks inside UK",
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      icon: PoundSterling,
      title: "Financial Requirements",
      description: "£1,334/month (London), £1,023/month (outside London)",
      impact: "Plus full course fees for first year",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      icon: Clock,
      title: "Course Duration Limits",
      description: "Up to 5 years (degree level), up to 2 years (below degree)",
      impact: "Early arrival: 1 week/1 month depending on course length",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  const financialBreakdown = {
    london: {
      living: 1334,
      description: "Monthly living costs in London"
    },
    outsideLondon: {
      living: 1023,
      description: "Monthly living costs outside London"
    },
    additional: [
      "Full course fees for first year (or total if course under 1 year)",
      "Immigration Health Surcharge: £776 per year",
      "Application fee: £524 (outside UK), £628 (inside UK)"
    ]
  };

  const timelineSteps = [
    {
      phase: "Preparation Phase",
      duration: "2-3 months before",
      steps: [
        "Research and apply to licensed UK institutions",
        "Take English language test (IELTS/TOEFL from UKVI-approved provider)",
        "Gather financial documents and academic qualifications",
        "Set up UKVI account and register passport for eVisa"
      ]
    },
    {
      phase: "Application Phase",
      duration: "Up to 6 months before course",
      steps: [
        "Receive unconditional offer and CAS from institution",
        "Apply for Student visa online",
        "Pay application fee and Immigration Health Surcharge",
        "Attend biometrics appointment"
      ]
    },
    {
      phase: "Decision Phase",
      duration: "3-8 weeks processing",
      steps: [
        "Receive eVisa confirmation via UKVI account",
        "Check visa conditions and work permissions",
        "Plan travel to arrive within permitted early arrival window",
        "Complete any institution-specific requirements"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 mobile-container safe-area-top">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Visa Routes
          </Button>
        </div>

        <div className="text-center space-y-4">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            EVISA SYSTEM - JULY 2025
          </Badge>
          <h1 className="text-3xl md:text-4xl">
            Student Visa 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete guide to the UK Student visa with the new electronic visa system 
            and current financial requirements for 2025.
          </p>
        </div>

        {/* Critical Alert for eVisa */}
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>IMPORTANT:</strong> Since July 15, 2025, all Student visas are electronic (eVisa). 
            You must set up your UKVI account and register your passport before departure.
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Key Features of Student Visa 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {keyChanges.map((change, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${change.color}`}>
                          <change.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{change.title}</h3>
                          <p className="text-sm text-muted-foreground">{change.description}</p>
                          <p className="text-sm font-medium mt-1">{change.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Requirements Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-700 dark:text-orange-400">London Students</h4>
                      <p className="text-2xl font-bold text-orange-600">£{financialBreakdown.london.living}/month</p>
                      <p className="text-sm text-muted-foreground">{financialBreakdown.london.description}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-400">Outside London</h4>
                      <p className="text-2xl font-bold text-green-600">£{financialBreakdown.outsideLondon.living}/month</p>
                      <p className="text-sm text-muted-foreground">{financialBreakdown.outsideLondon.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Additional Costs</h4>
                  <ul className="space-y-2">
                    {financialBreakdown.additional.map((cost, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm">{cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Course Duration Table */}
            <Card>
              <CardHeader>
                <CardTitle>Visa Duration by Course Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Course Level</th>
                        <th className="text-left p-3">Age Requirement</th>
                        <th className="text-left p-3">Maximum Duration</th>
                        <th className="text-left p-3">Early Arrival</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="p-3 font-medium">Degree level</td>
                        <td className="p-3">18+</td>
                        <td className="p-3">Up to 5 years</td>
                        <td className="p-3">1 month before</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Below degree level</td>
                        <td className="p-3">Any age</td>
                        <td className="p-3">Up to 2 years</td>
                        <td className="p-3">1 month before</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Short courses</td>
                        <td className="p-3">Any age</td>
                        <td className="p-3">≤6 months</td>
                        <td className="p-3">1 week before</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Requirements List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Academic Requirements
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• Unconditional offer from Student sponsor (licensed education provider)</li>
                      <li>• Confirmation of Acceptance for Studies (CAS) - valid and not expired</li>
                      <li>• Academic qualifications with certified English translations</li>
                      <li>• ATAS certificate (if studying sensitive subjects like engineering/sciences)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <PoundSterling className="h-4 w-4" />
                      Financial Requirements
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• Living costs: £1,334/month (London), £1,023/month (outside London)</li>
                      <li>• Course fees: full first year or total if course under 1 year</li>
                      <li>• Financial documents must be no more than 31 days old</li>
                      <li>• Immigration Health Surcharge: £776 per year</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      eVisa Requirements
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Essential for 2025:</strong></p>
                      <ul className="space-y-1 text-sm pl-4">
                        <li>• Set up UKVI account before applying</li>
                        <li>• Register passport with UKVI account</li>
                        <li>• Ensure passport details are correct before departure</li>
                        <li>• No physical visa stickers - everything is electronic</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Additional Requirements
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• English language proficiency (IELTS Academic/TOEFL iBT from UKVI provider)</li>
                      <li>• TB test (if from listed countries) - valid 6 months</li>
                      <li>• Minor students (under 18): 70 points requirement</li>
                      <li>• Valid passport with correct registration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Application Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineSteps.map((phase, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{phase.phase}</h3>
                            <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {phase.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2">
                                <span className="text-xs mt-1">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className="absolute left-2 top-8 w-px h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Application Checklist</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete this checklist before starting your eligibility assessment
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Before You Apply</h4>
                  <div className="space-y-2">
                    {[
                      'Set up UKVI account and register passport for eVisa',
                      'Receive unconditional offer from licensed UK institution',
                      'Obtain valid CAS (Confirmation of Acceptance for Studies)',
                      'Take English language test from UKVI-approved provider',
                      'Gather financial documents (less than 31 days old)',
                      'Check if you need ATAS certificate for your course'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground mt-0.5 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Documents to Prepare</h4>
                  <div className="space-y-2">
                    {[
                      'Valid passport (registered with UKVI account)',
                      'CAS from your UK institution',
                      'English language test certificate',
                      'Academic qualifications and transcripts',
                      'Financial documents (bank statements, sponsor letters)',
                      'TB test certificate (if from listed countries)',
                      'Passport photos (if required for biometrics)'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground mt-0.5 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>eVisa Reminder:</strong> Since July 15, 2025, there are no physical visa stickers. 
                    Your eVisa is linked to your passport through your UKVI account.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" onClick={onStartAssessment} className="flex items-center gap-2">
            Start Eligibility Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={onBack}>
            Back to Visa Routes
          </Button>
        </div>

        {/* Bottom Notice */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Good to know:</strong> Student visa has a high success rate when all requirements are met. 
                  The new eVisa system makes the process more streamlined once set up correctly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Consider the Graduate visa pathway after completing your studies for 2+ years of work experience in the UK.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}