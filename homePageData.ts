import { 
  MessageSquare, 
  CheckCircle, 
  Target, 
  Briefcase, 
  GraduationCap, 
  HeartHandshake, 
  MapPin, 
  BarChart3,
  Bot,
  Clock,
  Shield,
  Brain,
  Award,
  Users,
  FileCheck,
  Globe,
  TrendingUp
} from 'lucide-react';

export const services = [
  {
    icon: CheckCircle,
    title: "AI Visa Eligibility Assessment",
    description: "Comprehensive AI-powered scoring for all UK visa routes with real UKVI requirements analysis",
    href: "/visa-routes",
    color: "bg-purple-500",
    badge: "Popular"
  },
  {
    icon: MessageSquare,
    title: "AI Visa Assistant",
    description: "Intelligent chat assistant providing personalized guidance for all UK visa routes",
    href: "/ai-assistant",
    color: "bg-blue-500"
  },
  {
    icon: Target,
    title: "Personalized Action Plans",
    description: "AI-generated improvement plans with task tracking to increase your eligibility score",
    href: "/dashboard",
    color: "bg-red-500"
  },
  {
    icon: Briefcase,
    title: "Work Visa Routes",
    description: "Skilled Worker, Health Care Worker, Global Talent, Start-up, and Investor visas",
    href: "/visa-routes",
    color: "bg-amber-500"
  },
  {
    icon: GraduationCap,
    title: "Education & Graduate Visas",
    description: "Student visas, Graduate route, and education pathway guidance",
    href: "/visa-routes",
    color: "bg-pink-500"
  },
  {
    icon: HeartHandshake,
    title: "Family & Settlement Visas",
    description: "Spouse, partner, child dependent, ILR, and British citizenship routes",
    href: "/visa-routes",
    color: "bg-emerald-500"
  },
  {
    icon: MapPin,
    title: "Ancestry & Visit Visas",
    description: "UK Ancestry visa and Standard Visitor visa guidance with eligibility checks",
    href: "/visa-routes",
    color: "bg-violet-500"
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description: "Monitor your visa preparation progress with detailed analytics and milestone tracking",
    href: "/dashboard",
    color: "bg-teal-500"
  }
];

export const whyChooseUs = [
  {
    icon: Bot,
    title: 'AI-Powered Eligibility Analysis',
    description: 'Advanced OpenAI integration analyzes your profile against real UKVI requirements for accurate eligibility scoring'
  },
  {
    icon: Target,
    title: 'Comprehensive Visa Coverage',
    description: 'Complete assessment for all major UK visa routes: Work, Education, Family, Settlement, and Visitor visas'
  },
  {
    icon: Clock,
    title: 'Real UKVI Requirements',
    description: 'All assessments use current 2024 UKVI guidance with direct links to official government application pages'
  },
  {
    icon: Shield,
    title: 'Personalized Action Plans',
    description: 'AI-generated improvement plans with specific tasks, timelines, and score impact tracking for sub-85% scores'
  },
  {
    icon: Brain,
    title: 'Dynamic Score Updates',
    description: 'Interactive task completion system that updates your eligibility score in real-time as you complete requirements'
  },
  {
    icon: Award,
    title: 'Official Application Links',
    description: 'Direct access to correct UK government application portals for your specific visa route when ready to apply'
  }
];

export const successStories = [
  {
    name: "Sarah Chen",
    country: "Singapore",
    visa: "Global Talent Visa",
    quote: "The AI assessment showed me exactly what I needed for endorsement. Got approved in 3 weeks!",
    score: "96%",
    timeframe: "3 weeks"
  },
  {
    name: "Miguel Rodriguez",
    country: "Spain",
    visa: "Skilled Worker Visa",
    quote: "Clear guidance on salary requirements and sponsor license verification. Made the process so much easier.",
    score: "91%",
    timeframe: "4 weeks"
  },
  {
    name: "Priya Patel",
    country: "India",
    visa: "Student Visa",
    quote: "The financial requirement calculator and CAS guidance were spot on. No surprises during application.",
    score: "94%",
    timeframe: "2 weeks"
  },
  {
    name: "James Wilson",
    country: "Australia",
    visa: "UK Ancestry Visa",
    quote: "Found out about my eligibility and got all the required documents listed clearly. Straightforward process.",
    score: "89%",
    timeframe: "3 weeks"
  },
  {
    name: "Emma Thompson",
    country: "Canada",
    visa: "Spouse Visa",
    quote: "The income requirement guidance and relationship evidence checklist made our application successful.",
    score: "93%",
    timeframe: "8 weeks"
  },
  {
    name: "David Kim",
    country: "South Korea",
    visa: "Start-up Visa",
    quote: "AI helped me understand endorsing body requirements and prepare a winning business plan.",
    score: "87%",
    timeframe: "6 weeks"
  }
];

export const heroContent = {
  title: "SMART UK VISA ELIGIBILITY PLANNER",
  subtitle: "Get AI-powered eligibility assessments for all UK visa routes with real UKVI requirements",
  description: "Advanced AI analysis using official UKVI guidance to assess your eligibility, generate personalized action plans, and guide you to the correct application portal when ready.",
  features: [
    "✓ Real UKVI requirements analysis",
    "✓ Comprehensive eligibility scoring",
    "✓ Personalized action plans",
    "✓ Official application links"
  ]
};

export const stats = [
  {
    icon: Users,
    value: "25,000+",
    label: "Users Helped"
  },
  {
    icon: FileCheck,
    value: "12",
    label: "Visa Routes"
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries"
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Success Rate"
  }
];

export const footerContent = {
  description: "AI-powered UK visa eligibility planner using real UKVI requirements to help you understand your options and prepare successful applications.",
  quickLinks: [
    { label: "Visa Routes", href: "/visa-routes" },
    { label: "AI Assistant", href: "/ai-assistant" },
    { label: "Dashboard", href: "/dashboard" }
  ],
  visaCategories: [
    { label: "Work Visas", href: "/visa-routes" },
    { label: "Student Visas", href: "/visa-routes" },
    { label: "Family Visas", href: "/visa-routes" },
    { label: "Settlement Visas", href: "/visa-routes" }
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" }
  ]
};