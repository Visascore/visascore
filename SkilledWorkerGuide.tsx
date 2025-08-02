import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap,
  PoundSterling,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface SkilledWorkerGuideProps {
  onStartAssessment: () => void;
  onBack: () => void;
}

export function SkilledWorkerGuide({ onStartAssessment, onBack }: SkilledWorkerGuideProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const keyChanges = [
    {
      icon: GraduationCap,
      title: "Higher Skill Level Requirement",
      description: "RQF Level 6+ (bachelor's degree equivalent) required for new applications",
      impact: "~180 occupations no longer eligible",
      color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    },
    {
      icon: PoundSterling,
      title: "Increased Salary Thresholds",
      description: "Minimum salary increased from £38,700 to £41,700",
      impact: "Plus £17.13/hour minimum and SOC going rates",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      icon: Users,
      title: "Dependants Restrictions",
      description: "Lower-skill roles (ISL/TSL) cannot bring dependants",
      impact: "Exceptions only for sole parental responsibility",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    },
    {
      icon: Building2,
      title: "Care Worker Changes",
      description: "No new entry-clearance for care workers from abroad",
      impact: "Extensions allowed until July 2028 with conditions",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
    }
  ];

  const timelineEvents = [
    {
      date: "Before 22 July 2025",
      status: "current",
      events: [
        "Current rules apply (RQF 3+, £38,700 minimum)",
        "Submit CoS applications under existing criteria",
        "All occupations on current eligible list available"
      ]
    },
    {
      date: "22 July 2025",
      status: "critical",
      events: [
        "New rules take effect immediately",
        "RQF Level 6+ requirement starts",
        "Salary threshold increases to £41,700",
        "ISL/TSL shortage lists activated"
      ]
    },
    {
      date: "After 22 July 2025",
      status: "future",
      events: [
        "Only RQF 6+ occupations eligible for new applications",
        "Shortage lists (ISL/TSL) valid until end of 2026",
        "Transitional protection only for pre-July CoS"
      ]
    },
    {
      date: "July 2028",
      status: "future",
      events: [
        "Care worker extension deadline",
        "Review of settlement timelines expected"
      ]
    }
  ];

  const salaryCalculator = {
    annual: 41700,
    hourly: 17.13,
    weeklyHours: 48
  };

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
            MAJOR CHANGES - JULY 2025
          </Badge>
          <h1 className="text-3xl md:text-4xl">
            Skilled Worker Visa 2025
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding the significant changes to UK Skilled Worker visa requirements 
            that take effect on 22 July 2025.
          </p>
        </div>

        {/* Critical Alert */}
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>URGENT:</strong> If your occupation is below RQF Level 6, you must submit your 
            Certificate of Sponsorship (CoS) application before 22 July 2025 to qualify under current rules.
          </AlertDescription>
        </Alert>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Key Changes from 22 July 2025
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

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Before vs After Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Requirement</th>
                        <th className="text-left p-3">Before 22 Jul 2025</th>
                        <th className="text-left p-3">From 22 Jul 2025</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="p-3 font-medium">Skill Level</td>
                        <td className="p-3">RQF 3+ allowed</td>
                        <td className="p-3 text-red-600">RQF 6+ for new applications</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Salary Threshold</td>
                        <td className="p-3">£38,700</td>
                        <td className="p-3 text-red-600">£41,700 + SOC going rates</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Hourly Minimum</td>
                        <td className="p-3">Not specified</td>
                        <td className="p-3 text-red-600">£17.13/hour (48-hour week)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Dependants</td>
                        <td className="p-3">All skill levels</td>
                        <td className="p-3 text-red-600">RQF 6+ only (ISL/TSL excluded)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Care Workers</td>
                        <td className="p-3">Entry & in-route allowed</td>
                        <td className="p-3 text-red-600">No new entry visas</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Shortage Lists Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Shortage Lists: Temporary Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Immigration Salary List (ISL)</h4>
                    <p className="text-sm text-muted-foreground">
                      Allows RQF Level 3-5 roles until end of 2026. No dependants allowed 
                      except in narrow cases.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Temporary Shortage List (TSL)</h4>
                    <p className="text-sm text-muted-foreground">
                      Similar to ISL but may extend to January 2026. Check current 
                      occupations on GOV.UK.
                    </p>
                  </div>
                </div>
                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Workers in ISL/TSL roles cannot bring dependants, 
                    except for sole parental responsibility or UK-born children.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Implementation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className={`
                          w-4 h-4 rounded-full mt-1 flex-shrink-0 
                          ${event.status === 'current' ? 'bg-green-500' : 
                            event.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'}
                        `}></div>
                        <div className="flex-1">
                          <h3 className={`
                            font-medium 
                            ${event.status === 'critical' ? 'text-red-600' : ''}
                          `}>
                            {event.date}
                          </h3>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {event.events.map((eventItem, eventIndex) => (
                              <li key={eventIndex} className="flex items-start gap-2">
                                <span className="text-xs mt-1">•</span>
                                <span>{eventItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="absolute left-2 top-8 w-px h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Requirements (Post-July 2025)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Skill Level & Occupation
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• RQF Level 6+ occupation (bachelor's degree equivalent)</li>
                      <li>• Job must be on Immigration Rules Appendix Skilled Occupations</li>
                      <li>• Check occupation is not removed from eligible list</li>
                      <li>• Alternative: Role on Immigration Salary List (ISL) or Temporary Shortage List (TSL)</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <PoundSterling className="h-4 w-4" />
                      Salary Requirements
                    </h4>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Must meet ALL of the following:</strong></p>
                      <ul className="space-y-1 text-sm pl-4">
                        <li>• Minimum annual salary: <strong>£41,700</strong></li>
                        <li>• Occupation going rate (April 2024 ASHE data)</li>
                        <li>• Hourly minimum: <strong>£17.13/hour</strong> (48-hour week)</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Sponsorship Requirements
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• Valid Certificate of Sponsorship (CoS) from licensed employer</li>
                      <li>• Employer must have current sponsor licence (check GOV.UK register)</li>
                      <li>• Job must be genuine vacancy matching CoS details</li>
                      <li>• Cannot work for employers other than sponsor without permission</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Dependants & Settlement
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                      <li>• RQF 6+ workers: Can bring spouse/partner and children</li>
                      <li>• ISL/TSL workers: Cannot bring dependants (limited exceptions)</li>
                      <li>• Settlement: Currently 5 years, may extend to 10 years (consultation pending)</li>
                      <li>• Immigration Health Surcharge: £1,035/year (adults), £776/year (under 18)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pre-Assessment Checklist</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete this checklist before starting your eligibility assessment
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Before You Apply</h4>
                  <div className="space-y-2">
                    {[
                      'Check your occupation RQF level on Immigration Rules',
                      'Verify your employer has a valid sponsor licence',
                      'Confirm your salary meets all three thresholds (£41,700, going rate, £17.13/hour)',
                      'Research if your occupation is on ISL/TSL if below RQF 6',
                      'Consider dependants implications for lower-skill roles',
                      'Check application timing relative to 22 July 2025'
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
                      'Valid Certificate of Sponsorship (CoS) from employer',
                      'English language test certificate (IELTS 4.0+ or equivalent)',
                      'Degree certificates and academic transcripts',
                      'Bank statements showing £1,270 maintenance funds (28 days)',
                      'TB test certificate (if from listed countries)',
                      'Criminal record certificates (if applicable)',
                      'Valid passport with blank page'
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
                    <strong>Transitional Protection:</strong> If your CoS was issued before 22 July 2025, 
                    you may still be eligible under the previous rules even if applying after this date.
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
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Important Disclaimer:</strong> This information is based on official sources 
                  including The Times, House of Commons Library, GOV.UK, and legal advisors. 
                  Immigration rules can change frequently.
                </p>
                <p className="text-sm text-muted-foreground">
                  Always check the latest guidance on GOV.UK and consider professional immigration 
                  advice for complex cases. This assessment tool provides guidance only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}