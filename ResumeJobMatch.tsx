import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Target, 
  TrendingUp, 
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Users,
  FileText,
  Loader2,
  ArrowRight,
  Star,
  Zap,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from 'sonner@2.0.3'

interface ResumeJobMatchProps {
  resumeId: string
  jobId: string
  accessToken: string
  onOptimizationRequest: (matchData: any) => void
}

interface MatchResult {
  id: string
  overall_score: number
  skills_score: number
  experience_score: number
  keywords_score: number
  detailed_analysis: {
    matching_skills: string[]
    missing_skills: string[]
    keyword_gaps: string[]
    strengths: string[]
    weaknesses: string[]
    visa_advantages?: string[]
  }
  optimization_suggestions: Array<{
    type: string
    suggestion: string
    keywords?: string[]
    skills?: string[]
    priority: 'high' | 'medium' | 'low'
  }>
  interview_preparation?: {
    likely_questions: string[]
    key_talking_points: string[]
    areas_to_study: string[]
  }
}

export function ResumeJobMatch({ 
  resumeId, 
  jobId, 
  accessToken, 
  onOptimizationRequest 
}: ResumeJobMatchProps) {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkOpenAIStatus()
    analyzeMatch()
  }, [resumeId, jobId])

  const checkOpenAIStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/openai-status`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        console.log('OpenAI Status:', result)
        
        if (result.openaiConfig?.hasApiKey && result.apiTest?.working) {
          console.log('✅ OpenAI API is connected and working!')
          toast.success('AI analysis is fully operational!')
        } else if (result.openaiConfig?.hasApiKey) {
          console.log('⚠️ OpenAI API key configured but test failed:', result.apiTest?.error)
          toast.warning('AI services may be experiencing issues')
        } else {
          console.log('❌ OpenAI API not configured')
          toast.warning('AI analysis running in fallback mode')
        }
      }
    } catch (error) {
      console.warn('Could not check OpenAI status:', error)
    }
  }

  const analyzeMatch = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('Starting match analysis with:', { resumeId, jobId })
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/match/analyze`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resume_id: resumeId,
            job_id: jobId
          })
        }
      )

      console.log('Match analysis response status:', response.status)
      const result = await response.json()
      console.log('Match analysis response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Match analysis failed')
      }

      if (!result.match) {
        throw new Error('Invalid response structure - missing match data')
      }

      setMatchResult(result.match)
      toast.success('Match analysis completed!')

    } catch (error) {
      console.error('Match analysis error:', error)
      setError(error.message || 'Failed to analyze match')
      toast.error('Failed to analyze match: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (score >= 70) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 85) return '🎉 Exceptional match! You\'re an ideal candidate'
    if (score >= 70) return '🌟 Strong match! Great potential for success'
    if (score >= 60) return '✨ Good potential with some optimization needed'
    if (score >= 40) return '🔧 Moderate fit - optimization recommended'
    return '🛠️ Significant improvements needed before applying'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Analyzing Resume-Job Match</h3>
              <p className="text-muted-foreground text-lg">
                Our AI is comparing your resume against job requirements...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-16">
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={analyzeMatch} variant="outline" size="lg">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!matchResult) {
    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20" />
          <CardContent className="relative p-10">
            <div className="text-center space-y-8">
              <div className="flex items-center justify-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {matchResult.overall_score}%
                  </span>
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold mb-2">Match Score</h2>
                  <p className="text-muted-foreground text-lg">
                    {getScoreMessage(matchResult.overall_score)}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/50 dark:bg-card/50">
                  <CardContent className="p-6 text-center">
                    <Target className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                    <p className="text-base font-medium text-muted-foreground">Skills Match</p>
                    <p className="text-3xl font-bold">{matchResult.skills_score}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 dark:bg-card/50">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 text-green-600" />
                    <p className="text-base font-medium text-muted-foreground">Experience</p>
                    <p className="text-3xl font-bold">{matchResult.experience_score}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/50 dark:bg-card/50">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                    <p className="text-base font-medium text-muted-foreground">Keywords</p>
                    <p className="text-3xl font-bold">{matchResult.keywords_score}%</p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={() => onOptimizationRequest(matchResult)}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 h-14 px-8 text-base"
              >
                <Zap className="w-5 h-5 mr-3" />
                Optimize Resume for This Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="analysis" className="text-base">Analysis</TabsTrigger>
            <TabsTrigger value="improvements" className="text-base">Improvements</TabsTrigger>
            <TabsTrigger value="interview" className="text-base">Interview Prep</TabsTrigger>
            <TabsTrigger value="visa" className="text-base">Visa Insights</TabsTrigger>
            <TabsTrigger value="market" className="text-base">Market Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600 text-xl">
                    <CheckCircle className="w-6 h-6" />
                    <span>Your Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(matchResult.detailed_analysis.strengths || []).map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <p className="text-base">{strength}</p>
                    </div>
                  ))}
                  
                  {(matchResult.detailed_analysis.matching_skills || []).length > 0 && (
                    <div className="mt-6">
                      <p className="text-base font-medium mb-3">Matching Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {(matchResult.detailed_analysis.matching_skills || []).map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 text-base px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600 text-xl">
                    <AlertTriangle className="w-6 h-6" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(matchResult.detailed_analysis.weaknesses || []).map((weakness, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <p className="text-base">{weakness}</p>
                    </div>
                  ))}
                  
                  {(matchResult.detailed_analysis.missing_skills || []).length > 0 && (
                    <div className="mt-6">
                      <p className="text-base font-medium mb-3">Missing Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {(matchResult.detailed_analysis.missing_skills || []).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-base px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(matchResult.detailed_analysis.keyword_gaps || []).length > 0 && (
                    <div className="mt-6">
                      <p className="text-base font-medium mb-3">Keyword Gaps:</p>
                      <div className="flex flex-wrap gap-2">
                        {(matchResult.detailed_analysis.keyword_gaps || []).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="improvements" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Lightbulb className="w-6 h-6" />
                  <span>AI Optimization Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(matchResult.optimization_suggestions || []).map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge variant={getPriorityColor(suggestion.priority)} className="text-base px-3 py-1">
                              {suggestion.priority} priority
                            </Badge>
                            <Badge variant="outline" className="text-base px-3 py-1">
                              {suggestion.type}
                            </Badge>
                          </div>
                          <p className="text-base">{suggestion.suggestion}</p>
                        </div>
                      </div>
                      
                      {suggestion.keywords && (suggestion.keywords || []).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Recommended Keywords:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(suggestion.keywords || []).map((keyword, i) => (
                              <Badge key={i} variant="secondary" className="text-base px-3 py-1">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {suggestion.skills && (suggestion.skills || []).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Skills to Emphasize:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(suggestion.skills || []).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-base px-3 py-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interview" className="space-y-8 mt-8">
            {matchResult.interview_preparation && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <Users className="w-6 h-6" />
                      <span>Likely Interview Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(matchResult.interview_preparation.likely_questions || []).map((question, index) => (
                        <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="font-medium text-base mb-2">Q{index + 1}:</p>
                          <p className="text-base">{question}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <FileText className="w-6 h-6" />
                      <span>Key Talking Points</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(matchResult.interview_preparation.key_talking_points || []).map((point, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <p className="text-base">{point}</p>
                        </div>
                      ))}
                    </div>
                    
                    {(matchResult.interview_preparation.areas_to_study || []).length > 0 && (
                      <div className="mt-8">
                        <p className="text-base font-medium mb-3">Areas to Study:</p>
                        <div className="flex flex-wrap gap-2">
                          {(matchResult.interview_preparation.areas_to_study || []).map((area, index) => (
                            <Badge key={index} variant="outline" className="text-base px-3 py-1">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visa" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Target className="w-6 h-6" />
                  <span>UK Visa Advantages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matchResult.detailed_analysis.visa_advantages && 
                 (matchResult.detailed_analysis.visa_advantages || []).length > 0 ? (
                  <div className="space-y-4">
                    {(matchResult.detailed_analysis.visa_advantages || []).map((advantage, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-base">{advantage}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                    <p className="text-muted-foreground text-lg mb-3">
                      No specific visa advantages identified for this role.
                    </p>
                    <p className="text-muted-foreground">
                      Consider highlighting your unique skills and international experience.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-8 mt-8">
            {matchResult.market_insights && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <TrendingUp className="w-6 h-6" />
                      <span>Market Position</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-base mb-2">Competitive Positioning:</p>
                      <p className="text-base">{matchResult.market_insights.competitive_positioning}</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-medium text-base mb-2">UK Market Fit:</p>
                      <p className="text-base">{matchResult.market_insights.uk_market_fit}</p>
                    </div>

                    {(matchResult.market_insights.skill_development_priorities || []).length > 0 && (
                      <div>
                        <p className="font-medium text-base mb-3">Priority Skills to Develop:</p>
                        <div className="flex flex-wrap gap-2">
                          {(matchResult.market_insights.skill_development_priorities || []).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-base px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <Target className="w-6 h-6" />
                      <span>Alternative Opportunities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(matchResult.market_insights.alternative_opportunities || []).length > 0 ? (
                      <div className="space-y-4">
                        {(matchResult.market_insights.alternative_opportunities || []).map((opportunity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Star className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <p className="text-base">{opportunity}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-base">
                          Focus on this opportunity - it's well-aligned with your profile.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}