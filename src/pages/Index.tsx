import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Settings, HelpCircle, Moon, Sun, Send, Loader2, Brain, Zap, Search, Wrench, Clock, CheckCircle, AlertCircle, Users, Mail, BarChart3, TrendingUp } from 'lucide-react';
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
    gradient: 'from-blue-600 to-blue-700',
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
    gradient: 'from-green-600 to-green-700',
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
    <Card className={`mb-4 border-l-4 ${currentAgent?.id === 'bob' ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-green-500 bg-green-50/50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">🤖 {currentAgent?.name} is thinking...</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {currentThinkingSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 text-sm">
              {step.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              <span className={step.status === 'completed' ? 'text-green-700' : 'text-blue-700'}>
                {step.type === 'analyzing' && '⚡ '}
                {step.type === 'selecting' && '🔍 '}
                {step.type === 'calling' && '🛠️ '}
                {step.type === 'processing' && '📡 '}
                {step.description}
              </span>
            </div>
          ))}
          {currentThinkingSteps.length >= 3 && (
            <div className="ml-6 text-xs text-gray-600 space-y-1">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">LangGraph Agent Chat</h1>
                <p className="text-sm text-slate-600">Proxima MCP Integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Connected</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Agent Selection */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">👥 Choose Your Agent</h2>
            <p className="text-lg text-slate-600">Select an AI agent based on your needs. Each agent has unique expertise and personality.</p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Select Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select onValueChange={selectAgent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-3 py-2">
                        <span className="text-2xl">{agent.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{agent.name}</div>
                          <div className="text-sm text-slate-600">{agent.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="max-w-md mx-auto mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">🔗 Proxima MCP:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">● Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🤖 LangGraph:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">● Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🧠 Claude 3.5:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">● Active</Badge>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Avg Response:</span>
                  <span className="font-medium">2.1s</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Queries Today:</span>
                  <span className="font-medium">47</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className={`bg-white border-b-2 ${currentAgent.id === 'bob' ? 'border-b-blue-500' : 'border-b-green-500'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentAgent(null)}
              className="text-slate-600 hover:text-slate-900"
            >
              ← Back to Agent Selection
            </Button>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-gradient-to-br ${currentAgent.gradient} rounded-lg flex items-center justify-center text-lg`}>
                {currentAgent.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Chat with {currentAgent.name}</h1>
                <p className="text-sm text-slate-600">{currentAgent.role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="text-slate-600">Current User:</div>
              <div className="font-medium text-slate-900">{currentUser}</div>
            </div>
            <Button variant="ghost" size="sm">
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
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${currentAgent.gradient} rounded-full flex items-center justify-center text-2xl`}>
                  {currentAgent.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Welcome! I'm {currentAgent.name}
                </h3>
                <p className="text-slate-600 mb-4">{currentAgent.personality}</p>
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-slate-500 mb-3">I specialize in:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentAgent.focus.map((focus, idx) => (
                      <Badge key={idx} variant="outline">{focus}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-lg bg-slate-800 text-white rounded-2xl rounded-br-md px-4 py-3">
                      <div className="font-medium mb-1">You</div>
                      <div>{message.content}</div>
                      <div className="text-xs text-slate-300 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-3xl">
                      <div className={`bg-white border-l-4 ${currentAgent.id === 'bob' ? 'border-l-blue-500' : 'border-l-green-500'} rounded-2xl rounded-tl-md px-6 py-4 shadow-sm`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{currentAgent.icon}</span>
                          <span className="font-semibold">{currentAgent.name} ({currentAgent.role})</span>
                          <span className="text-xs text-slate-500 ml-auto">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
                          {message.content}
                        </div>

                        {message.sourceInfo && (
                          <div className={`mt-4 p-3 rounded-lg ${currentAgent.id === 'bob' ? 'bg-blue-50' : 'bg-green-50'} border border-slate-200`}>
                            <div className="text-xs space-y-1">
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
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="💭 Type your question..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isThinking}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className={`bg-gradient-to-r ${currentAgent.gradient} hover:opacity-90`}
            >
              {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
