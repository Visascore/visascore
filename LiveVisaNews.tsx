import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

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
}

interface LiveVisaNewsProps {
  onNewsClick?: (newsId: string) => void;
}

export function LiveVisaNews({ onNewsClick }: LiveVisaNewsProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching live news
    const fetchNews = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'UK Skilled Worker Visa Salary Thresholds Updated for Q3 2025',
          summary: 'Updated salary requirements for Skilled Worker visas come into effect, with new rates for different skill levels and regional variations to address cost of living differences.',
          category: 'policy',
          severity: 'high',
          date: '2025-07-22',
          source: 'UK Visas and Immigration',
          visaTypes: ['Skilled Worker'],
          isBreaking: true
        },
        {
          id: '2',
          title: 'Graduate Visa Extension for AI and Data Science Graduates',
          summary: 'New 3-year Graduate visa option introduced for AI, machine learning, and data science graduates from UK universities, reflecting critical skills shortage in these sectors.',
          category: 'policy',
          severity: 'high',
          date: '2025-07-21',
          source: 'Home Office',
          visaTypes: ['Graduate Visa', 'Student'],
          isBreaking: true
        },
        {
          id: '3',
          title: 'Family Visa Processing Times Accelerated with Digital System',
          summary: 'New digital-first approach reduces Family visa processing times to 4-6 weeks, with enhanced online document verification and automated eligibility checks.',
          category: 'processing',
          severity: 'medium',
          date: '2025-07-20',
          source: 'UK Visas and Immigration',
          visaTypes: ['Family Visa'],
          isBreaking: false
        },
        {
          id: '4',
          title: 'Health and Care Worker Visa Expansion to Mental Health Professionals',
          summary: 'Health and Care Worker visa route expanded to include mental health counselors, therapists, and psychologists to address NHS mental health workforce shortages.',
          category: 'policy',
          severity: 'medium',
          date: '2025-07-19',
          source: 'UK Visas and Immigration',
          visaTypes: ['Health and Care Worker']
        },
        {
          id: '5',
          title: 'Student Visa Financial Evidence Requirements Simplified',
          summary: 'New streamlined financial evidence system for Student visas, allowing digital bank statements and automated verification for students from 40+ countries.',
          category: 'requirement',
          severity: 'medium',
          date: '2025-07-18',
          source: 'UK Visas and Immigration',
          visaTypes: ['Student']
        },
        {
          id: '6',
          title: 'Global Talent Visa Self-Assessment Tool Launches',
          summary: 'Interactive online tool helps potential Global Talent applicants assess their eligibility and understand requirements before applying, improving success rates.',
          category: 'announcement',
          severity: 'low',
          date: '2025-07-17',
          source: 'UK Visas and Immigration',
          visaTypes: ['Global Talent']
        },
        {
          id: '7',
          title: 'Electronic Travel Authorization Now Required for US Citizens',
          summary: 'US citizens must now obtain ETA before traveling to the UK for visits up to 6 months. Digital application system processes applications within 72 hours.',
          category: 'requirement',
          severity: 'high',
          date: '2025-07-16',
          source: 'Home Office',
          visaTypes: ['Visitor', 'ETA']
        },
        {
          id: '8',
          title: 'Start-up Visa Success Rate Reaches 85% in 2025',
          summary: 'Home Office reports significant improvement in Start-up visa approval rates, with enhanced support services and clearer business plan guidelines.',
          category: 'announcement',
          severity: 'low',
          date: '2025-07-15',
          source: 'UK Visas and Immigration',
          visaTypes: ['Start-up Visa']
        },
        {
          id: '9',
          title: 'Youth Mobility Scheme Extended to Include Philippines',
          summary: 'Philippines becomes the newest country added to the Youth Mobility Scheme, with 1,000 places available annually for young professionals aged 18-30.',
          category: 'announcement',
          severity: 'medium',
          date: '2025-07-14',
          source: 'Home Office',
          visaTypes: ['Youth Mobility']
        },
        {
          id: '10',
          title: 'Settlement Applications Now Include Climate Impact Assessment',
          summary: 'New sustainability criteria added to Indefinite Leave to Remain applications, reflecting the UK\'s commitment to environmental responsibility in immigration policy.',
          category: 'requirement',
          severity: 'low',
          date: '2025-07-13',
          source: 'UK Visas and Immigration',
          visaTypes: ['Settlement', 'ILR']
        },
        {
          id: '11',
          title: 'Biometric Residence Permits Being Phased Out by 2026',
          summary: 'UKVI announces transition to digital-only immigration status system, with BRPs to be fully replaced by eVisas by December 2026.',
          category: 'announcement',
          severity: 'high',
          date: '2025-07-12',
          source: 'UK Visas and Immigration',
          visaTypes: ['All Visa Types']
        },
        {
          id: '12',
          title: 'Innovator Founder Visa Fast-Track for Green Tech Startups',
          summary: 'New accelerated pathway for green technology and renewable energy startups, with reduced investment thresholds and expedited processing times.',
          category: 'policy',
          severity: 'medium',
          date: '2025-07-11',
          source: 'UK Visas and Immigration',
          visaTypes: ['Innovator Founder']
        }
      ];

      setNewsItems(mockNews);
      setIsLoading(false);
    };

    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Updates' },
    { id: 'policy', name: 'Policy Changes' },
    { id: 'processing', name: 'Processing Times' },
    { id: 'requirement', name: 'Requirements' },
    { id: 'announcement', name: 'Announcements' }
  ];

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNewsClick = (newsId: string) => {
    if (onNewsClick) {
      onNewsClick(newsId);
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h2 className="text-2xl font-bold">Live Visa Updates</h2>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">LIVE</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest UK visa policy changes, processing times, and requirements for 2025
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Breaking News Ticker */}
        {!isLoading && filteredNews.filter(item => item.isBreaking).length > 0 && (
          <div className="bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Breaking News</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <motion.div
                  className="flex space-x-8"
                  animate={{ x: [0, -100 * filteredNews.filter(item => item.isBreaking).length] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {filteredNews.filter(item => item.isBreaking).map((item, index) => (
                    <span 
                      key={index} 
                      className="text-foreground font-medium whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleNewsClick(item.id)}
                    >
                      {item.title}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
                    onClick={() => handleNewsClick(item.id)}
                  >
                    {item.isBreaking && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">
                        BREAKING
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getSeverityColor(item.severity)}>
                              <span className="capitalize">{item.severity}</span>
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {item.summary}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">Source:</span>
                          <span className="text-xs font-medium">{item.source}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.visaTypes.map((visaType, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {visaType}
                            </Badge>
                          ))}
                        </div>

                        <div className="pt-2 border-t">
                          <span className="text-xs text-primary font-medium group-hover:underline">
                            Click to read full article →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* View More Button */}
        <div className="text-center mt-8">
          <Button variant="outline">
            View All Updates
          </Button>
        </div>
      </div>
    </section>
  );
}