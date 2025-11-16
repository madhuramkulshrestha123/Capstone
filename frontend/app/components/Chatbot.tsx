'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../lib/useTranslation';
import { apiFetch, setAuthToken } from '../lib/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = ({ language, isDarkTheme }: { language: 'en' | 'hi'; isDarkTheme: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { t } = useTranslation(language);
  const [context, setContext] = useState<any>({});

  // Initialize auth token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Sample bot responses
  const botResponses = {
    en: [
      "I can help with job cards, payments, and projects.",
      "Apply for a job card at your nearest Panchayat office.",
      "Need to track your application? Use your tracking ID.",
      "For help, call our helpline at 1800-123-4567.",
      "Get job cards, track applications, and request work."
    ],
    hi: [
      "मैं नौकरी कार्ड, भुगतान और परियोजनाओं में मदद कर सकता हूँ।",
      "अपने निकटतम पंचायत कार्यालय में नौकरी कार्ड के लिए आवेदन करें।",
      "अपने आवेदन को ट्रैक करने के लिए अपनी ट्रैकिंग आईडी का उपयोग करें।",
      "सहायता के लिए हमारे हेल्पलाइन 1800-123-4567 पर कॉल करें।",
      "नौकरी कार्ड प्राप्त करें, आवेदन ट्रैक करें और काम का अनुरोध करें।"
    ]
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Add welcome message when chat opens for the first time
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            text: language === 'en' 
              ? "Hello! I'm your assistant. How can I help?" 
              : "नमस्ते! मैं आपका सहायक हूं। मैं आपकी कैसे सहायता कर सकता हूं?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }, 300);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch job card data
  const fetchJobCardData = async (jobCardId: string) => {
    try {
      const data = await apiFetch(`/chatbot/job-card/${jobCardId}`);
      
      if (data.success) {
        // Update context with job card data
        setContext((prevContext: any) => ({
          ...prevContext,
          jobCard: data.data.jobCard,
          user: data.data.user,
          workHistory: data.data.workHistory,
          paymentHistory: data.data.paymentHistory
        }));
        
        return data.data;
      } else {
        throw new Error(data.error?.message || 'Failed to fetch job card data');
      }
    } catch (error) {
      console.error('Error fetching job card data:', error);
      return null;
    }
  };

  // Function to fetch project data
  const fetchProjectData = async (projectId: string) => {
    try {
      const data = await apiFetch(`/chatbot/project/${projectId}`);
      
      if (data.success) {
        // Update context with project data
        setContext((prevContext: any) => ({
          ...prevContext,
          project: data.data.project,
          assignedWorkers: data.data.assignedWorkers
        }));
        
        return data.data;
      } else {
        throw new Error(data.error?.message || 'Failed to fetch project data');
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      return null;
    }
  };

  // Function to process user query with AI
  const processUserQuery = async (query: string) => {
    try {
      const data = await apiFetch('/chatbot/query', {
        method: 'POST',
        body: JSON.stringify({ query, context }),
      });
      
      if (data.success) {
        return data.data.response;
      } else {
        throw new Error(data.error?.message || 'Failed to process query');
      }
    } catch (error) {
      console.error('Error processing user query:', error);
      return null;
    }
  };

  // Function to generate a formatted response for job card data
  const generateJobCardResponse = (jobCardData: any) => {
    return `Job Card ID: ${jobCardData.jobCard.trackingId}
Status: ${jobCardData.jobCard.status}
Head: ${jobCardData.jobCard.headOfHouseholdName}
Category: ${jobCardData.jobCard.category}
District: ${jobCardData.jobCard.district}

${jobCardData.user ? `Name: ${jobCardData.user.name}
Phone: ${jobCardData.user.phone}` : ''}

Ask about work history, payments, or projects?`;
  };

  // Function to generate a formatted response for work history
  const generateWorkHistoryResponse = (workHistory: any[]) => {
    if (!workHistory || workHistory.length === 0) {
      return "No work history yet. You'll see projects here after assignment.";
    }
    
    let response = "Recent work:\n";
    
    workHistory.slice(0, 2).forEach((work, index) => {
      response += `${index + 1}. ${work.name || work.project_name || 'Project'}
   Wage: ₹${work.wage_per_worker || work.wage || 0}
   Status: ${work.status || 'Completed'}\n`;
    });
    
    if (workHistory.length > 2) {
      response += `... and ${workHistory.length - 2} more.`;
    }
    
    return response;
  };

  // Function to generate a formatted response for payment history
  const generatePaymentHistoryResponse = (paymentHistory: any[]) => {
    if (!paymentHistory || paymentHistory.length === 0) {
      return "No payment records yet. Payments appear after project completion.";
    }
    
    let response = "Payment history:\n";
    
    paymentHistory.slice(0, 2).forEach((payment, index) => {
      response += `${index + 1}. Project: ${payment.project_name || 'N/A'}
   Amount: ₹${payment.amount || 0}
   Status: ${payment.status || 'N/A'}\n`;
    });
    
    if (paymentHistory.length > 2) {
      response += `... and ${paymentHistory.length - 2} more.`;
    }
    
    return response;
  };

  // Function to handle errors gracefully
  const handleError = (errorMessage: string) => {
    const errorResponses = {
      en: [
        `Sorry, I encountered an error. Please try again.`,
        `I couldn't process your request. Please try again.`,
        `An error occurred. Please try again.`
      ],
      hi: [
        `क्षमा करें, मुझे एक त्रुटि मिली। कृपया पुन: प्रयास करें।`,
        `मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुन: प्रयास करें।`,
        `एक त्रुटि हुई। कृपया पुन: प्रयास करें।`
      ]
    };
    
    const responses = errorResponses[language];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if the message contains a job card ID (both tracking ID and job card ID formats)
      const jobCardIdMatch = inputValue.match(/(JC-\d+-\d+)|([A-Z]{4}\d{8})/i);
      if (jobCardIdMatch) {
        // Get the matched group (either group 1 for tracking ID or group 2 for job card ID)
        const jobCardId = jobCardIdMatch[1] || jobCardIdMatch[2];
        const jobCardData = await fetchJobCardData(jobCardId);
        
        if (jobCardData) {
          const botMessage: Message = {
            id: messages.length + 2,
            text: generateJobCardResponse(jobCardData),
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        } else {
          const botMessage: Message = {
            id: messages.length + 2,
            text: handleError("Unable to fetch job card data. Please check the ID and try again."),
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Check if the message contains a project ID
      const projectIdMatch = inputValue.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
      if (projectIdMatch) {
        const projectId = projectIdMatch[1];
        const projectData = await fetchProjectData(projectId);
        
        if (projectData) {
          const botMessage: Message = {
            id: messages.length + 2,
            text: `Project ID: ${projectId}
Name: ${projectData.project.name}
Location: ${projectData.project.location}
Status: ${projectData.project.status}
Wage: ₹${projectData.project.wage_per_worker}
Workers: ${projectData.assignedWorkers.length}`,
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        } else {
          const botMessage: Message = {
            id: messages.length + 2,
            text: handleError("Unable to fetch project data. Please check the ID and try again."),
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Check for specific keywords in the query
      if (inputValue.toLowerCase().includes('work history') || inputValue.toLowerCase().includes('work experience')) {
        if (context.workHistory) {
          const botMessage: Message = {
            id: messages.length + 2,
            text: generateWorkHistoryResponse(context.workHistory),
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        } else if (context.jobCard) {
          // Fetch work history if not already in context
          const jobCardData = await fetchJobCardData(context.jobCard.trackingId);
          if (jobCardData) {
            const botMessage: Message = {
              id: messages.length + 2,
              text: generateWorkHistoryResponse(jobCardData.workHistory),
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
            return;
          }
        } else {
          const botMessage: Message = {
            id: messages.length + 2,
            text: "Please provide a job card ID first to get your work history.",
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      }

      if (inputValue.toLowerCase().includes('payment') || inputValue.toLowerCase().includes('salary')) {
        if (context.paymentHistory) {
          const botMessage: Message = {
            id: messages.length + 2,
            text: generatePaymentHistoryResponse(context.paymentHistory),
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        } else if (context.jobCard) {
          // Fetch payment history if not already in context
          const jobCardData = await fetchJobCardData(context.jobCard.trackingId);
          if (jobCardData) {
            const botMessage: Message = {
              id: messages.length + 2,
              text: generatePaymentHistoryResponse(jobCardData.paymentHistory),
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
            return;
          }
        } else {
          const botMessage: Message = {
            id: messages.length + 2,
            text: "Please provide a job card ID first to get your payment information.",
            sender: 'bot',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Process the query with AI
      const aiResponse = await processUserQuery(inputValue);
      
      if (aiResponse) {
        const botMessage: Message = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to sample responses
        const responses = botResponses[language];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage: Message = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      const botMessage: Message = {
        id: messages.length + 2,
        text: handleError("An unexpected error occurred. Please try again later."),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-7 right-7 z-50">
      {/* Chatbot Button */}
      <button
        onClick={toggleChat}
        className={`px-5 py-4 rounded-full shadow-2xl transform transition-transform duration-300 hover:scale-110 focus:outline-none ${
          isDarkTheme 
            ? 'bg-indigo-700 text-white shadow-indigo-900' 
            : 'bg-indigo-600 text-white shadow-indigo-700'
        }`}
        aria-label="Chatbot"
      >
        <div className="flex items-center space-x-3 select-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold">{t('chatbotMessage')}</span>
        </div>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`absolute bottom-20 right-0 w-80 h-96 rounded-xl shadow-2xl flex flex-col transform transition-all duration-300 ${
          isDarkTheme 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-white text-gray-900 border border-gray-200'
        }`}>
          {/* Chat Header */}
          <div className={`px-4 py-3 rounded-t-xl flex justify-between items-center ${
            isDarkTheme ? 'bg-gray-900' : 'bg-indigo-600 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">{t('chatbotMessage')}</span>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? isDarkTheme
                        ? 'bg-indigo-700 text-white'
                        : 'bg-indigo-600 text-white'
                      : isDarkTheme
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? isDarkTheme ? 'text-indigo-200' : 'text-indigo-100'
                      : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`px-4 py-2 rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className={`p-3 border-t ${
            isDarkTheme ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={language === 'en' ? "Type your message..." : "अपना संदेश टाइप करें..."}
                className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isDarkTheme 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="submit"
                disabled={inputValue.trim() === '' || isLoading}
                className={`p-2 rounded-lg ${
                  inputValue.trim() === '' || isLoading
                    ? isDarkTheme
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkTheme
                      ? 'bg-indigo-700 text-white hover:bg-indigo-600'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;