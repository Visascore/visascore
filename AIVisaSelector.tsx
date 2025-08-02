import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { VisaRoute, visaRoutes } from "../data/visaRoutes";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertCircle, Plus, MessageSquare, Trash2, Clock, ChevronLeft, Menu, Loader2 } from "lucide-react";
import { 
  sendChatMessage, 
  handleApiError,
  createChatSession,
  getChatSessions,
  getChatSession,
  updateChatSession,
  deleteChatSession,
  addMessageToChatSession,
  getSessionId,
  setSessionId
} from "../utils/api";

interface AIVisaSelectorProps {
  user: any;
  accessToken: string;
}

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  options?: string[];
  recommendations?: RecommendedRoute[];
}

interface RecommendedRoute {
  route: VisaRoute;
  confidence: number;
  reasoning: string[];
  matchingFactors: string[];
}

interface UserProfile {
  purpose: string;
  experience: string;
  education: string;
  location: string;
  timeline: string;
  budget: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
  preview: string;
}

export function AIVisaSelector({ user, accessToken }: AIVisaSelectorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [recommendations, setRecommendations] = useState<RecommendedRoute[]>([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);

  useEffect(() => {
    initializeChatSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatSessions = async () => {
    setSessionLoading(true);
    try {
      // Try to load existing chat sessions from backend
      const response = await getChatSessions();
      const backendSessions = response.sessions || [];
      
      // Convert timestamps back to Date objects
      const processedSessions = backendSessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        messages: session.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
      
      setChatSessions(processedSessions);
      
      // If no sessions exist, create a new one
      if (processedSessions.length === 0) {
        await startNewChat();
      } else {
        // Load the most recent session
        const mostRecentSession = processedSessions[0];
        await loadChatSession(mostRecentSession.id);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setApiError('Failed to load chat history. Starting fresh session.');
      // Fallback to creating a new session
      await startNewChat();
    } finally {
      setSessionLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateUniqueId = (): string => {
    messageCounterRef.current += 1;
    return `${Date.now()}-${messageCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = async (type: 'bot' | 'user' | 'system', content: string, options?: string[], recommendations?: RecommendedRoute[]) => {
    const newMessage: Message = {
      id: generateUniqueId(),
      type,
      content,
      timestamp: new Date(),
      options,
      recommendations
    };
    
    setMessages(prev => {
      const updated = [...prev, newMessage];
      
      // Update the backend session if we have a current session
      if (currentSessionId) {
        updateBackendSession(updated, type === 'user' ? content : undefined);
      }
      
      return updated;
    });
  };

  const updateBackendSession = async (updatedMessages: Message[], firstUserInput?: string) => {
    if (!currentSessionId) return;
    
    try {
      await updateChatSession(currentSessionId, {
        messages: updatedMessages,
        timestamp: new Date().toISOString()
      });
      
      // Update local sessions state
      setChatSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const userMessages = updatedMessages.filter(m => m.type === 'user');
          let newTitle = session.title;
          
          if (firstUserInput && (session.title === "New conversation" || session.title.startsWith("Chat "))) {
            newTitle = firstUserInput.length > 50 ? firstUserInput.slice(0, 50) + "..." : firstUserInput;
          }
          
          return {
            ...session,
            title: newTitle,
            messages: updatedMessages,
            preview: getSessionPreview(updatedMessages),
            timestamp: new Date()
          };
        }
        return session;
      }));
      
    } catch (error) {
      console.error('Error updating backend session:', error);
    }
  };

  const getSessionPreview = (messages: Message[]): string => {
    const userMessages = messages.filter(m => m.type === 'user');
    if (userMessages.length === 0) return "New conversation";
    return userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? "..." : "");
  };

  const startNewChat = async () => {
    setLoading(true);
    try {
      // Create new session in backend
      const response = await createChatSession("New conversation");
      const newSession = response.session;
      
      // Convert timestamp to Date object
      const processedSession = {
        ...newSession,
        timestamp: new Date(newSession.timestamp),
        messages: []
      };
      
      setMessages([]);
      setCurrentSessionId(newSession.id);
      setConversationHistory([]);
      setConversationStarted(false);
      
      // Add to local sessions
      setChatSessions(prev => [processedSession, ...prev]);
      
      // Add welcome message and options
      setTimeout(() => {
        addMessage('bot', "Hi there! 👋 I'm VISA-AI, your personal UK visa guide powered by advanced AI!\n\nI'm here to provide you with real-time, personalized guidance based on the latest UK immigration requirements and 2025 changes.\n\nWhat's bringing you to explore UK visas today? I'm excited to help you on this journey! ✨");
        addInitialOptions();
      }, 100);
      
    } catch (error) {
      console.error('Error creating new chat session:', error);
      setApiError('Failed to create new chat session');
    } finally {
      setLoading(false);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await getChatSession(sessionId);
      const session = response.session;
      
      // Convert timestamps back to Date objects
      const processedMessages = session.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      
      setMessages(processedMessages);
      setCurrentSessionId(sessionId);
      setConversationHistory([]);
      setConversationStarted(processedMessages.some((m: any) => m.type === 'user'));
      
    } catch (error) {
      console.error('Error loading chat session:', error);
      setApiError('Failed to load chat session');
    } finally {
      setLoading(false);
    }
  };

  const deleteChatSessionHandler = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        await startNewChat();
      }
      
    } catch (error) {
      console.error('Error deleting chat session:', error);
      setApiError('Failed to delete chat session');
    }
  };

  const addInitialOptions = () => {
    const initialOptions = [
      "I want to work in the UK 🚀",
      "I'm planning to study in the UK 🎓", 
      "I want to join my family there 💕",
      "I have a business idea for the UK 💡",
      "I want to visit the UK ✈️",
      "Show me all visa options 🗺️"
    ];
    addMessage('system', "", initialOptions);
  };

  const simulateTyping = (duration: number = 1500) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve(true);
      }, duration);
    });
  };

  const parseResponseForRecommendations = (response: string): RecommendedRoute[] => {
    const recommendations: RecommendedRoute[] = [];
    
    // Look for visa route mentions in the AI response
    visaRoutes.forEach(route => {
      const routeName = route.name.toLowerCase();
      const responseText = response.toLowerCase();
      
      if (responseText.includes(routeName) || 
          responseText.includes(route.id) ||
          (route.category.toLowerCase() === 'work' && responseText.includes('work')) ||
          (route.category.toLowerCase() === 'education' && (responseText.includes('study') || responseText.includes('student')))) {
        recommendations.push({
          route,
          confidence: 85,
          reasoning: [`AI recommended based on your inquiry`],
          matchingFactors: ['AI analysis match']
        });
      }
    });
    
    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  };

  const generateFollowUpOptions = (response: string): string[] => {
    const options = [
      "Tell me more about requirements",
      "What documents do I need?",
      "How long does the process take?",
      "What are the costs involved?"
    ];
    
    // Add dynamic options based on response content
    if (response.toLowerCase().includes('skilled worker')) {
      options.push("Check Skilled Worker eligibility");
    }
    if (response.toLowerCase().includes('global talent')) {
      options.push("Learn about Global Talent visa");
    }
    if (response.toLowerCase().includes('student')) {
      options.push("Explore Student visa options");
    }
    
    return options.slice(0, 4);
  };

  const generateIntelligentResponse = async (userInput: string): Promise<{ content: string; recommendations?: RecommendedRoute[]; options?: string[] }> => {
    try {
      // Call the real OpenAI API
      const response = await sendChatMessage(userInput, conversationHistory);
      
      // Update conversation history
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: userInput },
        { role: 'assistant', content: response.response }
      ].slice(-20); // Keep last 20 messages
      
      setConversationHistory(newHistory);
      setApiError(null);
      
      // Parse response for visa route recommendations
      const recommendations = parseResponseForRecommendations(response.response);
      
      return {
        content: response.response,
        recommendations,
        options: generateFollowUpOptions(response.response)
      };
      
    } catch (error) {
      console.error('AI API Error:', error);
      setApiError(handleApiError(error));
      
      // Fallback to basic response
      return {
        content: `I'm having trouble connecting to my AI brain right now, but I can still help! 🤖\n\nFor "${userInput}", I recommend:\n\n• Check our comprehensive visa guides\n• Use our eligibility assessment tools\n• Browse all available visa routes\n\nPlease try asking your question again - my AI should be back online shortly!`,
        options: ["Show all visa types", "Try AI again", "Browse visa guides", "Check eligibility"]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage = currentInput.trim();
    await addMessage('user', userMessage);
    setCurrentInput("");
    setConversationStarted(true);
    
    await simulateTyping(Math.min(userMessage.length * 50, 2000));
    
    const response = await generateIntelligentResponse(userMessage);
    await addMessage('bot', response.content, response.options, response.recommendations);
  };

  const handleOptionSelect = async (option: string) => {
    await addMessage('user', option);
    setConversationStarted(true);
    
    await simulateTyping(1500);
    
    const response = await generateIntelligentResponse(option);
    await addMessage('bot', response.content, response.options, response.recommendations);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRouteSelect = (route: VisaRoute) => {
    console.log('AI Assistant: Route selected for detailed view:', route.id);
    window.location.href = `/visa-routes/${route.id}`;
  };

  const handleStartAssessment = (route: VisaRoute) => {
    window.location.href = `/assessment/${route.id}`;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (sessionLoading) {
    return (
      <div className="fixed top-0 left-[100px] h-screen bg-background border-r border-border z-40 flex max-[640px]:left-0" style={{ width: '85%' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-[100px] h-screen bg-background border-r border-border z-40 flex max-[640px]:left-0" style={{ width: '85%' }}>
      
      {/* Chat History Sidebar - Reduced width to 320px */}
      <div 
        className={`flex-shrink-0 border-r border-border bg-muted/20 flex flex-col transition-all duration-300 ease-in-out max-[640px]:absolute max-[640px]:h-full max-[640px]:z-50 max-[640px]:bg-background max-[640px]:shadow-lg ${
          showHistory 
            ? 'w-[320px] opacity-100 translate-x-0 max-[640px]:w-full' 
            : 'w-0 opacity-0 -translate-x-full overflow-hidden'
        }`}
        style={{ 
          minWidth: showHistory ? '320px' : '0px',
          maxWidth: showHistory ? '320px' : '0px'
        }}
      >
        {/* History Header */}
        <div className="flex-shrink-0 p-5 border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Chat History</h2>
            <Button
              onClick={() => setShowHistory(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={startNewChat}
            className="w-full h-10 text-base font-medium"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 mr-3" />
            )}
            New Chat
          </Button>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatSessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`group p-4 rounded-xl cursor-pointer transition-all hover:bg-accent/60 ${
                currentSessionId === session.id 
                  ? 'bg-accent border border-accent-foreground/30 shadow-sm' 
                  : 'hover:bg-accent/30'
              }`}
              onClick={() => loadChatSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <h3 className="text-base font-medium truncate text-foreground" title={session.title}>
                      {session.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatRelativeTime(session.timestamp)}</span>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatSessionHandler(session.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
          
          {chatSessions.length === 0 && (
            <div className="text-center text-muted-foreground py-12 px-6">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-base mb-2">No chat history yet</p>
              <p className="text-sm opacity-75">Start a conversation to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Interface - Now with expanded chat area (30px wider due to sidebar reduction) */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Mobile Back Button & History Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-muted/30 flex-shrink-0">
          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
          >
            ←
          </Button>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="ghost"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="flex-shrink-0 m-8 p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-base text-yellow-800 dark:text-yellow-200">
                  {apiError}
                </p>
                <Button 
                  onClick={() => setApiError(null)}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages - Scrollable area with expanded width (additional 30px) */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {message.type !== 'system' && (
                    <div className={`flex items-start space-x-5 mb-6 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      {message.type === 'bot' && (
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-2'}`}>
                        <div className={`inline-block p-6 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'bg-card border border-border shadow-sm'
                        }`}>
                          <div className="whitespace-pre-wrap text-lg leading-relaxed">{message.content}</div>
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 order-3">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Options - Left Aligned with expanded spacing */}
                  {message.options && (
                    <div className={`space-y-4 ${
                      message.type === 'system' ? 'flex flex-col items-start' : 'ml-17'
                    }`}>
                      {message.options.map((option, index) => (
                        <motion.div
                          key={`option-${message.id}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-block"
                        >
                          <Button
                            onClick={() => handleOptionSelect(option)}
                            variant="outline"
                            className="h-auto p-5 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 text-lg font-medium"
                          >
                            {option}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Recommendations - Left Aligned with expanded width */}
                  {message.recommendations && (
                    <div className="ml-17 space-y-6 mt-8">
                      {message.recommendations.map((rec, index) => (
                        <motion.div
                          key={`rec-${message.id}-${rec.route.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="max-w-4xl border border-border rounded-2xl p-8 bg-card hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex flex-col items-start justify-between mb-6 gap-5">
                            <div className="flex-1 w-full">
                              <div className="flex flex-col items-start space-y-4 mb-4">
                                <h3 className="text-2xl font-semibold">{rec.route.name}</h3>
                                <Badge variant="secondary" className="text-base px-4 py-2">
                                  {rec.route.category}
                                </Badge>
                              </div>
                              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                {rec.route.description}
                              </p>
                            </div>
                            
                            <div className="self-end">
                              <div className={`inline-flex items-center px-5 py-3 rounded-full text-lg font-medium ${
                                rec.confidence >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400' :
                                rec.confidence >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400'
                              }`}>
                                {rec.confidence}% match
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4 mb-6 text-lg">
                            <div><span className="font-semibold">Processing:</span> {rec.route.processingTime}</div>
                            <div><span className="font-semibold">Difficulty:</span> {rec.route.difficulty}</div>
                          </div>
                          
                          {rec.reasoning.length > 0 && (
                            <div className="bg-primary/5 rounded-xl p-6 mb-6">
                              <p className="text-lg text-primary mb-4 font-semibold">
                                Why AI recommends this:
                              </p>
                              <ul className="text-lg text-muted-foreground space-y-3">
                                {rec.reasoning.map((reason, i) => (
                                  <li key={`reason-${message.id}-${rec.route.id}-${i}`} className="flex items-start space-x-4">
                                    <span className="text-primary mt-1 flex-shrink-0 text-xl">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="flex flex-col space-y-4">
                            <Button 
                              onClick={() => handleRouteSelect(rec.route)}
                              variant="outline"
                              size="lg"
                              className="w-full text-lg h-14"
                            >
                              Learn More
                            </Button>
                            <Button 
                              onClick={() => handleStartAssessment(rec.route)}
                              size="lg"
                              className="w-full text-lg h-14"
                            >
                              Check Eligibility
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {/* Typing Indicator - Left Aligned */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-5 justify-start"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-5">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-lg text-muted-foreground">
                    VISA-AI is thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input - Fixed at bottom with expanded width */}
        <div className="flex-shrink-0 bg-background border-t border-border p-10">
          <div className="flex space-x-6 w-full">
            <Input
              placeholder="Type your visa question here..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-w-0 h-16 px-6 text-lg rounded-2xl"
              disabled={loading || isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentInput.trim() || loading || isTyping}
              className="flex-shrink-0 h-16 px-10 rounded-2xl"
              size="lg"
            >
              {loading || isTyping ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </Button>
          </div>
          <div className="text-base text-muted-foreground mt-5 text-left">
            Ask me anything about UK visas - requirements, processing times, 2025 changes, eligibility, etc.
          </div>
        </div>
      </div>
    </div>
  );
}