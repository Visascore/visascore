import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { CheckCircle, ArrowLeft, Clock, TrendingUp, FileText, AlertCircle, PlayCircle } from "lucide-react";
import { SkilledWorkerGuide } from "./SkilledWorkerGuide";
import { StudentVisaGuide } from "./StudentVisaGuide";
import { GraduateVisaGuide } from "./GraduateVisaGuide";
import { AncestryVisaGuide } from "./AncestryVisaGuide";
import { VisaRoute } from "../data/visaRoutes";

interface VisaRouteDetailProps {
  route: VisaRoute;
  onBack: () => void;
  onStartEligibilityCheck: () => void;
  onShowDetailedGuide?: () => void;
}

export function VisaRouteDetail({ route, onBack, onStartEligibilityCheck, onShowDetailedGuide }: VisaRouteDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSkilledWorkerGuide, setShowSkilledWorkerGuide] = useState(false);
  const [showStudentGuide, setShowStudentGuide] = useState(false);
  const [showGraduateGuide, setShowGraduateGuide] = useState(false);
  const [showAncestryGuide, setShowAncestryGuide] = useState(false);

  // Show specific guides first
  if (route.id === 'skilled-worker' && showSkilledWorkerGuide) {
    return (
      <SkilledWorkerGuide
        onStartAssessment={() => {
          setShowSkilledWorkerGuide(false);
          onStartEligibilityCheck();
        }}
        onBack={() => setShowSkilledWorkerGuide(false)}
      />
    );
  }

  if (route.id === 'student-visa' && showStudentGuide) {
    return (
      <StudentVisaGuide
        onStartAssessment={() => {
          setShowStudentGuide(false);
          onStartEligibilityCheck();
        }}
        onBack={() => setShowStudentGuide(false)}
      />
    );
  }

  if (route.id === 'graduate-route' && showGraduateGuide) {
    return (
      <GraduateVisaGuide
        onStartAssessment={() => {
          setShowGraduateGuide(false);
          onStartEligibilityCheck();
        }}
        onBack={() => setShowGraduateGuide(false)}
      />
    );
  }

  if (route.id === 'ancestry-visa' && showAncestryGuide) {
    return (
      <AncestryVisaGuide
        onStartAssessment={() => {
          setShowAncestryGuide(false);
          onStartEligibilityCheck();
        }}
        onBack={() => setShowAncestryGuide(false)}
      />
    );
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const difficultyScore = {
    Easy: 85,
    Medium: 60,
    Hard: 35
  };

  // Enhanced route-specific information
  const getRouteSpecificInfo = () => {
    switch (route.id) {
      case 'global-talent':
        return {
          keyPoints: [
            'Two-step process: endorsement (£561) + visa (£205 + IHS) for exceptional individuals',
            'Three main sectors: Academia & Research, Arts & Culture, Digital Technology',
            'Each sector has specific endorsing bodies and evidence requirements',
            'eVisa only since July 15, 2025 - no physical visa stickers',
            'Full work flexibility: employed, self-employed, start companies, freelance',
            'ILR after 3 years (academia/arts) or 5 years (tech)',
            'Can bring dependants (partner and children under 18)',
            'AI/cybersecurity professionals get fast-track endorsement (3 weeks)'
          ],
          process: [
            'Self-assess: Prize-winner track (skip endorsement) or Leader/Potential-Leader track',
            'Select endorsing body based on sector: Tech Nation (digital), Royal Society (sciences), Arts Council England (arts)',
            'Prepare comprehensive CV, 3 reference letters, sector-specific evidence',
            'Apply for endorsement via Home Office platform (£561 fee)',
            'Wait for endorsement decision: 3-8 weeks (AI/cyber: 3 weeks)',
            'Apply for visa within 3 months of endorsement award (£205 + £1,035/year IHS)',
            'Attend biometrics appointment and passport registration for eVisa',
            'Receive eVisa decision (~3 weeks)'
          ],
          costs: [
            'Endorsement fee: £561',
            'Visa application: £205',
            'Immigration Health Surcharge: £1,035 per year',
            'Total for 5 years: £766 + £5,175 IHS = £5,941',
            'Total for 3 years: £766 + £3,105 IHS = £3,871'
          ],
          timeline: '4-11 weeks total (3-8 weeks endorsement + 3 weeks visa)',
          successTips: [
            'Allow 6+ months preparation time for comprehensive evidence gathering',
            'Get 3 strong reference letters from well-established senior figures with credentials',
            'Quantify achievements with specific metrics, impact, and recognition',
            'Consider AI/cybersecurity fast-track if eligible (3-week endorsement)',
            'Set up UKVI account early for eVisa - no physical stickers since July 2025'
          ]
        };

      case 'skilled-worker':
        return {
          keyPoints: [
            'MAJOR CHANGES from 22 July 2025: RQF Level 6+ required for NEW applications',
            'Salary threshold INCREASED to £41,700 minimum (up from £38,700)',
            'Hourly minimum: £17.13/hour plus occupation going rates',
            'About 180 occupations no longer eligible after July 2025',
            'Dependants restrictions for lower-skill roles (ISL/TSL)',
            'Transitional protection only for CoS issued before 22 July 2025'
          ],
          process: [
            'Secure job offer from licensed sponsor',
            'Employer applies for Certificate of Sponsorship',
            'Apply for visa with CoS reference',
            'Attend biometrics appointment',
            'Wait for visa decision (3-8 weeks)'
          ],
          costs: [
            'Visa application: £719',
            'Immigration Health Surcharge: £1,035 per year',
            'English language test: £150-200',
            'Biometrics: £19.20',
            'Total for 5 years: ~£6,000'
          ],
          timeline: '2-4 months (after job offer)',
          successTips: [
            'Check your occupation RQF level BEFORE applying (Level 6+ required from July 2025)',
            'Submit CoS before 22 July 2025 if your role is below RQF Level 6',
            'Ensure salary meets ALL three thresholds: £41,700, going rate, and £17.13/hour'
          ]
        };

      case 'graduate-route':
        return {
          keyPoints: [
            'For international students who completed their degree in the UK',
            'Undergraduates/Masters: valid for 18 months; PhD holders: 3 years',
            'No job offer or sponsorship needed',
            'Can work in any job at any skill level',
            'Cannot be extended - must switch to another visa route',
            'Must apply before current Student visa expires'
          ],
          process: [
            'Complete eligible course successfully',
            'Receive confirmation from university',
            'Apply online before Student visa expires',
            'Attend biometrics appointment',
            'Wait for decision (typically 8 weeks)'
          ],
          costs: [
            'Application fee: £880',
            'Immigration Health Surcharge: £1,035 per year',
            'Biometrics: £19.20',
            'Total for 18 months: ~£2,430'
          ],
          timeline: 'Typically 8 weeks',
          successTips: [
            'Apply as soon as university confirms course completion',
            'Ensure you apply before current visa expires',
            'Keep evidence of academic achievement',
            'Plan your next visa route early'
          ]
        };

      case 'visitor-eta':
        return {
          keyPoints: [
            'Standard Visitor permits stays up to 6 months',
            'Electronic Travel Authorisation (ETA) required for visa-exempt nationals',
            'ETA required from 2 April 2025 onward',
            'Tourism, business, or family visit purposes only',
            'Cannot work or study (except some short courses)',
            'Must show ties to home country'
          ],
          process: [
            'Determine if you need ETA or Standard Visitor visa',
            'Apply via appropriate channel (ETA app or visa application)',
            'Pay fees and provide documentation',
            'Attend biometrics if required',
            'Receive decision'
          ],
          costs: [
            'Standard Visitor: £115 (6 months)',
            'ETA: £16 (2 years validity)',
            'Biometrics: £19.20 (if required)'
          ],
          timeline: '~3 weeks for Standard Visitor; ~3 working days for ETA',
          successTips: [
            'Apply well in advance of travel',
            'Show clear purpose and ties to home country',
            'Provide adequate financial evidence',
            'Book accommodation and return flights'
          ]
        };

      case 'family-partner':
        return {
          keyPoints: [
            'For partners or parents of UK-based individuals',
            'Requires genuine and subsisting relationship',
            'Financial requirement: £18,600+ per year',
            'English language requirement applies',
            'Can lead to settlement after 5 years',
            'Must meet all relationship, financial, and accommodation requirements'
          ],
          process: [
            'Gather relationship evidence',
            'Meet financial requirements',
            'Pass English language test',
            'Apply online and pay fees',
            'Attend biometrics appointment',
            'Wait for decision (8-16 weeks)'
          ],
          costs: [
            'Application fee: £1,538 (within UK)',
            'Immigration Health Surcharge: £1,035 per year',
            'English language test: £150-200',
            'Total for 2.5 years: ~£4,000'
          ],
          timeline: '8-16 weeks',
          successTips: [
            'Gather extensive relationship evidence',
            'Ensure financial requirements are clearly met',
            'Pass English language test early',
            'Get legal advice if circumstances are complex'
          ]
        };

      default:
        return {
          keyPoints: route.requirements?.essential?.slice(0, 5) || [],
          process: [
            'Research visa requirements thoroughly',
            'Gather all required documents',
            'Apply online and pay fees',
            'Attend biometrics appointment',
            'Wait for decision'
          ],
          costs: ['Visa application fee varies', 'Immigration Health Surcharge if applicable', 'Biometrics fee: £19.20'],
          timeline: route.processingTime,
          successTips: []
        };
    }
  };

  const routeInfo = getRouteSpecificInfo();

  const getDocumentChecklist = () => {
    const baseDocuments = [
      { name: 'Valid Passport', status: 'required', description: 'Must be valid for at least 6 months' },
      { name: 'Passport Photos', status: 'required', description: '45mm x 35mm, color, recent' },
      { name: 'TB Test', status: 'conditional', description: 'If from listed countries only' },
      { name: 'Criminal Record Certificate', status: 'conditional', description: 'For stays over 6 months' }
    ];

    if (route.id === 'skilled-worker') {
      baseDocuments.unshift(
        { name: 'Certificate of Sponsorship', status: 'required', description: 'From your UK employer' },
        { name: 'English Language Certificate', status: 'required', description: 'IELTS, TOEFL, or PTE' },
        { name: 'Academic Qualifications', status: 'required', description: 'Degree certificates and transcripts' }
      );
    }

    if (route.id === 'global-talent') {
      baseDocuments.unshift(
        { name: 'Endorsement Letter', status: 'required', description: 'From approved competent body (£561 fee)' },
        { name: 'Comprehensive CV', status: 'required', description: 'Mandatory for all sectors since April 2025' },
        { name: '3 Reference Letters', status: 'required', description: 'From well-established senior figures with credentials' },
        { name: 'Sector-Specific Evidence', status: 'required', description: 'Publications, awards, media coverage, patents, portfolio as relevant' }
      );
    }

    if (route.id === 'student-visa') {
      baseDocuments.unshift(
        { name: 'CAS', status: 'required', description: 'Confirmation of Acceptance for Studies' },
        { name: 'Financial Evidence', status: 'required', description: 'Bank statements for 28 days' },
        { name: 'Academic Transcripts', status: 'required', description: 'Previous qualifications' }
      );
    }

    if (route.id === 'ancestry-visa') {
      baseDocuments.unshift(
        { name: 'Your Birth Certificate', status: 'required', description: 'Full birth certificate showing parent details' },
        { name: 'Parent\'s Birth Certificate', status: 'required', description: 'Connecting you to grandparent' },
        { name: 'Grandparent\'s Birth Certificate', status: 'required', description: 'Showing UK birth location' },
        { name: 'Evidence of Work Intention', status: 'required', description: 'Job offers, business plans, or qualifications' },
        { name: 'Financial Evidence', status: 'required', description: 'Bank statements or sponsorship letters' }
      );
    }

    return baseDocuments;
  };

  const documents = getDocumentChecklist();

  return (
    <div className="mobile-page-container bg-background">
      {/* Mobile Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border md:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mobile-back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold">{route.name}</span>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="mobile-page-content">
        <div className="container mx-auto px-4 py-4 md:py-8">
          {/* Desktop Back Button */}
          <Button 
            onClick={onBack}
            variant="ghost" 
            className="hidden md:flex mb-6 items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Routes</span>
          </Button>

          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="mb-4 md:mb-0">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{route.name}</h1>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{route.category}</Badge>
                      <Badge className={`${difficultyColors[route.difficulty]} border-0`}>
                        {route.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground">{route.description}</p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xl md:text-2xl font-bold text-primary">{difficultyScore[route.difficulty]}%</div>
                  <div className="text-sm text-muted-foreground">Avg. Success Rate</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-blue-600 mr-1" />
                      <div className="font-medium text-blue-600 text-xs md:text-sm">Processing Time</div>
                    </div>
                    <div className="text-sm md:text-lg font-bold">{route.processingTime}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <div className="font-medium text-green-600 text-xs md:text-sm">Min. Salary</div>
                    </div>
                    <div className="text-sm md:text-lg font-bold">
                      {route.minSalary ? `£${route.minSalary.toLocaleString()}` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <AlertCircle className="w-4 h-4 text-purple-600 mr-1" />
                      <div className="font-medium text-purple-600 text-xs md:text-sm">Timeline</div>
                    </div>
                    <div className="text-sm md:text-lg font-bold">{routeInfo.timeline}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FileText className="w-4 h-4 text-orange-600 mr-1" />
                      <div className="font-medium text-orange-600 text-xs md:text-sm">Requirements</div>
                    </div>
                    <div className="text-sm md:text-lg font-bold">
                      {route.requirements?.essential?.length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Complete Guide to {route.name}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Everything you need to know before starting your eligibility assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                    <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="requirements" className="text-xs md:text-sm">Requirements</TabsTrigger>
                    <TabsTrigger value="process" className="text-xs md:text-sm">Process</TabsTrigger>
                    <TabsTrigger value="costs" className="text-xs md:text-sm">Costs</TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs md:text-sm">Documents</TabsTrigger>
                    <TabsTrigger value="tips" className="text-xs md:text-sm">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Key Points You Need to Know</h3>
                      <div className="space-y-3">
                        {routeInfo.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription>
                        💡 This visa route has a {difficultyScore[route.difficulty]}% average success rate. 
                        Our eligibility assessment will help you understand your specific chances and what you need to improve.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Essential Requirements</h3>
                      <div className="space-y-4">
                        {(route.requirements?.essential || []).map((requirement, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{requirement}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {route.requirements?.desirable && route.requirements.desirable.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-4">Desirable Requirements</h3>
                        <div className="space-y-4">
                          {route.requirements.desirable.map((requirement, index) => (
                            <Card key={index} className="border-l-4 border-l-green-500">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-xs font-bold text-green-600">+</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{requirement}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {route.requirements?.disqualifying && route.requirements.disqualifying.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-4">Disqualifying Factors</h3>
                        <div className="space-y-4">
                          {route.requirements.disqualifying.map((requirement, index) => (
                            <Card key={index} className="border-l-4 border-l-red-500">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-xs font-bold text-red-600">×</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{requirement}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="process" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Step-by-Step Application Process</h3>
                      <div className="space-y-4">
                        {routeInfo.process.map((step, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-accent/30 rounded-lg">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Complete Cost Breakdown</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {routeInfo.costs.map((cost, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                                <span className="text-sm">{cost}</span>
                                {cost.includes('Total') && (
                                  <Badge className="bg-primary text-primary-foreground">
                                    Full Application
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <Alert className="mt-6">
                            <AlertDescription>
                              💰 These are approximate costs for 2025. Fees may change, and additional costs may apply for document translation, legal advice, or travel.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Document Preparation Checklist</h3>
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <Card key={index} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium">{doc.name}</h4>
                                    <Badge 
                                      variant={doc.status === 'required' ? 'destructive' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {doc.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </div>
                                {doc.status === 'required' && (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Expert Success Tips</h3>
                      <div className="space-y-4">
                        {routeInfo.successTips.map((tip, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-primary">💡</span>
                            </div>
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription>
                        🎯 Want personalized guidance? Our AI-powered eligibility assessment will analyze your specific situation and provide tailored recommendations for this visa route.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <Button 
                onClick={onStartEligibilityCheck}
                size="lg"
                className="flex-1 py-6 text-base"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start AI Eligibility Assessment
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open(route.ukviUrl, '_blank')}
                className="flex-1 py-6 text-base"
              >
                <FileText className="w-5 h-5 mr-2" />
                Official UK Gov Application
              </Button>
            </div>

            {/* Show specific guide buttons for certain routes */}
            {(route.id === 'skilled-worker' || route.id === 'student-visa' || route.id === 'graduate-route' || route.id === 'ancestry-visa') && (
              <div className="mt-4">
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    if (route.id === 'skilled-worker') setShowSkilledWorkerGuide(true);
                    if (route.id === 'student-visa') setShowStudentGuide(true);
                    if (route.id === 'graduate-route') setShowGraduateGuide(true);
                    if (route.id === 'ancestry-visa') setShowAncestryGuide(true);
                  }}
                  className="w-full py-6 text-base"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Detailed {route.name} Guide
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}