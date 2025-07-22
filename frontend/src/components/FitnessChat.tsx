import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatState, UserProfile } from '@/constants/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
import { images } from '@/constants/images';

interface FitnessChatProps {
  userProfile: UserProfile;
  chatState: ChatState;
  onSendMessage: (message: string) => void;
  onBackToProfile: () => void;
}

export const FitnessChat = ({ userProfile, chatState, onSendMessage, onBackToProfile }: FitnessChatProps) => {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = () => {
    if (!input.trim() || chatState.isLoading) return;
    
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageText = (text: string) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToProfile}
              className="hover:bg-fitness-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-10 h-10 border-2 border-fitness-primary">
                <AvatarImage src={images.bot} alt="Fitness Bot" />
                <AvatarFallback className="bg-fitness-gradient text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-semibold text-lg">AI Fitness Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Personal trainer for {userProfile.sex}, {userProfile.age}y, {userProfile.weight}kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4">
        <ScrollArea className="h-[calc(100vh-200px)] py-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {chatState.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-slide-up ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="w-8 h-8 border-2 border-fitness-primary flex-shrink-0">
                    <AvatarImage src={images.bot} alt="Fitness Bot" />
                    <AvatarFallback className="bg-fitness-gradient text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <Card className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-fitness-gradient text-white border-0' 
                    : 'bg-card border'
                }`}>
                  <CardContent className="p-4">
                    <div 
                      className={`${message.sender === 'user' ? 'text-white' : 'text-foreground'}`}
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessageText(message.text) 
                      }} 
                    />
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>

                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 mr-8 border-2 border-fitness-secondary flex-shrink-0">
                    <AvatarFallback className="bg-fitness-secondary text-black">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {chatState.isLoading && (
              <div className="flex gap-3 justify-start animate-bounce-in">
                <Avatar className="w-8 h-8 border-2 border-fitness-primary">
                  <AvatarImage src={images.bot} alt="Fitness Bot" />
                  <AvatarFallback className="bg-fitness-gradient text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card border">
                  <CardContent className="p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-fitness-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="border-t bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about fitness, nutrition, or workouts..."
                disabled={chatState.isLoading}
                className="h-12 text-base border-2 focus:border-fitness-primary resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || chatState.isLoading}
              size="lg"
              className="bg-fitness-gradient hover:bg-fitness-gradient-dark h-12 px-6 shadow-fitness-glow hover:shadow-none transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • This AI provides general fitness advice and is not a substitute for professional medical consultation
          </p>
        </div>
      </div>
    </div>
  );
};