import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { 
  Zap, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  FileText,
  Target,
  TrendingUp,
  Brain,
  Sparkles,
  RefreshCw,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from 'sonner@2.0.3'

interface ResumeOptimizationProps {
  resumeData: {
    id: string
    title: string
    file_name: string
    ats_score: number
    analysis: any
  }
  jobData: {
    id: string
    title: string
    company: string
    analysis: any
  }
  onBackToMatch: () => void
}

interface OptimizationResult {
  optimized_sections: {
    summary: string
    experience: string[]
    skills: string[]
    education: string
  }
  changes_made: Array<{
    section: string
    change: string
    reason: string
  }>
  keyword_additions: string[]
  ats_improvements: string[]
  estimated_score_improvement: number
  full_optimized_resume: string
  job_specific_optimizations?: string[]
}

export function ResumeOptimization({ resumeData, jobData, onBackToMatch }: ResumeOptimizationProps) {
  const [optimizing, setOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentProcess, setCurrentProcess] = useState('')

  useEffect(() => {
    startOptimization()
  }, [])

  const startOptimization = async () => {
    setOptimizing(true)
    setError('')
    setProgress(0)
    setCurrentProcess('Initializing optimization...')

    try {
      // Simulate progress for better UX
      const progressSteps = [
        { progress: 10, message: 'Analyzing resume structure...' },
        { progress: 25, message: `Extracting ${jobData.title} requirements...` },
        { progress: 40, message: 'Identifying job-specific optimization opportunities...' },
        { progress: 60, message: `Tailoring content for ${jobData.company}...` },
        { progress: 80, message: 'Integrating job-specific keywords and skills...' },
        { progress: 95, message: 'Finalizing targeted optimization...' }
      ]

      for (const step of progressSteps) {
        setProgress(step.progress)
        setCurrentProcess(step.message)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      console.log('Starting resume optimization with:', { 
        resumeId: resumeData.id, 
        jobId: jobData.id 
      })

      // First check OpenAI status
      try {
        const statusResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/openai-status`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            }
          }
        )
        const statusResult = await statusResponse.json()
        console.log('OpenAI status check:', statusResult)
        
        if (!statusResult.openaiConfig?.hasApiKey) {
          throw new Error('OpenAI API is not properly configured. Please check the server configuration.')
        }
      } catch (statusError) {
        console.warn('Could not check OpenAI status:', statusError)
        // Continue anyway, the optimization endpoint will handle the error
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/resume/optimize`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resume_id: resumeData.id,
            job_id: jobData.id,
            optimization_type: 'comprehensive'
          })
        }
      )

      console.log('Optimization response status:', response.status)
      const result = await response.json()
      console.log('Optimization response:', result)

      if (!response.ok) {
        // Provide more specific error messages based on the error
        let errorMessage = result.error || 'Resume optimization failed'
        
        if (errorMessage.includes('OpenAI API key')) {
          errorMessage = 'AI optimization service is currently unavailable. Please try again later or contact support.'
        } else if (errorMessage.includes('temporarily unavailable')) {
          errorMessage = 'AI optimization service is temporarily unavailable. Your resume analysis is complete, but automatic optimization is not available right now.'
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error occurred. Please try again in a few minutes.'
        }
        
        throw new Error(errorMessage)
      }

      setProgress(100)
      setCurrentProcess('Optimization complete!')
      setOptimizationResult(result.optimization)
      toast.success('Resume optimization completed!')

    } catch (error) {
      console.error('Optimization error:', error)
      const errorMessage = error.message || 'Failed to optimize resume'
      setError(errorMessage)
      
      // Provide more helpful toast messages
      if (errorMessage.includes('temporarily unavailable')) {
        toast.error('AI optimization is temporarily unavailable, but your analysis is complete!')
      } else if (errorMessage.includes('API key')) {
        toast.error('AI service configuration issue. Please contact support.')
      } else {
        toast.error('Optimization failed: ' + errorMessage)
      }
    } finally {
      setOptimizing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadResume = () => {
    if (!optimizationResult?.full_optimized_resume) return
    
    const blob = new Blob([optimizationResult.full_optimized_resume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `optimized_${resumeData.file_name || 'resume'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Resume downloaded!')
  }

  if (optimizing) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-16">
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-4">Optimizing Resume for {jobData.title}</h3>
              <p className="text-muted-foreground text-lg mb-8">
                AI is tailoring your resume specifically for {jobData.company} requirements
              </p>
              
              <div className="max-w-md mx-auto space-y-6">
                <Progress value={progress} className="h-4" />
                <p className="text-muted-foreground text-base">{currentProcess}</p>
              </div>
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
          <div className="text-center space-y-6">
            <Button onClick={startOptimization} variant="outline" size="lg">
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button onClick={onBackToMatch} variant="ghost" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Match Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!optimizationResult) {
    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20" />
          <CardContent className="relative p-10">
            <div className="text-center space-y-8">
              <div className="flex items-center justify-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold mb-2">Resume Optimized for {jobData.title}!</h2>
                  <p className="text-muted-foreground text-lg mb-2">
                    Tailored specifically for {jobData.company} • +{optimizationResult.estimated_score_improvement}% ATS score improvement
                  </p>
                  <p className="text-muted-foreground">
                    🎯 Job-specific keywords integrated • 🔧 Responsibilities aligned • ⭐ Skills prioritized
                  </p>
                </div>
              </div>

              {/* Success Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-muted-foreground">Keywords Added</p>
                  <p className="text-2xl font-bold">{optimizationResult.keyword_additions.length}</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium text-muted-foreground">Score Improvement</p>
                  <p className="text-2xl font-bold">+{optimizationResult.estimated_score_improvement}%</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium text-muted-foreground">Changes Made</p>
                  <p className="text-2xl font-bold">{optimizationResult.changes_made.length}</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium text-muted-foreground">ATS Improvements</p>
                  <p className="text-2xl font-bold">{optimizationResult.ats_improvements.length}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6">
                <Button onClick={downloadResume} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 h-14 px-8 text-base">
                  <Download className="w-5 h-5 mr-3" />
                  Download Optimized Resume
                </Button>
                <Button onClick={onBackToMatch} variant="outline" size="lg" className="h-14 px-8 text-base">
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Back to Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Optimization Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="job-targeting" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="job-targeting" className="text-base">Job Targeting</TabsTrigger>
            <TabsTrigger value="optimized-content" className="text-base">Optimized Content</TabsTrigger>
            <TabsTrigger value="improvements" className="text-base">Improvements Made</TabsTrigger>
            <TabsTrigger value="keywords" className="text-base">Keywords Added</TabsTrigger>
            <TabsTrigger value="ats-tips" className="text-base">ATS Improvements</TabsTrigger>
          </TabsList>

          <TabsContent value="job-targeting" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Target className="w-6 h-6" />
                  <span>Job-Specific Targeting</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Job Match Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-base">Target Position</h4>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="font-medium text-lg">{jobData.title}</p>
                        <p className="text-muted-foreground">{jobData.company}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-base">Optimization Focus</h4>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-lg font-medium">+{optimizationResult.estimated_score_improvement}% ATS Match Improvement</p>
                        <p className="text-sm text-muted-foreground">Tailored for this specific role</p>
                      </div>
                    </div>
                  </div>

                  {/* Job-Specific Optimizations */}
                  {optimizationResult.job_specific_optimizations && optimizationResult.job_specific_optimizations.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-base">How Your Resume Was Tailored</h4>
                      <div className="space-y-3">
                        {optimizationResult.job_specific_optimizations.map((optimization, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                            <p className="text-base">{optimization}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Keywords</p>
                      <p className="text-xs text-muted-foreground">Optimized</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Skills</p>
                      <p className="text-xs text-muted-foreground">Prioritized</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-xs text-muted-foreground">Aligned</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">ATS Score</p>
                      <p className="text-xs text-muted-foreground">Maximized</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimized-content" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Professional Summary */}
              {optimizationResult.optimized_sections.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center space-x-2">
                        <FileText className="w-6 h-6" />
                        <span>Professional Summary</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(optimizationResult.optimized_sections.summary)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-muted rounded-lg">
                      <p className="text-base leading-relaxed">
                        {optimizationResult.optimized_sections.summary}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Section */}
              {optimizationResult.optimized_sections.experience && optimizationResult.optimized_sections.experience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center space-x-2">
                        <Target className="w-6 h-6" />
                        <span>Optimized Experience</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(optimizationResult.optimized_sections.experience.join('\n'))}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {optimizationResult.optimized_sections.experience.map((bullet, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                          <p className="text-base">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              {optimizationResult.optimized_sections.skills && optimizationResult.optimized_sections.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <Brain className="w-6 h-6" />
                      <span>Optimized Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {optimizationResult.optimized_sections.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-base px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Full Optimized Resume */}
              {optimizationResult.full_optimized_resume && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-xl">
                      <span className="flex items-center space-x-2">
                        <FileText className="w-6 h-6" />
                        <span>Complete Optimized Resume</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(optimizationResult.full_optimized_resume)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={optimizationResult.full_optimized_resume}
                      readOnly
                      className="min-h-[500px] font-mono text-base"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="improvements" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <TrendingUp className="w-6 h-6" />
                  <span>Changes Made</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {optimizationResult.changes_made.map((change, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-xl p-6"
                    >
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge variant="outline" className="text-base px-3 py-1">{change.section}</Badge>
                          </div>
                          <p className="font-medium text-base mb-2">{change.change}</p>
                          <p className="text-sm text-muted-foreground">{change.reason}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Target className="w-6 h-6" />
                  <span>Keywords Added</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {optimizationResult.keyword_additions.map((keyword, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-base px-3 py-1">
                        + {keyword}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                {optimizationResult.keyword_additions.length === 0 && (
                  <p className="text-muted-foreground text-center py-8 text-base">
                    Your resume already contained most relevant keywords for this position.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ats-tips" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Zap className="w-6 h-6" />
                  <span>ATS Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationResult.ats_improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <Zap className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-base">{improvement}</p>
                    </motion.div>
                  ))}
                  {optimizationResult.ats_improvements.length === 0 && (
                    <p className="text-muted-foreground text-center py-8 text-base">
                      Your resume formatting is already ATS-friendly.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}