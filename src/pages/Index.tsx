
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User, Brain, Zap, Search, Settings, Moon, Sun, Sparkles, Star, Heart, Coffee } from 'lucide-react';

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
    color: 'from-amber-500 to-orange-600',
    icon: '👨‍💼',
    defaultUser: 'bob@daxaai.onmicrosoft.com'
  },
  {
    id: 'alice',
    name: 'Alice', 
    role: 'Sales Analyst',
    personality: 'Detail-oriented, methodical, analytical',
    color: 'from-emerald-500 to-teal-600',
    icon: '👩‍💻',
    defaultUser: 'alice@daxaai.onmicrosoft.com'
  }
];

const genZQuotes = [
  "It's giving main character energy ✨",
  "No cap, this AI is fire 🔥",
  "Periodt! Let's get this data 💅",
  "This hits different fr fr",
  "Living rent-free in my analytics 📊",
  "That's lowkey bussin though 💯"
];

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(genZQuotes[0]);

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setCurrentUser(agent.defaultUser);
      setCurrentQuote(genZQuotes[Math.floor(Math.random() * genZQuotes.length)]);
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
        <div key={index} className="flex items-center gap-2 text-amber-700">
          {step.startsWith('   └─') ? (
            <div className="ml-4 text-orange-600">{step}</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              {step}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-stone-800">
        {/* Floating Animations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <Star className="absolute top-1/4 left-1/4 w-6 h-6 text-amber-400 animate-bounce opacity-20" style={{animationDelay: '0s'}} />
          <Heart className="absolute top-1/3 right-1/4 w-5 h-5 text-rose-400 animate-pulse opacity-30" style={{animationDelay: '1s'}} />
          <Coffee className="absolute bottom-1/3 left-1/3 w-4 h-4 text-amber-500 animate-bounce opacity-25" style={{animationDelay: '2s'}} />
          <Sparkles className="absolute top-1/2 right-1/3 w-5 h-5 text-yellow-400 animate-spin opacity-20" style={{animationDelay: '1.5s', animationDuration: '3s'}} />
        </div>

        {/* Header */}
        <div className="border-b border-amber-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    LangGraph Agent Chat
                  </h1>
                  <p className="text-sm text-amber-600/80">Proxima MCP Integration • {currentQuote}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-sm text-amber-600 font-medium">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 transition-all duration-200"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="bg-white/90 border-amber-200/50 backdrop-blur-xl shadow-2xl shadow-amber-500/10 transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-500/30 transform hover:rotate-3 transition-transform duration-300">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Choose Your AI Agent
                </CardTitle>
                <p className="text-amber-600/80 text-base mt-2 font-medium">
                  Select an AI agent to start your intelligent conversation
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <Select onValueChange={handleAgentSelect}>
                  <SelectTrigger className="w-full h-16 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300/50 text-stone-800 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 focus:ring-2 focus:ring-amber-400 shadow-sm">
                    <SelectValue placeholder="✨ Select an agent..." className="text-lg" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-200/50 shadow-xl">
                    {agents.map((agent) => (
                      <SelectItem 
                        key={agent.id} 
                        value={agent.id}
                        className="text-stone-800 hover:bg-amber-50 focus:bg-amber-100 cursor-pointer transition-colors duration-150"
                      >
                        <div className="flex items-center gap-4 py-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${agent.color} rounded-xl flex items-center justify-center text-xl shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                            {agent.icon}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-stone-800 text-lg">{agent.name}</div>
                            <div className="text-sm text-amber-600 font-medium">{agent.role}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  {agents.map((agent) => (
                    <div key={agent.id} className="text-center space-y-3 group cursor-pointer" onClick={() => handleAgentSelect(agent.id)}>
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${agent.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {agent.icon}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-stone-800">{agent.name}</div>
                        <div className="text-sm text-amber-600 font-medium">{agent.role}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-stone-800 flex flex-col">
      {/* Header */}
      <div className="border-b border-amber-200/50 bg-white/80 backdrop-blur-xl shrink-0 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedAgent(null)}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 transition-all duration-200"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedAgent.color} rounded-xl flex items-center justify-center text-xl shadow-lg animate-pulse`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-stone-800">
                    Chat with {selectedAgent.name}
                  </h1>
                  <p className="text-sm text-amber-600 font-medium">{selectedAgent.role} • {currentQuote}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300/50 font-medium">
                {currentUser}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/80 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-6">
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${selectedAgent.color} rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-xl shadow-amber-500/30 animate-bounce`}>
                {selectedAgent.icon}
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-3">
                Ready to assist you! ✨
              </h3>
              <p className="text-amber-600 text-lg font-medium">
                Ask me anything about your enterprise data and I'll help you find the answers.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-md bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl rounded-tr-lg px-6 py-4 shadow-lg transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-white" />
                      <span className="font-bold text-sm text-white">You</span>
                    </div>
                    <p className="text-white font-medium">{message.content}</p>
                    <p className="text-xs text-amber-100 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {message.type === 'thinking' && (
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-white/90 border border-amber-200/50 rounded-3xl rounded-tl-lg p-6 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 bg-gradient-to-r ${message.agent?.color} rounded-lg flex items-center justify-center text-lg`}>
                        {message.agent?.icon}
                      </div>
                      <span className="font-bold text-stone-800">{message.agent?.name}</span>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-300/50 animate-pulse">
                        Thinking
                      </Badge>
                    </div>
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-amber-600 animate-pulse" />
                        <span className="text-lg font-bold text-amber-700">Processing...</span>
                      </div>
                      {message.thinkingSteps && renderThinkingSteps(message.thinkingSteps)}
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'agent' && (
                <div className="flex justify-start">
                  <div className="max-w-2xl bg-white/90 border border-amber-200/50 rounded-3xl rounded-tl-lg p-6 backdrop-blur-xl shadow-lg transform hover:scale-[1.01] transition-transform duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 bg-gradient-to-r ${message.agent?.color} rounded-lg flex items-center justify-center text-lg`}>
                        {message.agent?.icon}
                      </div>
                      <span className="font-bold text-stone-800">{message.agent?.name}</span>
                      <span className="text-xs text-amber-600 font-medium">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-stone-700 whitespace-pre-line leading-relaxed font-medium">
                      {message.content}
                    </div>
                    <div className="mt-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/30">
                      <div className="flex items-center justify-between text-sm text-amber-700 font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span>Data Source: Proxima MCP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-amber-200/50 p-6 shadow-xl shadow-amber-500/10">
          <div className="flex gap-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your enterprise data... ✨"
              className="flex-1 bg-amber-50/50 border-amber-300/50 text-stone-800 placeholder:text-amber-600/70 focus:ring-2 focus:ring-amber-400 h-14 text-lg font-medium rounded-2xl"
              disabled={isThinking}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white h-14 px-8 shadow-lg shadow-amber-500/30 rounded-2xl transform hover:scale-105 transition-all duration-200 font-bold"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
