
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User, Brain, Zap, Search, Settings, Moon, Sun, Sparkles } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  personality: string;
  color: string;
  icon: string;
  defaultUser: string;
}

interface Message {
  id: string;
  type: 'user' | 'agent' | 'thinking';
  content: string;
  timestamp: Date;
  agent?: Agent;
  thinkingSteps?: string[];
}

const agents: Agent[] = [
  {
    id: 'bob',
    name: 'Bob',
    role: 'Sales Manager',
    personality: 'Results-oriented, confident, business-focused',
    color: 'from-purple-600 to-violet-700',
    icon: '👨‍💼',
    defaultUser: 'bob@daxaai.onmicrosoft.com'
  },
  {
    id: 'alice',
    name: 'Alice', 
    role: 'Sales Analyst',
    personality: 'Detail-oriented, methodical, analytical',
    color: 'from-violet-600 to-purple-700',
    icon: '👩‍💻',
    defaultUser: 'alice@daxaai.onmicrosoft.com'
  }
];

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setCurrentUser(agent.defaultUser);
    }
  };

  const simulateThinking = (agent: Agent, query: string) => {
    setIsThinking(true);
    
    const thinkingMessage: Message = {
      id: Date.now().toString(),
      type: 'thinking',
      content: 'Analyzing query...',
      timestamp: new Date(),
      agent,
      thinkingSteps: [
        '🧠 Analyzing query structure',
        '🔍 Determining best approach', 
        '🛠️ Selecting appropriate tools',
        '📡 Calling get_answer_for_user',
        `   └─ User: ${currentUser}`,
        `   └─ Query: "${query}"`,
        '⏳ Processing response...'
      ]
    };

    setMessages(prev => [...prev, thinkingMessage]);

    setTimeout(() => {
      setIsThinking(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `Based on the enterprise data analysis, here's what I found regarding "${query}".\n\n${agent.id === 'bob' ? '🎯 Business Impact: This aligns with our strategic objectives and will drive revenue growth.' : '📊 Data Insights: The statistical trends show significant patterns in the requested metrics.'}\n\nKey findings:\n• Comprehensive data analysis completed\n• Access permissions verified\n• Results optimized for your role`,
        timestamp: new Date(),
        agent
      };
      
      setMessages(prev => prev.slice(0, -1).concat([response]));
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user', 
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateThinking(selectedAgent, inputValue);
    setInputValue('');
  };

  const renderThinkingSteps = (steps: string[]) => (
    <div className="space-y-2 font-mono text-sm">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2 text-purple-300">
          {step.startsWith('   └─') ? (
            <div className="ml-4 text-violet-400">{step}</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              {step}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                    LangGraph Agent Chat
                  </h1>
                  <p className="text-sm text-purple-300">Proxima MCP Integration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-300">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-purple-300 hover:text-white hover:bg-purple-800/50"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-300 hover:text-white hover:bg-purple-800/50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="bg-black/40 border-purple-800/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Choose Your AI Agent
                </CardTitle>
                <p className="text-purple-300 text-sm">
                  Select an AI agent to start your intelligent conversation
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Select onValueChange={handleAgentSelect}>
                  <SelectTrigger className="w-full h-14 bg-purple-900/30 border-purple-700/50 text-white hover:bg-purple-900/50 transition-all duration-200 focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select an agent..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-purple-700/50">
                    {agents.map((agent) => (
                      <SelectItem 
                        key={agent.id} 
                        value={agent.id}
                        className="text-white hover:bg-purple-900/50 focus:bg-purple-900/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 py-2">
                          <div className={`w-10 h-10 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center text-lg shadow-lg`}>
                            {agent.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white">{agent.name}</div>
                            <div className="text-sm text-purple-300">{agent.role}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="text-center space-y-2">
                      <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${agent.color} rounded-xl flex items-center justify-center text-lg shadow-lg shadow-purple-500/30`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{agent.name}</div>
                        <div className="text-xs text-purple-400">{agent.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
                className="text-purple-300 hover:text-white hover:bg-purple-800/50"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${selectedAgent.color} rounded-lg flex items-center justify-center text-lg shadow-lg`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Chat with {selectedAgent.name}
                  </h1>
                  <p className="text-sm text-purple-300">{selectedAgent.role}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-700/50">
                {currentUser}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-300 hover:text-white hover:bg-purple-800/50"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-6">
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${selectedAgent.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-purple-500/30`}>
                {selectedAgent.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to assist you!
              </h3>
              <p className="text-purple-300">
                Ask me anything about your enterprise data and I'll help you find the answers.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-md bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-semibold text-sm">You</span>
                    </div>
                    <p className="text-white">{message.content}</p>
                    <p className="text-xs text-purple-200 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {message.type === 'thinking' && (
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-black/40 border border-purple-800/50 rounded-2xl rounded-tl-sm p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 bg-gradient-to-r ${message.agent?.color} rounded-lg flex items-center justify-center text-sm`}>
                        {message.agent?.icon}
                      </div>
                      <span className="font-semibold text-white">{message.agent?.name}</span>
                      <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-700/50">
                        Thinking
                      </Badge>
                    </div>
                    <div className="bg-purple-950/30 rounded-lg p-3 border border-purple-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-sm font-semibold text-purple-300">Processing...</span>
                      </div>
                      {message.thinkingSteps && renderThinkingSteps(message.thinkingSteps)}
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'agent' && (
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-black/40 border border-purple-800/50 rounded-2xl rounded-tl-sm p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-6 h-6 bg-gradient-to-r ${message.agent?.color} rounded-lg flex items-center justify-center text-sm`}>
                        {message.agent?.icon}
                      </div>
                      <span className="font-semibold text-white">{message.agent?.name}</span>
                      <span className="text-xs text-purple-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-purple-100 whitespace-pre-line leading-relaxed">
                      {message.content}
                    </div>
                    <div className="mt-4 p-3 bg-purple-950/30 rounded-lg border border-purple-800/30">
                      <div className="flex items-center justify-between text-xs text-purple-400">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3" />
                          <span>Data Source: Proxima MCP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>Queried as: {currentUser}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-800/50 p-4 shadow-2xl shadow-purple-500/20">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your enterprise data..."
              className="flex-1 bg-purple-900/30 border-purple-700/50 text-white placeholder:text-purple-400 focus:ring-2 focus:ring-purple-500 h-12"
              disabled={isThinking}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white h-12 px-6 shadow-lg shadow-purple-500/30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
