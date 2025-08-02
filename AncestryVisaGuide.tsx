import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";

interface AncestryVisaGuideProps {
  onStartAssessment?: () => void;
  onBack?: () => void;
}

export function AncestryVisaGuide({ onStartAssessment, onBack }: AncestryVisaGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="container mx-auto mobile-container py-6 sm:py-8">
      {onBack && (
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="mb-4 sm:mb-6 flex items-center space-x-2 touch-target mobile-tap"
        >
          <span>← Back to Visa Routes</span>
        </Button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Badge variant="secondary" className="mb-3">Family Category</Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4">UK Ancestry Visa Complete Guide</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Comprehensive guide for Commonwealth citizens with UK grandparents seeking to live and work in the UK for 5 years.
          </p>
        </div>

        {/* Quick Facts */}
        <Card className="mb-6 sm:mb-8 mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>Quick Facts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">5 Years</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">Application Fee</p>
                <p className="font-medium">£682</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">Health Surcharge</p>
                <p className="font-medium">£1,035/year</p>
              </div>
              <div className="p-3 bg-accent/50 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">Processing</p>
                <p className="font-medium">~3 weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mobile-scroll">
            <TabsTrigger value="overview" className="mobile-tap">Overview</TabsTrigger>
            <TabsTrigger value="eligibility" className="mobile-tap">Eligibility</TabsTrigger>
            <TabsTrigger value="application" className="mobile-tap">Application</TabsTrigger>
            <TabsTrigger value="settlement" className="mobile-tap">Settlement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>What is the UK Ancestry Visa?</CardTitle>
                <CardDescription>
                  A visa route for Commonwealth citizens with UK ancestry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm sm:text-base">
                  The UK Ancestry Visa allows Commonwealth citizens aged 17+ with at least one grandparent born in the UK, 
                  Channel Islands, Isle of Man, or Ireland before 31 March 1922, to live and work in the UK for 5 years.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium">What You Can Do:</h4>
                  <div className="grid gap-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-600">✓</span>
                      <div>
                        <p className="font-medium text-sm">Work</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Full-time, part-time, self-employed, and voluntary roles are allowed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-600">✓</span>
                      <div>
                        <p className="font-medium text-sm">Study</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Permitted, but main purpose should be work
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-600">✓</span>
                      <div>
                        <p className="font-medium text-sm">Bring Dependants</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Partner and children under 18 can join or extend with you
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> You can only switch to Ancestry from previous Ancestry leave. 
                    You cannot switch from Visitor, Student, or other visa types.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>2025 Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <strong>No major changes:</strong> Ancestry Visa rules remain consistent in 2025.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm">
                      <strong>Future changes:</strong> White Paper (late 2025) proposes extending ILR qualifying 
                      length to 10 years, but the current five-year route remains valid for Ancestry.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eligibility" className="space-y-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>
                  All criteria must be met to qualify for the Ancestry Visa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="age-citizenship">
                    <AccordionTrigger className="text-left">
                      Age & Citizenship Requirements
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <span className="text-primary mt-1">•</span>
                          <div>
                            <p className="font-medium text-sm">Age: 17 or older</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              At your intended travel date to the UK
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-primary mt-1">•</span>
                          <div>
                            <p className="font-medium text-sm">Commonwealth citizenship</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              E.g., Canada, Australia, New Zealand, South Africa, Zimbabwe, India, Pakistan, Malaysia
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="grandparent">
                    <AccordionTrigger className="text-left">
                      Qualifying Grandparent Requirement
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="space-y-3">
                        <p className="text-sm">
                          You must have at least one grandparent born in:
                        </p>
                        <div className="grid gap-2">
                          <div className="flex items-center space-x-2 p-2 bg-accent/50 rounded">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">UK (England, Scotland, Wales, Northern Ireland)</span>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-accent/50 rounded">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">Channel Islands or Isle of Man</span>
                          </div>
                          <div className="flex items-center space-x-2 p-2 bg-accent/50 rounded">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">Ireland before 31 March 1922</span>
                          </div>
                        </div>
                        <Alert>
                          <AlertDescription>
                            Must be documented by birth certificate or UK-recognised adoption certificate.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="work-financial">
                    <AccordionTrigger className="text-left">
                      Work & Financial Requirements
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="font-medium text-sm mb-2">Work Requirement</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            You must be able and planning to work in the UK (no specific job offer required, 
                            but must demonstrate intent and ability)
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="font-medium text-sm mb-2">Financial Requirement</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Support yourself (and family, if any) without public funds. Provide evidence 
                            such as bank statements or sponsorship letters.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="health-docs">
                    <AccordionTrigger className="text-left">
                      Health & Documentation
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <span className="text-primary mt-1">•</span>
                          <div>
                            <p className="font-medium text-sm">TB Certificate</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Required if resident in high-risk country for 6+ months (valid for 6 months)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="text-primary mt-1">•</span>
                          <div>
                            <p className="font-medium text-sm">Valid Passport</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              With at least one blank page for visa vignette
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
                <CardDescription>
                  Step-by-step guide to applying for your Ancestry Visa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Document Checklist */}
                  <div>
                    <h4 className="font-medium mb-3">📄 Required Documents</h4>
                    <div className="space-y-2">
                      {[
                        'Valid passport (plus one blank page)',
                        'Your full birth certificate',
                        'Parent\'s full birth certificate (connecting you to grandparent)',
                        'Grandparent\'s full birth certificate showing UK birth',
                        'Adoption/deed-poll/marriage documents if names changed',
                        'Proof of intent to work (job offer or self-employment plan)',
                        'Financial evidence (bank statements or sponsorship)',
                        'TB certificate (if required)',
                        'Partner/child documents if applicable'
                      ].map((doc, index) => (
                        <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Costs */}
                  <div>
                    <h4 className="font-medium mb-3">💷 Costs Breakdown</h4>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                        <span className="text-sm">Application fee</span>
                        <span className="font-medium">£682</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                        <span className="text-sm">Immigration Health Surcharge</span>
                        <span className="font-medium">£1,035/year</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <span className="text-sm font-medium">Total for 5 years</span>
                        <span className="font-medium text-primary">£5,857</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium mb-3">⏱️ Processing Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Standard Processing</p>
                          <p className="text-xs text-muted-foreground">~3 weeks for overseas applications</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">Priority Service</p>
                          <p className="text-xs text-muted-foreground">Often available for faster processing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settlement" className="space-y-6">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>Path to Settlement & Citizenship</CardTitle>
                <CardDescription>
                  Your journey to permanent residence and British citizenship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Settlement Timeline */}
                  <div>
                    <h4 className="font-medium mb-4">Settlement Timeline</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-primary rounded-full"></div>
                            <div className="w-0.5 h-12 bg-primary/30 mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2">Year 0-5</Badge>
                            <h5 className="font-medium">Ancestry Visa</h5>
                            <p className="text-sm text-muted-foreground">Live and work in the UK freely</p>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-primary rounded-full"></div>
                            <div className="w-0.5 h-12 bg-primary/30 mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2">After 5 Years</Badge>
                            <h5 className="font-medium">Apply for ILR or Extension</h5>
                            <p className="text-sm text-muted-foreground">
                              Indefinite Leave to Remain (permanent residence) or extend for another 5 years
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-start space-x-4">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-primary rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2">After ILR + 12 Months</Badge>
                            <h5 className="font-medium">British Citizenship</h5>
                            <p className="text-sm text-muted-foreground">
                              Apply for British citizenship (usually 12 months after ILR)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ILR Requirements */}
                  <div>
                    <h4 className="font-medium mb-3">ILR Requirements (After 5 Years)</h4>
                    <div className="space-y-2">
                      {[
                        'Continuous residence (absences <180 days per year)',
                        'Being in work or actively seeking work',
                        'Pass Life in the UK test',
                        'English language B1 minimum',
                        'Meet good character requirement',
                        'No serious criminal convictions'
                      ].map((req, index) => (
                        <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Family ILR:</strong> Once you get ILR, eligible dependants can apply 
                      for ILR at the same time.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="text-center mobile-card">
          <CardContent className="pt-6">
            <h3 className="text-lg mb-4">Ready to Check Your Eligibility?</h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Take our comprehensive assessment to see if you qualify for the UK Ancestry Visa
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={onStartAssessment}
                size="lg"
                className="mobile-button touch-target mobile-tap"
              >
                Start Eligibility Assessment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="mobile-button touch-target mobile-tap"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}