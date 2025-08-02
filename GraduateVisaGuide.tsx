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
  Briefcase,
  ArrowRight,
  Info,
  Users,
  TrendingDown
} from 'lucide-react';

interface GraduateVisaGuideProps {
  onStartAssessment: () => void;
  onBack: () => void;
}

export function GraduateVisaGuide({ onStartAssessment, onBack }: GraduateVisaGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const keyFeatures = [
    {
      icon: Briefcase,
      title: "Unsponsored Work Rights",
      description: "Work at any skill level, be self-employed, start a business",
      impact: "No job offer or sponsorship required",
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      icon: Clock,
      title: "Duration by Degree Level",
      description: "2 years (Bachelor's/Master's), 3 years (PhD)",
      impact: "Cannot be extended - must switch to other visa",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      icon: TrendingDown,
      title: "URGENT: Duration Reduction",
      description: "Reducing to 18 months after Autumn 2025",
      impact: "Students starting before Jan 2026 still get 2 years",
      color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    },
    {
      icon: Users,
      title: "Dependants Policy",
      description: "Existing dependants can extend with you",
      impact: "Cannot bring new dependants on Graduate visa",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  const durationComparison = [
    {
      degree: "PhD",
      current: "3 years",
      after2025: "Likely 3 years (to be confirmed)",
      startBefore: "January 2026",
      color: "bg-green-50 dark:bg-green-900/20"
    },
    {
      degree: "Master's",
      current: "2 years",
      after2025: "18 months",
      startBefore: "January 2026",
      color: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      degree: "Bachelor's",
      current: "2 years",
      after2025: "18 months",
      startBefore: "January 2026",
      color: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const workRights = [
    "Work full-time at any skill level",
    "Be self-employed or freelance",
    "Start your own business",
    "Do voluntary work",
    "Study additional non-sponsored courses",
    "Switch to Skilled Worker or other work visas"
  ];

  const restrictions = [
    "Cannot work as professional sportsperson",
    "Cannot work as doctor or dentist in training",
    "Cannot extend Graduate visa",
    "Cannot bring new dependants",
    "Not a route to settlement directly"
  ];

  const timelineSteps = [
    {
      phase: "Preparation Phase",
      timing: "Before course completion",
      steps: [
        "Ensure institution will confirm completion to UKVI",
        "Keep all academic records and evidence",
        "Plan application timing before Student visa expires",
        "Consider future visa pathways (Skilled Worker, etc.)"
      ]
    },
    {
      phase: "Application Phase",
      timing: "After course completion confirmed",
      steps: [
        "Institution confirms completion to UKVI",
        "Apply online from within UK only",
        "Pay £880 application fee + £1,035/year healthcare surcharge",
        "Submit supporting documents"
      ]
    },
    {
      phase: "Decision Phase",
      timing: "Within 8 weeks",
      steps: [
        "Receive visa decision (can stay while awaiting)",
        "Start working at any skill level",
        "Plan for visa switching before expiry",
        "Consider settlement routes via future work visas"
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
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            URGENT: DURATION REDUCING AUTUMN 2025
          </Badge>
          <h1 className="text-3xl md:text-4xl">
            Graduate Visa 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Post-study work route for UK graduates. Critical timing changes coming - 
            duration reducing from 2 years to 18 months after Autumn 2025.
          </p>
        </div>

        {/* Critical Alert for Duration Change */}
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>CRITICAL TIMING:</strong> Graduate Visa duration will reduce from 2 years to 18 months 
            after Autumn 2025. Students starting before January 2026 still get the current 2-year route.
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="changes">2025 Changes</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Graduate Visa Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${feature.color}`}>
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          <p className="text-sm font-medium mt-1">{feature.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Rights vs Restrictions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">What You CAN Do</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {workRights.map((right, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{right}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">Restrictions & Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Application Fee</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">£880</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-600 dark:text-purple-400">Healthcare Surcharge</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">£1,035/year</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-600 dark:text-green-400">Total (2 years)</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">£2,950</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Upcoming White Paper Changes (Autumn 2025)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    These changes affect students starting their courses after January 2026. 
                    Current students and those starting before this date are protected.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-medium">Duration Changes by Degree Level</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Degree Level</th>
                          <th className="text-left p-3">Current Duration</th>
                          <th className="text-left p-3">After Autumn 2025</th>
                          <th className="text-left p-3">Protected if Started Before</th>
                        </tr>
                      </thead>
                      <tbody>
                        {durationComparison.map((row, index) => (
                          <tr key={index} className={`border-b ${row.color}`}>
                            <td className="p-3 font-medium">{row.degree}</td>
                            <td className="p-3">{row.current}</td>
                            <td className="p-3">{row.after2025}</td>
                            <td className="p-3">{row.startBefore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Other Upcoming Changes</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>New 6% levy on universities expected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Stricter English language requirements for dependants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>Tighter compliance standards for university sponsors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>New 10-year route to settlement may apply to other visa types</span>
                    </li>
                  </ul>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Planning Tip:</strong> If you're considering UK studies, starting before January 2026 
                    ensures you get the current 2-year Graduate visa route. Consider fast-track applications for 
                    courses starting in late 2025.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Essential Requirements</h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                      <ul className="space-y-1 text-sm pl-4">
                        <li>• Must be in the UK on valid Student/Tier 4 visa when applying</li>
                        <li>• Successfully completed eligible UK bachelor's, master's, or PhD program</li>
                        <li>• Study must have been completed in the UK (not distance learning)</li>
                        <li>• Institution must have confirmed completion to UKVI</li>
                        <li>• Course must be on list of eligible qualifications</li>
                        <li>• Cannot have previously held Graduate Visa or Doctorate Extension Scheme</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Application Conditions</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• Must apply from within UK only (cannot apply from abroad)</li>
                      <li>• Apply before your Student visa expires</li>
                      <li>• Institution must have reported completion to UKVI first</li>
                      <li>• No job offer or sponsorship required</li>
                      <li>• Decision usually within 8 weeks (can stay while awaiting decision)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Dependants Considerations</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">Allowed</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Existing dependants from Student visa can extend</li>
                          <li>• Dependants can work and study</li>
                          <li>• Same visa duration as main applicant</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h5 className="font-medium text-red-700 dark:text-red-400 mb-2">Not Allowed</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Cannot bring new dependants</li>
                          <li>• Cannot add dependants after visa granted</li>
                          <li>• Graduate visa not route to settlement</li>
                        </ul>
                      </div>
                    </div>
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
                  Application Process Timeline
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
                            <Badge variant="outline" className="text-xs">{phase.timing}</Badge>
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

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Graduate visa cannot be extended. Plan your transition to 
                Skilled Worker or other long-term visa categories well before expiry.
              </AlertDescription>
            </Alert>
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
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Success Strategy:</strong> Use the Graduate visa to gain UK work experience, 
                  then switch to Skilled Worker visa for a route to settlement.
                </p>
                <p className="text-sm text-muted-foreground">
                  Start planning your transition early - many graduates successfully switch to 
                  sponsored work visas using their UK experience and qualifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}