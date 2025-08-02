import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'policy' | 'processing' | 'requirement' | 'announcement';
  severity: 'low' | 'medium' | 'high';
  date: string;
  source: string;
  visaTypes: string[];
  isBreaking?: boolean;
  fullContent?: string;
  keyPoints?: string[];
  impact?: string;
  effectiveDate?: string;
  relatedLinks?: Array<{ title: string; url: string }>;
}

interface NewsDetailProps {
  newsId: string;
  onBack: () => void;
}

export function NewsDetail({ newsId, onBack }: NewsDetailProps) {
  // Mock news data with full content for 2025 - in real app this would come from API
  const getNewsDetails = (id: string): NewsItem | null => {
    const newsData: { [key: string]: NewsItem } = {
      '1': {
        id: '1',
        title: 'UK Skilled Worker Visa Salary Thresholds Updated for Q3 2025',
        summary: 'Updated salary requirements for Skilled Worker visas come into effect, with new rates for different skill levels and regional variations to address cost of living differences.',
        category: 'policy',
        severity: 'high',
        date: '2025-07-22',
        source: 'UK Visas and Immigration',
        visaTypes: ['Skilled Worker'],
        isBreaking: true,
        effectiveDate: 'August 1, 2025',
        impact: 'These changes affect all new Skilled Worker visa applications and provide more realistic salary requirements that reflect regional economic conditions across the UK.',
        fullContent: `UK Visas and Immigration has announced updated salary thresholds for Skilled Worker visas, introducing a more nuanced approach that considers regional cost of living variations and skill levels. The new framework comes into effect on August 1, 2025, and represents the most significant update to the Skilled Worker route since its introduction.

The updated system introduces three salary bands based on skill level and regional location:

**Tier 1 (Major Cities - London, Edinburgh, Manchester, Birmingham):**
- RQF Level 6+ (Graduate level): £38,700 minimum
- RQF Level 3-5 (Skilled trades): £32,500 minimum
- Shortage occupations: £30,960 minimum (20% reduction)

**Tier 2 (Regional Cities and Large Towns):**
- RQF Level 6+ (Graduate level): £34,200 minimum
- RQF Level 3-5 (Skilled trades): £28,800 minimum
- Shortage occupations: £27,360 minimum (20% reduction)

**Tier 3 (Other Areas):**
- RQF Level 6+ (Graduate level): £31,200 minimum
- RQF Level 3-5 (Skilled trades): £26,200 minimum
- Shortage occupations: £24,960 minimum (20% reduction)

This regional approach acknowledges that living costs vary significantly across the UK, with London and major cities requiring higher salaries to maintain equivalent living standards. The changes aim to make the UK more accessible to skilled workers while ensuring they can maintain a reasonable quality of life.

Key improvements include:
- Regional salary bands reflecting local cost of living
- Skill-level differentiation for more appropriate requirements
- Enhanced protections for workers in shortage occupations
- Streamlined salary calculation process
- Annual review mechanism to ensure thresholds remain appropriate

The announcement follows extensive consultation with employers, trade unions, and regional development agencies. Many businesses outside major cities had reported difficulties attracting international talent due to London-centric salary requirements that didn't reflect local pay scales.

For existing visa holders, these changes apply only to visa renewals or job changes. Current visa holders are protected under existing arrangements until their visa expires. The Home Office has confirmed that the new system will be reviewed annually to ensure it continues to meet economic needs while protecting workers.

Industry sectors particularly benefiting from these changes include healthcare, education, engineering, and information technology, where regional salary variations are most pronounced. The government estimates that these changes could increase skilled migration to regions outside London by up to 25%.`,
        keyPoints: [
          'Regional salary bands introduced based on cost of living differences',
          'Three-tier system for major cities, regional cities, and other areas',
          'Skill-level differentiation with separate requirements for different qualification levels',
          'Effective August 1, 2025 for all new applications',
          'Annual review mechanism to maintain appropriate thresholds',
          'Existing visa holders protected until renewal',
          'Expected to increase regional skilled migration by 25%'
        ],
        relatedLinks: [
          { title: 'Regional Salary Calculator Tool', url: '#' },
          { title: 'Skilled Worker Visa Guide 2025', url: '#' },
          { title: 'Shortage Occupation List Updates', url: '#' },
          { title: 'Cost of Living Index by Region', url: '#' }
        ]
      },
      '2': {
        id: '2',
        title: 'Graduate Visa Extension for AI and Data Science Graduates',
        summary: 'New 3-year Graduate visa option introduced for AI, machine learning, and data science graduates from UK universities, reflecting critical skills shortage in these sectors.',
        category: 'policy',
        severity: 'high',
        date: '2025-07-21',
        source: 'Home Office',
        visaTypes: ['Graduate Visa', 'Student'],
        isBreaking: true,
        effectiveDate: 'September 1, 2025',
        impact: 'This extension specifically targets the UK\'s critical need for AI and data science expertise, helping retain top talent in strategic sectors.',
        fullContent: `The Home Office has announced a groundbreaking extension to the Graduate visa route, introducing a special 3-year option for graduates in Artificial Intelligence, Machine Learning, and Data Science fields. This targeted extension reflects the UK government's recognition of the critical skills shortage in these rapidly growing sectors.

The new AI and Data Science Graduate visa represents a significant departure from the standard 2-year Graduate visa, acknowledging that these specialized fields require longer periods for professionals to develop expertise and contribute meaningfully to the UK's digital economy transformation.

**Qualifying Degrees and Fields:**
- Artificial Intelligence and Machine Learning
- Data Science and Analytics
- Computational Biology and Bioinformatics
- Robotics and Autonomous Systems
- Computer Vision and Natural Language Processing
- Quantum Computing
- Cybersecurity with AI components

The extension applies to graduates from any UK university with a recognized program in these fields, including both undergraduate and postgraduate degrees. PhD graduates in qualifying subjects will be eligible for an additional 6-month extension, bringing their total Graduate visa period to 3.5 years.

This policy change comes in response to industry demand and follows extensive consultation with major UK technology companies, including Google DeepMind, ARM, and Rolls-Royce, who highlighted the difficulty in attracting and retaining international AI talent. The UK AI sector has grown by 47% in the past year, with over 15,000 new jobs created, but faces significant skills gaps.

**Key Benefits for Graduates:**
- Extended time to gain specialized experience in cutting-edge fields
- Opportunity to contribute to breakthrough research and development projects
- Better job market positioning for highly competitive roles
- Time to develop industry networks and partnerships
- Pathway to securing Skilled Worker sponsorship in specialized roles

The government estimates that approximately 8,000 international students annually will benefit from this extension. These graduates contribute significantly to the UK's innovation economy, with AI and data science graduates showing average starting salaries 35% higher than other fields.

Universities have welcomed the announcement, noting that it enhances the UK's competitiveness against other major destinations like Canada and Australia, which have implemented similar targeted retention strategies for STEM graduates.

The extension is part of the broader UK AI Strategy 2025, which aims to establish the UK as a global leader in responsible AI development and deployment.`,
        keyPoints: [
          '3-year Graduate visa for AI, ML, and Data Science graduates',
          'PhD graduates eligible for additional 6-month extension (3.5 years total)',
          'Applies to all UK universities with recognized programs',
          'Effective September 1, 2025 for new graduates',
          'Addresses critical skills shortage in strategic tech sectors',
          'Expected to benefit 8,000 international students annually',
          'Part of broader UK AI Strategy 2025 initiative'
        ],
        relatedLinks: [
          { title: 'Qualifying AI and Data Science Programs', url: '#' },
          { title: 'Graduate Visa Extension Application Guide', url: '#' },
          { title: 'UK AI Strategy 2025 Overview', url: '#' },
          { title: 'Industry Skills Gap Report', url: '#' }
        ]
      },
      '3': {
        id: '3',
        title: 'Family Visa Processing Times Accelerated with Digital System',
        summary: 'New digital-first approach reduces Family visa processing times to 4-6 weeks, with enhanced online document verification and automated eligibility checks.',
        category: 'processing',
        severity: 'medium',
        date: '2025-07-20',
        source: 'UK Visas and Immigration',
        visaTypes: ['Family Visa'],
        effectiveDate: 'August 1, 2025',
        impact: 'Significantly reduces family separation time and improves the overall experience for families applying to reunite in the UK.',
        fullContent: `UK Visas and Immigration has launched a comprehensive digital transformation of the Family visa processing system, reducing standard processing times from 12 weeks to just 4-6 weeks. This represents the most significant improvement in family immigration processing in over a decade.

The new digital-first system introduces several groundbreaking features designed to streamline the application process while maintaining robust security and eligibility checks:

**Digital Document Verification System:**
- Advanced AI-powered document authentication
- Real-time verification of bank statements and financial documents
- Automated cross-checking with official databases
- Digital signature verification for supporting letters

**Enhanced Online Application Platform:**
- Intuitive step-by-step guidance system
- Real-time eligibility checking as applications are completed
- Automated detection of common errors before submission
- Multi-language support for 15 languages

**Streamlined Evidence Requirements:**
- Digital-only submission for most document types
- Reduced paperwork with smart form pre-population
- Optional video interviews for complex cases
- Enhanced mobile app for document photography

The transformation addresses long-standing concerns about Family visa processing delays that have caused significant hardship for families separated during application periods. The previous system, largely paper-based and manual, was prone to delays and required extensive back-and-forth communication.

**Processing Timeline Improvements:**
- Standard applications: 4-6 weeks (previously 12 weeks)
- Priority service: 2-3 weeks (additional £500 fee)
- Super priority service: 1 week (additional £1,000 fee)
- Settlement applications: 6-8 weeks (previously 16 weeks)

The new system includes enhanced communication features, with applicants receiving regular SMS and email updates on application progress. A dedicated family visa helpline provides support in multiple languages, and live chat assistance is available during UK business hours.

Early pilot testing showed a 78% reduction in processing times and a 45% decrease in requests for additional information, indicating that the new system better guides applicants to submit complete applications initially.

The digital transformation required a £25 million investment in new technology infrastructure and staff training. The Home Office worked closely with technology partners and user experience specialists to ensure the system is accessible to users with varying levels of digital literacy.

For complex cases involving domestic violence, refugee protection, or exceptional circumstances, dedicated case workers provide personalized support while still benefiting from the accelerated processing framework.`,
        keyPoints: [
          'Processing times reduced from 12 to 4-6 weeks for standard applications',
          'AI-powered document verification and automated eligibility checks',
          'Digital-only submission with mobile app support',
          'Multi-language support and enhanced communication',
          'Priority services available for faster processing',
          '78% reduction in processing times during pilot testing',
          '£25 million investment in digital infrastructure'
        ],
        relatedLinks: [
          { title: 'New Family Visa Digital Portal', url: '#' },
          { title: 'Document Upload Guidelines', url: '#' },
          { title: 'Processing Time Tracker', url: '#' },
          { title: 'Family Visa Mobile App Download', url: '#' }
        ]
      },
      '7': {
        id: '7',
        title: 'Electronic Travel Authorization Now Required for US Citizens',
        summary: 'US citizens must now obtain ETA before traveling to the UK for visits up to 6 months. Digital application system processes applications within 72 hours.',
        category: 'requirement',
        severity: 'high',
        date: '2025-07-16',
        source: 'Home Office',
        visaTypes: ['Visitor', 'ETA'],
        effectiveDate: 'August 15, 2025',
        impact: 'This change affects millions of US travelers annually and represents a significant shift in US-UK travel arrangements.',
        fullContent: `The UK government has announced that US citizens will be required to obtain an Electronic Travel Authorization (ETA) before traveling to the UK for visits of up to 6 months, effective August 15, 2025. This marks the end of visa-free travel for US citizens and brings the US in line with most other countries requiring pre-travel authorization.

The ETA requirement extends the UK's digital border strategy, which has already been successfully implemented for citizens of Qatar, Bahrain, Kuwait, Oman, UAE, and Saudi Arabia. The system is designed to enhance border security while maintaining efficient processing for legitimate travelers.

**Key Features of the US ETA System:**
- Digital application process taking 10-15 minutes to complete
- £10 application fee (approximately $12.50 USD)
- Multiple entry authorization valid for 2 years or until passport expiry
- 72-hour processing time for most applications
- 24/7 online application availability

The ETA covers all forms of temporary visits including tourism, business meetings, transit, and visiting family and friends. It does not replace visa requirements for those intending to work, study, or stay for more than 6 months, who must continue to apply for appropriate visas.

**Application Requirements:**
- Valid US passport with at least 6 months remaining validity
- Digital passport photo meeting UK standards
- Travel and accommodation details
- Contact information for UK sponsor (if applicable)
- Criminal history and immigration violation declarations

The implementation follows extensive security cooperation between UK and US authorities. The ETA system allows for enhanced background checking and risk assessment before travel, improving border security while reducing processing times at UK entry points.

US citizens arriving without a valid ETA will be refused entry and required to return to the United States at their own expense. Airlines and other carriers will be required to verify ETA status before allowing passengers to board flights to the UK.

The Home Office estimates that approximately 4.5 million US citizens visit the UK annually. To manage the transition, a comprehensive information campaign has been launched in partnership with UK tourism authorities and US travel industry organizations.

**Exemptions from ETA Requirement:**
- US citizens with valid UK visas
- British citizens with dual US nationality (traveling on UK passport)
- US diplomatic and official passport holders on official business
- Transit passengers not entering the UK

The system includes robust data protection measures and complies with both UK and US privacy standards. Application data is securely stored and used solely for immigration and security purposes.`,
        keyPoints: [
          'ETA required for all US citizens visiting UK from August 15, 2025',
          'Ends visa-free travel arrangement between US and UK',
          '£10 application fee with 2-year validity period',
          '72-hour processing time for standard applications',
          'Affects approximately 4.5 million US visitors annually',
          'Enhanced security screening before travel',
          'Exemptions for visa holders and official passport holders'
        ],
        relatedLinks: [
          { title: 'US Citizen ETA Application Portal', url: '#' },
          { title: 'ETA Requirements and Guidelines', url: '#' },
          { title: 'Travel Industry Information Pack', url: '#' },
          { title: 'Frequently Asked Questions', url: '#' }
        ]
      },
      '11': {
        id: '11',
        title: 'Biometric Residence Permits Being Phased Out by 2026',
        summary: 'UKVI announces transition to digital-only immigration status system, with BRPs to be fully replaced by eVisas by December 2026.',
        category: 'announcement',
        severity: 'high',
        date: '2025-07-12',
        source: 'UK Visas and Immigration',
        visaTypes: ['All Visa Types'],
        effectiveDate: 'Transition begins October 2025, complete by December 2026',
        impact: 'This digital transformation will affect all current and future visa holders, requiring adaptation to new digital proof systems.',
        fullContent: `UK Visas and Immigration has announced the complete phase-out of Biometric Residence Permits (BRPs) by December 31, 2026, as part of a comprehensive digital transformation of the UK immigration system. The physical cards will be replaced by secure digital eVisas, accessible through a new online platform.

This landmark change represents the largest modernization of UK immigration documentation since the introduction of BRPs in 2008. The digital system will provide enhanced security, improved user experience, and significant cost savings for both the government and visa holders.

**Digital eVisa System Features:**
- Secure online portal accessible 24/7 from anywhere in the world
- Real-time status updates and visa information
- Digital sharing capabilities for employers and service providers
- Enhanced fraud protection through advanced security measures
- Multilingual support for 20+ languages
- Integration with UK government digital services

**Transition Timeline:**
- October 2025: New visa applications issued as eVisas only
- January 2026: Voluntary BRP to eVisa conversion opens
- June 2026: Automatic conversion begins for remaining BRP holders
- December 31, 2026: All BRPs expire, eVisa system fully implemented

Current BRP holders will receive detailed guidance on converting to the new system, with multiple transition pathways available to ensure no one loses their immigration status during the changeover. The Home Office has committed to providing comprehensive support throughout the transition period.

**Benefits of the eVisa System:**
- No risk of losing or damaging physical documents
- Instant updates when status changes
- Easier verification for employers and landlords
- Reduced replacement costs and processing times
- Enhanced data security and privacy protection
- Environmental benefits from eliminating plastic cards

The digital system includes robust offline capabilities, allowing users to download and store their eVisa information securely on mobile devices for situations where internet access is limited. Emergency access procedures ensure that travelers can prove their status even in exceptional circumstances.

For employers and landlords, the new system provides a streamlined verification process through secure API connections, reducing administrative burden while maintaining compliance with right to work and right to rent requirements.

**Support Services During Transition:**
- Dedicated helpline with extended hours
- In-person assistance at premium service centers
- Community outreach programs for vulnerable users
- Multilingual support and interpreter services
- Special provisions for elderly or digitally excluded individuals

The Home Office has invested £180 million in developing the new digital infrastructure, working with leading cybersecurity firms to ensure the system meets the highest international standards for data protection and system reliability.

Travelers will continue to use their passports for border crossing, with immigration status verified electronically at entry points. The system has been successfully tested with partners at major UK airports and ports.`,
        keyPoints: [
          'All BRPs to be replaced by digital eVisas by December 31, 2026',
          'New visa applications digital-only from October 2025',
          'Secure 24/7 online access with enhanced fraud protection',
          'Automatic conversion process for existing BRP holders',
          'Comprehensive support services during transition period',
          '£180 million investment in digital infrastructure',
          'Environmental and cost benefits from eliminating physical cards'
        ],
        relatedLinks: [
          { title: 'eVisa System Registration Portal', url: '#' },
          { title: 'BRP to eVisa Conversion Guide', url: '#' },
          { title: 'Employer Verification System', url: '#' },
          { title: 'Digital Transition Support Services', url: '#' }
        ]
      }
    };

    return newsData[id] || null;
  };

  const news = getNewsDetails(newsId);

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">News Article Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The news article you're looking for could not be found.
              </p>
              <Button onClick={onBack}>
                Back to News
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'policy': return 'Policy Change';
      case 'processing': return 'Processing Update';
      case 'requirement': return 'Requirement Update';
      case 'announcement': return 'Official Announcement';
      default: return category;
    }
  };

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
              <span>Back to News</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{getCategoryLabel(news.category)}</Badge>
              {news.isBreaking && (
                <Badge className="bg-red-500 text-white">
                  BREAKING
                </Badge>
              )}
            </div>
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold leading-tight mb-4">
                      {news.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <span>Published:</span>
                    <span className="font-medium">{formatDate(news.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Source:</span>
                    <span className="font-medium">{news.source}</span>
                  </div>
                  {news.effectiveDate && (
                    <div className="flex items-center space-x-2">
                      <span>Effective:</span>
                      <span className="font-medium">{news.effectiveDate}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(news.severity)}>
                    <span className="capitalize">{news.severity} Impact</span>
                  </Badge>
                  {news.visaTypes.map((visaType, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {visaType}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Impact Section */}
              {news.impact && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Impact Summary</h3>
                  <p className="text-sm">{news.impact}</p>
                </div>
              )}

              {/* Key Points */}
              {news.keyPoints && news.keyPoints.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Key Points</h3>
                  <ul className="space-y-2">
                    {news.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              {/* Full Content */}
              <div>
                <h3 className="font-semibold mb-4">Full Details</h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {news.fullContent?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Related Links */}
              {news.relatedLinks && news.relatedLinks.length > 0 && (
                <div>
                  <Separator className="mb-6" />
                  <h3 className="font-semibold mb-4">Related Resources</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {news.relatedLinks.map((link, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{link.title}</span>
                          <span className="text-primary text-sm">View</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={onBack} variant="outline">
              Back to All News
            </Button>
            <Button>
              Share Article
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}