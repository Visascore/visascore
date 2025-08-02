import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";

interface GlobalTalentGuideProps {
  onBack: () => void;
  onStartAssessment: () => void;
}

export function GlobalTalentGuide({ onBack, onStartAssessment }: GlobalTalentGuideProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const handleChecklistItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const checklistItems = {
    eligibility: [
      "Check if you have won a prestigious international prize (skip endorsement if yes)",
      "Identify your sector: Academia/Research, Arts/Culture, or Digital Technology", 
      "Determine your level: Exceptional Talent (proven leader) or Exceptional Promise (emerging leader)",
      "Confirm you meet sector-specific mandatory criteria",
      "Verify you can obtain 3 strong reference letters from senior figures"
    ],
    endorsement: [
      "Select correct endorsing body for your sector",
      "Prepare comprehensive CV (mandatory since April 2025)",
      "Draft detailed personal statement explaining achievements and UK contribution",
      "Gather 3 reference letters from well-established senior figures with credentials",
      "Compile sector-specific evidence (publications, awards, media coverage, patents, portfolio)",
      "Document working relationships (April 2025 requirement)",
      "Apply via Home Office platform (Tech Nation until Aug 3 for tech)"
    ],
    visa: [
      "Receive endorsement decision (3-8 weeks, AI/cyber: 3 weeks)",
      "Apply for visa within 3 months of endorsement award",
      "Set up UKVI account and register passport for eVisa",
      "Complete online visa application on GOV.UK",
      "Pay visa fees (£205) and Immigration Health Surcharge (£1,035/year)",
      "Attend biometrics appointment",
      "Receive eVisa decision (~3 weeks) - no physical stickers since July 15, 2025"
    ],
    settlement: [
      "Track time in UK for ILR eligibility",
      "Understand ILR timeline: 3 years (academia/arts) or 5 years (tech)",
      "Maintain continuous residence requirements",
      "Plan for ILR application 2-3 months before eligibility",
      "Apply for British citizenship 12 months after ILR (if desired)"
    ]
  };

  const getProgress = () => {
    const totalItems = Object.values(checklistItems).flat().length;
    return (checkedItems.size / totalItems) * 100;
  };

  return (
    <div className="container mx-auto mobile-container py-6 sm:py-8">
      <Button 
        onClick={onBack}
        variant="ghost" 
        className="mb-4 sm:mb-6 flex items-center space-x-2 touch-target mobile-tap"
      >
        <span>← Back to Global Talent Visa Details</span>
      </Button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4" variant="secondary">
            Complete Guide - Updated 2025
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4">Global Talent Visa: Complete Step-by-Step Guide</h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            Comprehensive 2025 guide for exceptional individuals in academia, arts, and digital technology. 
            Updated with latest endorsing bodies, fees, eVisa system, and fast-track options.
          </p>

          {/* Important Notice */}
          <Alert className="mt-6 sm:mt-8 max-w-4xl mx-auto border-amber-200 bg-amber-50 dark:bg-amber-900/20 mobile-card">
            <AlertDescription className="text-center text-sm sm:text-base">
              <strong>📚 Important:</strong> Please review this comprehensive guide before starting your eligibility assessment. 
              Understanding the Global Talent visa process will help you provide accurate responses and get better results.
            </AlertDescription>
          </Alert>
          
          {/* Progress Tracker */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg mobile-card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm sm:text-base">Your Progress</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {checkedItems.size} of {Object.values(checklistItems).flat().length} items complete
              </span>
            </div>
            <Progress value={getProgress()} className="h-2 sm:h-3" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mobile-scroll">
            <TabsTrigger value="overview" className="mobile-tap">Overview</TabsTrigger>
            <TabsTrigger value="sectors" className="mobile-tap">Sectors</TabsTrigger>
            <TabsTrigger value="endorsement" className="mobile-tap">Endorsement</TabsTrigger>
            <TabsTrigger value="visa-application" className="mobile-tap">Visa Application</TabsTrigger>
            <TabsTrigger value="checklist" className="mobile-tap">Checklist</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>The 2025 Global Talent Visa Journey</CardTitle>
                <CardDescription>
                  A two-step endorsement + visa route for exceptional individuals with 2025 updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 border rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <h3 className="text-base sm:text-lg font-semibold">Stage 1: Endorsement</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        Get endorsed by the designated body to validate your exceptional talent or promise
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                          <span>Apply to sector-specific endorsing body</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                          <span>Fee: £561 (updated 2025)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                          <span>Decision: 3-8 weeks (AI/cyber: 3 weeks fast-track)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 sm:p-6 border rounded-lg bg-green-50/50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <h3 className="text-base sm:text-lg font-semibold">Stage 2: Visa Application</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        Apply for the actual visa with your endorsement letter (within 3 months)
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-1"></div>
                          <span>Apply through GOV.UK portal</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-1"></div>
                          <span>Fee: £205 + £1,035/year IHS</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-1"></div>
                          <span>eVisa only - no physical stickers (since July 15, 2025)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Quick Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base sm:text-lg">2025 Quick Facts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Cost (5 years)</p>
                            <p className="font-medium text-sm sm:text-base">~£5,941</p>
                          </div>
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <p className="text-xs sm:text-sm text-muted-foreground">Processing Time</p>
                            <p className="font-medium text-sm sm:text-base">4-11 weeks</p>
                          </div>
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <p className="text-xs sm:text-sm text-muted-foreground">ILR Eligibility</p>
                            <p className="font-medium text-sm sm:text-base">3-5 years</p>
                          </div>
                          <div className="p-3 bg-accent/50 rounded-lg">
                            <p className="text-xs sm:text-sm text-muted-foreground">Work Rights</p>
                            <p className="font-medium text-sm sm:text-base">Full flexibility</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="p-4 sm:p-6 border rounded-lg">
                      <h3 className="font-semibold mb-4 text-sm sm:text-base">Key Benefits</h3>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <li className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>Work for any employer without sponsorship</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>Start your own business or be self-employed</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>Bring dependants (partner and children under 18)</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>Path to settlement: 3 years (academia/arts) or 5 years (tech)</span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>Unlimited extensions - stay as long as needed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <AlertDescription className="text-xs sm:text-sm">
                      <strong>💡 2025 Updates:</strong> Tech Nation remains the active endorsing body for digital technology. 
                      All Global Talent visas are now electronic (eVisa). Fast-track endorsement available for AI/cybersecurity professionals.
                      CV is now mandatory for all sectors since April 2025.
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mobile-card">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">Ready to Start Your Assessment?</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Our assessment evaluates your eligibility based on 2025 Global Talent visa criteria
                        </p>
                      </div>
                      <Button 
                        onClick={onStartAssessment} 
                        className="w-full sm:w-auto mobile-button touch-target mobile-tap"
                      >
                        Start Eligibility Check
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sectors Tab */}
          <TabsContent value="sectors" className="space-y-6 sm:space-y-8">
            <div className="grid gap-6 sm:gap-8">
              {/* Academia & Research */}
              <Card className="mobile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📘</span>
                    <span>Academia & Research</span>
                  </CardTitle>
                  <CardDescription>
                    Endorsers: Royal Society, British Academy, Royal Academy of Engineering, UKRI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Available Routes:</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">Academic/Research Appointments</h5>
                        <p className="text-xs text-muted-foreground">Job offer at approved UK institution</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">Individual Fellowships</h5>
                        <p className="text-xs text-muted-foreground">Must have won qualifying fellowship</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">Endorsed Funder Route</h5>
                        <p className="text-xs text-muted-foreground">Research funded by endorsed UKRI organization</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">Peer Review</h5>
                        <p className="text-xs text-muted-foreground">Show leadership/potential in academic/research fields</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Key Evidence Required:</h4>
                    <ul className="text-xs sm:text-sm space-y-1">
                      <li>• PhD or equivalent research experience</li>
                      <li>• Job offer at recognized UK institution OR prestigious research fellowship</li>
                      <li>• At least one significant publication plus evidence of peer-reviewed work</li>
                      <li>• Strong track record of contribution to field with measurable impact</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Arts & Culture */}
              <Card className="mobile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🎨</span>
                    <span>Arts & Culture</span>
                  </CardTitle>
                  <CardDescription>
                    Endorser: Arts Council England - dance, music, theatre, film, visual arts, literature, architecture, fashion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Categories:</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h5 className="font-medium text-sm">Exceptional Talent</h5>
                        <p className="text-xs text-muted-foreground">Established career with international recognition</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-sm">Exceptional Promise</h5>
                        <p className="text-xs text-muted-foreground">Emerging artist showing strong potential</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Evidence Required:</h4>
                    <ul className="text-xs sm:text-sm space-y-1">
                      <li>• 3 letters of recommendation from recognized experts (must include credentials)</li>
                      <li>• International/media recognition (press coverage, reviews, awards)</li>
                      <li>• Performances, exhibitions, publications, showcases</li>
                      <li>• For Promise: evidence of growing public profile or mentorship from leader</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Examples:</h4>
                    <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                      <p>• Film director with shortlisting for major festivals (Cannes, BAFTA)</p>
                      <p>• Fashion designer featured in international collections or fashion weeks</p>
                      <p>• Architect with significant building commissions and awards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Digital Technology */}
              <Card className="mobile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>💻</span>
                    <span>Digital Technology</span>
                  </CardTitle>
                  <CardDescription>
                    Endorser: Tech Nation (active) - AI, machine learning, fintech, SaaS, blockchain, gaming, cybersecurity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <AlertDescription className="text-xs sm:text-sm">
                      <strong>✅ Updated:</strong> Tech Nation remains the active endorsing body for digital technology. 
                      Fast-track available for AI/cybersecurity professionals (3-week endorsement).
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Categories:</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h5 className="font-medium text-sm">Exceptional Talent</h5>
                        <p className="text-xs text-muted-foreground">Senior technologists, founders, leaders</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="font-medium text-sm">Exceptional Promise</h5>
                        <p className="text-xs text-muted-foreground">Early-career engineers, product managers, startup founders</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Mandatory Criteria (choose 1):</h4>
                    <ul className="text-xs sm:text-sm space-y-1">
                      <li>• Recognition as leader (or emerging leader) in digital sector</li>
                      <li>• Demonstrable technical or business innovation/contribution</li>
                      <li>• Proven record of impactful work in product-led digital technology company</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Optional Criteria (choose 2):</h4>
                    <ul className="text-xs sm:text-sm space-y-1">
                      <li>• Proof of innovation (patents, product design, system architecture)</li>
                      <li>• Recognition via awards, speaking engagements, open-source contributions</li>
                      <li>• High salary or leadership in scaling digital business</li>
                      <li>• Contribution to tech community (mentoring, public speaking, open-source)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Required Evidence:</h4>
                    <ul className="text-xs sm:text-sm space-y-1">
                      <li>• CV (mandatory since April 2025)</li>
                      <li>• 3 letters of recommendation from established figures in digital space</li>
                      <li>• At least 10 documents (PDFs), each up to 3 A4 pages</li>
                      <li>• Proof of work history, GitHub, product screenshots, press coverage</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Prestigious Prizes */}
              <Card className="mobile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🏅</span>
                    <span>Prestigious Prize Winners</span>
                  </CardTitle>
                  <CardDescription>
                    Skip endorsement entirely with recognized international prizes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">Qualifying Prizes:</h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <p>• Nobel Prize</p>
                        <p>• Academy Award (Oscars)</p>
                        <p>• Fields Medal</p>
                        <p>• Turing Award</p>
                      </div>
                      <div className="space-y-1">
                        <p>• BAFTA</p>
                        <p>• Booker Prize</p>
                        <p>• International Mathematical Olympiad</p>
                        <p>• Other recognized international prizes</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mt-3 font-medium">
                      ✅ Apply directly to visa stage - no endorsement letter required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Endorsement Tab */}
          <TabsContent value="endorsement" className="space-y-6 sm:space-y-8">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>2025 Endorsement Process</CardTitle>
                <CardDescription>
                  Updated process with current endorsing bodies and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline */}
                  <div>
                    <h4 className="font-semibold mb-4 text-sm sm:text-base">Endorsement Processing Times (2025)</h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-green-600 font-bold text-sm sm:text-base">3 weeks</div>
                        <div className="text-xs text-muted-foreground">AI/Cybersecurity Fast-track</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-blue-600 font-bold text-sm sm:text-base">3-5 weeks</div>
                        <div className="text-xs text-muted-foreground">Digital Technology Standard</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-purple-600 font-bold text-sm sm:text-base">~8 weeks</div>
                        <div className="text-xs text-muted-foreground">Academic & Arts</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Required Documents */}
                  <div>
                    <h4 className="font-semibold mb-4 text-sm sm:text-base">Supporting Documents - General Requirements</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">1. Detailed CV (mandatory since April 2025)</h5>
                        <p className="text-xs text-muted-foreground">Required for all sectors, must include complete work history and achievements</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">2. Three Recommendation Letters</h5>
                        <p className="text-xs text-muted-foreground">
                          From well-established, senior figures. Letters must be signed, dated, include contact details, 
                          and explain achievements, peer comparison, and UK contribution potential.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">3. Sector-Specific Evidence</h5>
                        <p className="text-xs text-muted-foreground">
                          Publications, awards, media coverage, patents, portfolio work - tailored to your field
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">4. Working Relationship Documentation (April 2025)</h5>
                        <p className="text-xs text-muted-foreground">
                          Evidence of professional relationships and collaboration
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                    <AlertDescription className="text-xs sm:text-sm">
                      <strong>📅 Application Platform:</strong> From August 4, 2025, endorsement forms consolidate to 
                      Home Office platform. Tech Nation remains the endorser but applications go through the central system.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visa Application Tab */}
          <TabsContent value="visa-application" className="space-y-6 sm:space-y-8">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>Visa Application Stage</CardTitle>
                <CardDescription>
                  After receiving endorsement - complete within 3 months
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timeline */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">⏳ Visa Application Timeline</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Apply within:</span>
                      <span className="font-medium">3 months of endorsement</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision time (outside UK):</span>
                      <span className="font-medium">~3 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decision time (inside UK):</span>
                      <span className="font-medium">~3 weeks</span>
                    </div>
                  </div>
                </div>

                {/* Fees */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">💷 Visa Fees & Costs (2025)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <span className="text-sm">Visa application fee</span>
                      <span className="font-medium">£205</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <span className="text-sm">Immigration Health Surcharge</span>
                      <span className="font-medium">£1,035/year</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium">Combined total (endorsement + visa + 5yr IHS)</span>
                      <span className="font-medium text-primary">£5,941</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <span className="text-sm font-medium">Combined total (endorsement + visa + 3yr IHS)</span>
                      <span className="font-medium text-primary">£3,871</span>
                    </div>
                  </div>
                </div>

                {/* eVisa System */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">📱 eVisa System (Since July 15, 2025)</h4>
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <AlertDescription className="text-xs sm:text-sm space-y-2">
                      <p><strong>Important:</strong> All Global Talent visas are now electronic (eVisa) - no physical vignette stickers.</p>
                      <p>You must:</p>
                      <ul className="text-xs space-y-1 mt-2">
                        <li>• Set up UKVI account before applying</li>
                        <li>• Register your passport for eVisa</li>
                        <li>• Use eVisa to prove your status when traveling</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Dependants */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">👨‍👩‍👧‍👦 Dependants & Family</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Who can join you:</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Partner (spouse, civil partner, or unmarried partner with 2+ years relationship)</li>
                        <li>• Children under 18</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Dependant benefits:</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Can work and study in the UK</li>
                        <li>• Can apply for ILR when main applicant becomes eligible</li>
                        <li>• Can apply for British citizenship after ILR</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6 sm:space-y-8">
            <Card className="mobile-card">
              <CardHeader>
                <CardTitle>Interactive Preparation Checklist</CardTitle>
                <CardDescription>
                  Track your progress through each stage of the Global Talent visa process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Summary */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm sm:text-base">Overall Progress</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {checkedItems.size} of {Object.values(checklistItems).flat().length} completed
                    </span>
                  </div>
                  <Progress value={getProgress()} className="h-2 sm:h-3" />
                </div>

                {/* Checklists by Stage */}
                <Accordion type="multiple" className="space-y-4">
                  <AccordionItem value="eligibility">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          Step 1
                        </Badge>
                        <span className="text-sm sm:text-base">Eligibility & Self-Assessment</span>
                        <Badge variant="secondary" className="text-xs">
                          {checklistItems.eligibility.filter(item => checkedItems.has(item)).length}/{checklistItems.eligibility.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {checklistItems.eligibility.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50">
                            <Checkbox
                              id={`eligibility-${index}`}
                              checked={checkedItems.has(item)}
                              onCheckedChange={() => handleChecklistItem(item)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`eligibility-${index}`} 
                              className="text-xs sm:text-sm cursor-pointer flex-1"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="endorsement">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          Step 2
                        </Badge>
                        <span className="text-sm sm:text-base">Endorsement Preparation</span>
                        <Badge variant="secondary" className="text-xs">
                          {checklistItems.endorsement.filter(item => checkedItems.has(item)).length}/{checklistItems.endorsement.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {checklistItems.endorsement.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50">
                            <Checkbox
                              id={`endorsement-${index}`}
                              checked={checkedItems.has(item)}
                              onCheckedChange={() => handleChecklistItem(item)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`endorsement-${index}`} 
                              className="text-xs sm:text-sm cursor-pointer flex-1"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="visa">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          Step 3
                        </Badge>
                        <span className="text-sm sm:text-base">Visa Application</span>
                        <Badge variant="secondary" className="text-xs">
                          {checklistItems.visa.filter(item => checkedItems.has(item)).length}/{checklistItems.visa.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {checklistItems.visa.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50">
                            <Checkbox
                              id={`visa-${index}`}
                              checked={checkedItems.has(item)}
                              onCheckedChange={() => handleChecklistItem(item)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`visa-${index}`} 
                              className="text-xs sm:text-sm cursor-pointer flex-1"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="settlement">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-xs">
                          Step 4
                        </Badge>
                        <span className="text-sm sm:text-base">Settlement Planning</span>
                        <Badge variant="secondary" className="text-xs">
                          {checklistItems.settlement.filter(item => checkedItems.has(item)).length}/{checklistItems.settlement.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {checklistItems.settlement.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50">
                            <Checkbox
                              id={`settlement-${index}`}
                              checked={checkedItems.has(item)}
                              onCheckedChange={() => handleChecklistItem(item)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`settlement-${index}`} 
                              className="text-xs sm:text-sm cursor-pointer flex-1"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 mobile-card">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="font-semibold mb-4 text-sm sm:text-base">Ready to Start Your Eligibility Assessment?</h3>
                <p className="text-muted-foreground mb-6 text-xs sm:text-sm">
                  Use this comprehensive guide information to provide accurate responses in our assessment
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={onStartAssessment}
                    size="lg"
                    className="mobile-button touch-target mobile-tap"
                  >
                    Start Eligibility Check
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}