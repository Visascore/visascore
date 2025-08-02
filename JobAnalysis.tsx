import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Briefcase, 
  Globe, 
  MapPin, 
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
  Target,
  TrendingUp,
  Brain,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeJob as analyzeJobAPI, handleApiError } from '../utils/api'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { toast } from 'sonner@2.0.3'

interface JobAnalysisProps {
  onAnalysisComplete: (jobData: any) => void
  accessToken: string | null
}

interface JobData {
  title: string
  company: string
  location: string
  description: string
  source_url: string
}

interface AnalysisState {
  analyzing: boolean
  error: string
  result: any | null
}

export function JobAnalysis({ onAnalysisComplete, accessToken }: JobAnalysisProps) {
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    description: '',
    source_url: ''
  })
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    analyzing: false,
    error: '',
    result: null
  })

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData(prev => ({ ...prev, [field]: value }))
    // Clear previous results when user makes changes
    if (analysisState.result) {
      setAnalysisState(prev => ({ ...prev, result: null }))
    }
  }

  const extractJobFromUrl = async (url: string) => {
    // Simple URL parsing for common job sites
    try {
      if (url.includes('linkedin.com')) {
        toast.info('LinkedIn job detected - manual paste recommended for best results')
      } else if (url.includes('indeed.')) {
        toast.info('Indeed job detected - manual paste recommended for best results')
      }
      
      // In a real implementation, you'd use a web scraping service here
      // For now, we'll just suggest manual input
      toast.info('Please paste the job description manually for best AI analysis')
    } catch (error) {
      console.error('URL extraction error:', error)
    }
  }

  const analyzeJob = async () => {
    if (!jobData.description.trim() || jobData.description.length < 50) {
      setAnalysisState(prev => ({
        ...prev,
        error: 'Please provide a job description with at least 50 characters'
      }))
      return
    }

    setAnalysisState({
      analyzing: true,
      error: '',
      result: null
    })

    // Quick OpenAI status check
    try {
      const statusResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ca272e8b/openai-status`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      )
      
      if (statusResponse.ok) {
        const statusResult = await statusResponse.json()
        if (statusResult.openaiConfig?.hasApiKey && statusResult.apiTest?.working) {
          toast.success('🚀 AI-powered analysis with OpenAI GPT-4o activated!')
        }
      }
    } catch (error) {
      console.warn('OpenAI status check failed:', error)
    }

    try {
      console.log('Starting job analysis with data:', jobData)
      const result = await analyzeJobAPI(jobData)
      
      console.log('Raw API response:', result)

      // Enhanced validation of the response structure
      if (!result) {
        throw new Error('No response received from analysis service')
      }

      if (!result.job) {
        console.error('Invalid response structure:', result)
        throw new Error('Invalid response structure - missing job data')
      }

      // Ensure the job object has the required structure
      const jobResult = {
        id: result.job.id || crypto.randomUUID(),
        title: result.job.title || jobData.title || 'Untitled Position',
        company: result.job.company || jobData.company || '',
        location: result.job.location || jobData.location || '',
        analysis: result.job.analysis || {}
      }

      console.log('Processed job result:', jobResult)

      setAnalysisState({
        analyzing: false,
        error: '',
        result: jobResult
      })

      toast.success('Job description analyzed successfully!')
      onAnalysisComplete(jobResult)

    } catch (error) {
      console.error('Job analysis error:', error)
      const errorMessage = handleApiError(error)
      
      setAnalysisState({
        analyzing: false,
        error: errorMessage,
        result: null
      })
      
      toast.error('Failed to analyze job description: ' + errorMessage)
    }
  }

  const resetForm = () => {
    setJobData({
      title: '',
      company: '',
      location: '',
      description: '',
      source_url: ''
    })
    setAnalysisState({
      analyzing: false,
      error: '',
      result: null
    })
  }

  if (analysisState.result) {
    console.log('Rendering analysis result:', analysisState.result)
    const analysis = analysisState.result?.analysis || {}
    console.log('Extracted analysis for rendering:', analysis)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto space-y-6"
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Job Analysis Complete</span>
              </CardTitle>
              <Button variant="outline" size="sm" onClick={resetForm}>
                Analyze Another Job
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-8">
            {/* Job Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Position</Label>
                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-lg">{analysisState.result?.title || 'Untitled Position'}</span>
                </div>
              </div>
              
              {analysisState.result?.company && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Company</Label>
                  <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg">{analysisState.result.company}</span>
                  </div>
                </div>
              )}
              
              {analysisState.result?.location && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Location</Label>
                  <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg">{analysisState.result.location}</span>
                  </div>
                </div>
              )}
              
              {analysis?.salary_range && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">Salary Range</Label>
                  <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-card/50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg">
                      £{analysis.salary_range.min?.toLocaleString() || 'N/A'} - £{analysis.salary_range.max?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Target className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <p className="font-medium text-base mb-2">Experience Level</p>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {analysis?.experience_level || 'Not specified'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                <CardContent className="p-6 text-center">
                  <Sparkles className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="font-medium text-base mb-2">Industry</p>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {analysis?.industry || 'General'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <p className="font-medium text-base mb-2">Visa Sponsorship</p>
                  <Badge 
                    variant={analysis?.visa_sponsorship ? "default" : "secondary"}
                    className="text-base px-4 py-2"
                  >
                    {analysis?.visa_sponsorship ? 'Available' : 'Not mentioned'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Required Skills */}
            {analysis?.required_skills && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Required Skills</Label>
                <div className="space-y-4">
                  {analysis?.required_skills?.technical && Array.isArray(analysis.required_skills.technical) && analysis.required_skills.technical.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Technical Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.required_skills.technical.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-base px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis?.required_skills?.soft && Array.isArray(analysis.required_skills.soft) && analysis.required_skills.soft.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Soft Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.required_skills.soft.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-green-50 dark:bg-green-900/20 text-base px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            {analysis?.key_responsibilities && Array.isArray(analysis.key_responsibilities) && analysis.key_responsibilities.length > 0 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Key Responsibilities</Label>
                <div className="space-y-3">
                  {analysis.key_responsibilities.slice(0, 5).map((responsibility: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-base">{responsibility}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UK Relevance */}
            {analysis?.uk_relevance && (
              <Card className="bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-900/20">
                <CardContent className="p-6">
                  <h4 className="font-medium text-lg mb-4 flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>UK Visa Relevance</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.uk_relevance?.requires_uk_presence ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-base">UK Presence Required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.uk_relevance?.visa_friendly ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-base">Visa Friendly Employer</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.uk_relevance?.skill_shortage_area ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-base">Skills Shortage Area</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Briefcase className="w-6 h-6" />
          <span>Analyze Job Description</span>
        </CardTitle>
        <p className="text-muted-foreground">
          AI-powered analysis to extract key requirements and UK visa relevance
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Job URL Input */}
        <div className="space-y-4">
          <Label htmlFor="source_url" className="text-base font-medium">Job Posting URL (Optional)</Label>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <LinkIcon className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                id="source_url"
                placeholder="https://linkedin.com/jobs/... or https://indeed.com/..."
                value={jobData.source_url}
                onChange={(e) => handleInputChange('source_url', e.target.value)}
                className="pl-12 h-14 text-base"
              />
            </div>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => extractJobFromUrl(jobData.source_url)}
              disabled={!jobData.source_url.trim()}
            >
              Import
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Paste the job URL to auto-fill details, or manually enter the information below
          </p>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="title" className="text-base font-medium">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer"
              value={jobData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="h-14 text-base"
            />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="company" className="text-base font-medium">Company</Label>
            <Input
              id="company"
              placeholder="e.g., Google, Microsoft"
              value={jobData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="h-14 text-base"
            />
          </div>
          
          <div className="space-y-4 md:col-span-2">
            <Label htmlFor="location" className="text-base font-medium">Location</Label>
            <Input
              id="location"
              placeholder="e.g., London, Manchester, Remote"
              value={jobData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="h-14 text-base"
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4">
          <Label htmlFor="description" className="text-base font-medium">Job Description *</Label>
          <Textarea
            id="description"
            placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
            value={jobData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="min-h-[240px] resize-none text-base"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Minimum 50 characters required</span>
            <span>{jobData.description.length} characters</span>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {analysisState.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">{analysisState.error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <Button
          onClick={analyzeJob}
          disabled={!jobData.description.trim() || jobData.description.length < 50 || analysisState.analyzing}
          className="w-full h-14 text-base bg-gradient-to-r from-primary to-primary/80"
          size="lg"
        >
          {analysisState.analyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Analyzing Job Description...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-3" />
              Analyze with AI
            </>
          )}
        </Button>

        {/* Help Text */}
        <div className="text-center text-muted-foreground space-y-3 pt-4">
          <p className="text-base">
            Our AI will analyze the job description to extract key requirements, skills, and UK visa relevance.
          </p>
          <p className="text-sm">
            This analysis will be used to calculate your resume compatibility score.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}