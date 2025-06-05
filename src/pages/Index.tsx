import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Settings, HelpCircle, Moon, Sun, Send, Loader2, Brain, Zap, Search, Wrench, Clock, CheckCircle, AlertCircle, Users, Mail, BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
interface Message {
  id: string;
  type: 'user' | 'agent' | 'thinking';
  content: string;
  agent?: 'bob' | 'alice';
  timestamp: Date;
  thinkingSteps?: ThinkingStep[];
  sourceInfo?: {
    dataSource: string;
    queriedAs: string;
    responseTime: string;
  };
}

interface ThinkingStep {
  id: string;
  type: 'analyzing' | 'selecting' | 'calling' | 'processing';
  description: string;
  status: 'active' | 'completed' | 'error';
}

interface Agent {
  id: 'bob' | 'alice';
  name: string;
  role: string;
  personality: string;
  defaultUser: string;
  color: string;
  gradient: string;
  icon: string;
  focus: string[];
  speakingStyle: string;
}

const agents: Agent[] = [
  {
    id: 'bob',
    name: 'Bob',
    role: 'Sales Manager',
    personality: 'Results-oriented, confident, business-focused',
    defaultUser: 'bob@daxaai.onmicrosoft.com',
    color: 'blue',
    gradient: 'from-blue-500 via-blue-600 to-purple-600',
    icon: '👨‍💼',
    focus: ['Revenue growth', 'Customer relationships', 'Sales strategies'],
    speakingStyle: 'Direct, actionable, uses business terminology'
  },
  {
    id: 'alice',
    name: 'Alice',
    role: 'Sales Analyst',
    personality: 'Detail-oriented, methodical, analytical',
    defaultUser: 'alice@daxaai.onmicrosoft.com',
    color: 'green',
    gradient: 'from-emerald-500 via-green-600 to-teal-600',
    icon: '👩‍💻',
    focus: ['Data trends', 'Statistical insights', 'Performance metrics'],
    speakingStyle: 'Precise, thorough, data-focused explanations'
  }
];

const Index = () => {
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentThinkingSteps, setCurrentThinkingSteps] = useState<ThinkingStep[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentThinkingSteps]);

  const selectAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setCurrentAgent(agent);
      setCurrentUser(agent.defaultUser);
      setMessages([]);
    }
  };

  const simulateThinking = async (): Promise<ThinkingStep[]> => {
    const steps: ThinkingStep[] = [
      { id: '1', type: 'analyzing', description: 'Analyzing query structure', status: 'active' },
      { id: '2', type: 'selecting', description: 'Determining best approach', status: 'active' },
      { id: '3', type: 'calling', description: 'Selecting appropriate tools', status: 'active' },
      { id: '4', type: 'processing', description: `Calling get_answer_for_user`, status: 'active' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentThinkingSteps(prev => 
        steps.slice(0, i + 1).map(step => ({ ...step, status: 'completed' }))
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    return steps.map(step => ({ ...step, status: 'completed' }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentAgent || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);
    setCurrentThinkingSteps([]);

    // Simulate thinking process
    const thinkingSteps = await simulateThinking();

    // Generate response based on agent personality
    const response = generateAgentResponse(inputValue, currentAgent);
    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      content: response.content,
      agent: currentAgent.id,
      timestamp: new Date(),
      thinkingSteps,
      sourceInfo: {
        dataSource: 'Proxima MCP',
        queriedAs: currentUser,
        responseTime: '2.3s'
      }
    };

    setIsThinking(false);
    setCurrentThinkingSteps([]);
    setMessages(prev => [...prev, agentMessage]);
  };

  const generateAgentResponse = (query: string, agent: Agent) => {
    const responses = {
      bob: {
        content: `Based on our enterprise data, I can provide strategic insights on this. 

${query.toLowerCase().includes('pto') || query.toLowerCase().includes('policy') ? 
`**Key Policy Points:**
• 15 days annual leave for sales team
• 10 sick days with flexible scheduling
• Q4 blackout dates during peak season

🎯 **Business Impact:** This policy supports work-life balance while maintaining our aggressive Q4 targets. I recommend discussing timing with your direct reports to ensure coverage during key client meetings.` :

query.toLowerCase().includes('sales') || query.toLowerCase().includes('revenue') ?
`**Sales Performance Analysis:**
• Q3 revenue up 23% YoY
• 87% of team hitting monthly targets  
• Pipeline value at $2.3M for Q4

🎯 **Strategic Recommendation:** Focus on enterprise deals >$50K. Our conversion rate on these is 34% higher than industry average.` :

`**Business Perspective:**
I've analyzed this from a strategic sales standpoint. The data shows promising trends that align with our quarterly objectives.

🎯 **Key Takeaway:** This directly impacts our revenue pipeline and customer acquisition strategy.`}

Would you like me to dive deeper into any specific aspect?`
      },
      alice: {
        content: `Here's my detailed analysis of the data patterns:

${query.toLowerCase().includes('pto') || query.toLowerCase().includes('policy') ?
`**Policy Utilization Metrics:**
• Average PTO usage: 12.3 days/year
• Peak usage months: July (34%), December (28%)
• Department variance: Sales (11.2 days), Support (13.8 days)

📊 **Statistical Insight:** 23% of employees use <50% of allocated PTO, suggesting potential policy optimization opportunities.` :

query.toLowerCase().includes('sales') || query.toLowerCase().includes('revenue') ?
`**Comprehensive Sales Analytics:**
• MoM growth rate: 8.7% (above 6.2% target)
• Customer acquisition cost: $245 (down 12% from Q2)
• Average deal size: $18,500 (up 15% YoY)
• Win rate: 34.2% (industry benchmark: 29%)

📊 **Trend Analysis:** The data indicates strong momentum in enterprise segment with 47% quarter-over-quarter growth.` :

`**Data-Driven Analysis:**
I've processed the relevant datasets and identified key performance indicators that provide actionable insights.

📊 **Key Metrics:** The statistical significance is strong (p<0.05) with confidence intervals supporting the observed trends.`}

Let me know if you need deeper statistical analysis or specific data breakdowns.`
      }
    };

    return responses[agent.id];
  };

  const ThinkingProcess = () => (
    <Card className={`mb-6 border-l-4 ${currentAgent?.id === 'bob' ? 'border-l-blue-500 bg-gradient-to-br from-blue-50/80 to-purple-50/40' : 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/80 to-teal-50/40'} backdrop-blur-sm shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
            <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <span className="text-sm font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            🤖 {currentAgent?.name} is thinking...
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {currentThinkingSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              {step.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              <span className={`${step.status === 'completed' ? 'text-emerald-700' : 'text-blue-700'} font-medium`}>
                {step.type === 'analyzing' && '⚡ '}
                {step.type === 'selecting' && '🔍 '}
                {step.type === 'calling' && '🛠️ '}
                {step.type === 'processing' && '📡 '}
                {step.description}
              </span>
            </div>
          ))}
          {currentThinkingSteps.length >= 3 && (
            <div className="ml-7 text-xs text-slate-600 space-y-1 bg-white/50 p-2 rounded-md border">
              <div>└─ User: {currentUser}</div>
              <div>└─ Query: "{inputValue || 'Processing...'}"</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!currentAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  LangGraph Agent Chat
                </h1>
                <p className="text-sm text-slate-600">Proxima MCP Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-emerald-100/80 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Connected</span>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100/80">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100/80">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Agent Selection */}
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold">Choose Your Agent</h2>
            </div>
            <p className="text-xl text-slate-600">Select an AI agent based on your needs. Each agent has unique expertise and personality.</p>
          </div>

          <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Select Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select onValueChange={selectAgent}>
                <SelectTrigger className="w-full h-16 border-2 border-slate-200/50 hover:border-blue-300 transition-all duration-300 bg-gradient-to-r from-white to-slate-50/50">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-slate-200/50">
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id} className="cursor-pointer">
                      <div className="flex items-center gap-4 py-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${agent.gradient} rounded-full flex items-center justify-center text-xl shadow-lg`}>
                          {agent.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">{agent.name}</div>
                          <div className="text-sm text-slate-600">{agent.role}</div>
                          <div className="text-xs text-slate-500 mt-1">{agent.personality}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="max-w-md mx-auto mt-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  System Status
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🔗 Proxima MCP:</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50">
                  ● Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🤖 LangGraph:</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50">
                  ● Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🧠 Claude 3.5:</span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50">
                  ● Active
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg">
                  <div className="text-slate-600">Avg Response:</div>
                  <div className="font-bold text-lg text-blue-700">2.1s</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg">
                  <div className="text-slate-600">Success Rate:</div>
                  <div className="font-bold text-lg text-emerald-700">98.5%</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg text-center">
                <div className="text-slate-600 text-sm">Queries Today:</div>
                <div className="font-bold text-2xl text-purple-700">47</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className={`bg-white/80 backdrop-blur-md border-b-2 ${currentAgent.id === 'bob' ? 'border-b-blue-500' : 'border-b-emerald-500'} px-6 py-4 shadow-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentAgent(null)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-300"
            >
              ← Back to Agent Selection
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${currentAgent.gradient} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                {currentAgent.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Chat with {currentAgent.name}
                </h1>
                <p className="text-sm text-slate-600">{currentAgent.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm bg-white/50 px-3 py-2 rounded-lg border border-slate-200/50">
              <div className="text-slate-600">Current User:</div>
              <div className="font-semibold text-slate-900">{currentUser}</div>
            </div>
            <Button variant="ghost" size="sm" className="hover:bg-slate-100/80">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 mb-6">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${currentAgent.gradient} rounded-full flex items-center justify-center text-3xl shadow-xl`}>
                  {currentAgent.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Welcome! I'm {currentAgent.name}
                </h3>
                <p className="text-slate-600 mb-6 text-lg">{currentAgent.personality}</p>
                <div className="max-w-lg mx-auto">
                  <p className="text-sm text-slate-500 mb-4 font-medium">I specialize in:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentAgent.focus.map((focus, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white/80 border-slate-300 text-slate-700">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-lg bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-2xl rounded-br-md px-6 py-4 shadow-xl">
                      <div className="font-medium mb-2 text-slate-200">You</div>
                      <div className="text-white">{message.content}</div>
                      <div className="text-xs text-slate-300 mt-3">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-3xl">
                      <div className={`bg-white/90 backdrop-blur-sm border-l-4 ${currentAgent.id === 'bob' ? 'border-l-blue-500' : 'border-l-emerald-500'} rounded-2xl rounded-tl-md px-6 py-4 shadow-xl`}>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl">{currentAgent.icon}</span>
                          <span className="font-bold text-lg">{currentAgent.name} ({currentAgent.role})</span>
                          <span className="text-xs text-slate-500 ml-auto bg-slate-100 px-2 py-1 rounded-full">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                          {message.content}
                        </div>

                        {message.sourceInfo && (
                          <div className={`mt-4 p-4 rounded-xl ${currentAgent.id === 'bob' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50'}`}>
                            <div className="text-xs space-y-2">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-3 w-3" />
                                <span className="font-medium">Data Source:</span>
                                <span>{message.sourceInfo.dataSource}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span className="font-medium">Queried as:</span>
                                <span>{message.sourceInfo.queriedAs}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">Response time:</span>
                                <span>{message.sourceInfo.responseTime}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && <ThinkingProcess />}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-4 shadow-xl">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="💭 Type your question..."
              className="flex-1 border-2 border-slate-200/50 focus:border-blue-300 h-12 text-base bg-white/80"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isThinking}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className={`bg-gradient-to-r ${currentAgent.gradient} hover:opacity-90 transition-all duration-300 h-12 px-6 shadow-lg`}
            >
              {isThinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
