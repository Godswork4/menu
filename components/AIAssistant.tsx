import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Animated, Easing, Image } from 'react-native';
import { MessageCircle, X, Send, ChefHat, Heart, DollarSign, Lightbulb } from 'lucide-react-native';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Menu AI assistant. I can help you with recipes, dietary advice, budget meal planning, and food recommendations. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingDot1 = useRef(new Animated.Value(0.4)).current;
  const typingDot2 = useRef(new Animated.Value(0.7)).current;
  const typingDot3 = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const quickActions = [
    { id: 1, text: "Find healthy recipes", icon: Heart, color: "#E91E63" },
    { id: 2, text: "Budget meal ideas", icon: DollarSign, color: "#4CAF50" },
    { id: 3, text: "Cooking tips", icon: ChefHat, color: "#FF9800" },
    { id: 4, text: "Nutrition advice", icon: Lightbulb, color: "#2196F3" },
  ];

  // Start pulse animation for the floating button
  useEffect(() => {
    const pulsate = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    pulsate.start();

    return () => pulsate.stop();
  }, []);

  // Animate typing dots
  useEffect(() => {
    if (isTyping) {
      const animateDots = Animated.loop(
        Animated.sequence([
          // First dot
          Animated.timing(typingDot1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot1, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
          // Second dot
          Animated.timing(typingDot2, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot2, {
            toValue: 0.7,
            duration: 400,
            useNativeDriver: true,
          }),
          // Third dot
          Animated.timing(typingDot3, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(typingDot3, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      animateDots.start();

      return () => animateDots.stop();
    }
  }, [isTyping]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('recipe') || message.includes('cook')) {
      return "I'd love to help you with recipes! For Nigerian dishes like Jollof Rice, start with parboiled rice, tomato paste, onions, and your choice of protein. Would you like a detailed recipe for any specific dish?";
    }
    
    if (message.includes('healthy') || message.includes('nutrition')) {
      return "Great choice focusing on health! Try incorporating more vegetables, lean proteins, and whole grains. Nigerian foods like pepper soup with fish are excellent for nutrition. What specific health goals do you have?";
    }
    
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return "Budget-friendly meals can be delicious! Try rice and beans, yam porridge, or vegetable soup. These are nutritious and cost-effective. Check out our Budget Meals category for more ideas!";
    }
    
    if (message.includes('weight') || message.includes('diet')) {
      return "For weight management, focus on portion control and balanced meals. Grilled proteins, steamed vegetables, and complex carbs work well. Would you like specific meal suggestions?";
    }
    
    if (message.includes('spicy') || message.includes('pepper')) {
      return "Love spicy food! Nigerian cuisine has amazing options like pepper soup, suya, and spicy jollof rice. Start with scotch bonnet peppers but use them sparingly if you're not used to heat!";
    }
    
    if (message.includes('vegetarian') || message.includes('vegan')) {
      return "Plant-based Nigerian options include moi moi (bean pudding), vegetable soup, plantain dishes, and yam preparations. These are both nutritious and satisfying!";
    }
    
    if (message.includes('quick') || message.includes('fast') || message.includes('easy')) {
      return "For quick meals, try fried rice (15 mins), noodles with vegetables, or simple pasta dishes. Meal prep on weekends can also save time during busy weekdays!";
    }
    
    if (message.includes('age') || message.includes('restriction') || message.includes('alcohol')) {
      return "Menu app has age restrictions for certain products. We don't offer alcohol or age-restricted items. We focus on providing wholesome food options suitable for all ages!";
    }
    
    return "That's an interesting question! I'm here to help with all things food-related. Feel free to ask about recipes, nutrition, cooking tips, or meal planning. What specific food topic interests you most?";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionText: string) => {
    setInputText(actionText);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating AI Button */}
      <Animated.View style={{
        transform: [{ scale: pulseAnim }],
        position: 'absolute',
        bottom: 90,
        right: 20,
        zIndex: 1000,
      }}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsVisible(true)}
          activeOpacity={0.8}
        >
          <Image 
            source={require('../assets/images/menulogo copy copy copy copy.webp')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* AI Chat Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <View style={styles.aiInfo}>
                <View style={styles.aiAvatar}>
                  <Image 
                    source={require('../assets/images/menulogo copy copy copy copy.webp')} 
                    style={styles.avatarImage}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text style={styles.aiName}>Menu AI Assistant</Text>
                  <Text style={styles.aiStatus}>Online • Ready to help</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <X size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser ? styles.userMessage : styles.aiMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.aiMessageText
                    ]}>
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}

              {isTyping && (
                <View style={styles.typingIndicator}>
                  <View style={styles.typingBubble}>
                    <View style={styles.typingDots}>
                      <Animated.View style={[styles.typingDot, { opacity: typingDot1 }]} />
                      <Animated.View style={[styles.typingDot, { opacity: typingDot2 }]} />
                      <Animated.View style={[styles.typingDot, { opacity: typingDot3 }]} />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Help:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickActions}>
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <TouchableOpacity
                        key={action.id}
                        style={[styles.quickActionButton, { borderColor: action.color }]}
                        onPress={() => handleQuickAction(action.text)}
                      >
                        <IconComponent size={16} color={action.color} />
                        <Text style={[styles.quickActionText, { color: action.color }]}>
                          {action.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me about food, recipes, nutrition..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <Send size={20} color={!inputText.trim() ? "#CCCCCC" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 30,
    height: 30,
  },
  aiName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  aiStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#32CD32',
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 15,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#32CD32',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#000000',
  },
  typingIndicator: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#32CD32',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#666666',
    marginBottom: 10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#32CD32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
});