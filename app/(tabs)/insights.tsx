import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lightbulb, TrendingUp, Clock, Heart, BookOpen, Play } from 'lucide-react-native';

export default function Insights() {
  const [selectedTab, setSelectedTab] = useState('Nutrition');

  const tabs = ['Nutrition', 'Recipes', 'Tips', 'Trends'];

  const nutritionInsights = [
    {
      id: 1,
      title: 'Balanced Protein Intake',
      description: 'Learn about different protein sources and their benefits for your daily nutrition.',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
      readTime: '5 min read',
      category: 'Nutrition',
    },
    {
      id: 2,
      title: 'The Power of Antioxidants',
      description: 'Discover how colorful fruits and vegetables can boost your immune system.',
      image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
      readTime: '7 min read',
      category: 'Health',
    },
  ];

  const recipes = [
    {
      id: 1,
      title: 'Quick Breakfast Bowl',
      description: 'A nutritious start to your day with oats, fruits, and nuts.',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
      cookTime: '10 min',
      difficulty: 'Easy',
      category: 'Breakfast',
    },
    {
      id: 2,
      title: 'Mediterranean Salad',
      description: 'Fresh vegetables with olive oil and feta cheese.',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      cookTime: '15 min',
      difficulty: 'Easy',
      category: 'Lunch',
    },
  ];

  const cookingTips = [
    {
      id: 1,
      title: 'Meal Prep Like a Pro',
      tip: 'Prepare ingredients in advance to save time during busy weekdays.',
      icon: '📦',
    },
    {
      id: 2,
      title: 'Proper Food Storage',
      tip: 'Learn how to store different foods to maintain freshness and prevent waste.',
      icon: '🥬',
    },
    {
      id: 3,
      title: 'Seasoning Secrets',
      tip: 'Master the art of seasoning to enhance flavors without adding extra calories.',
      icon: '🧂',
    },
  ];

  const trends = [
    {
      id: 1,
      title: 'Plant-Based Revolution',
      description: 'More people are embracing plant-based diets for health and sustainability.',
      percentage: '+34%',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    },
    {
      id: 2,
      title: 'Fermented Foods Rising',
      description: 'Kombucha, kimchi, and other fermented foods are gaining popularity.',
      percentage: '+28%',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'Nutrition':
        return (
          <View>
            {nutritionInsights.map((insight) => (
              <TouchableOpacity key={insight.id} style={styles.insightCard}>
                <Image source={{ uri: insight.image }} style={styles.insightImage} />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                  <View style={styles.insightMeta}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.readTime}>{insight.readTime}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{insight.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'Recipes':
        return (
          <View>
            {recipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription}>{recipe.description}</Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#006400" />
                      <Text style={styles.metaText}>{recipe.cookTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'Tips':
        return (
          <View>
            {cookingTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.tip}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'Trends':
        return (
          <View>
            {trends.map((trend) => (
              <TouchableOpacity key={trend.id} style={styles.trendCard}>
                <Image source={{ uri: trend.image }} style={styles.trendImage} />
                <View style={styles.trendContent}>
                  <View style={styles.trendHeader}>
                    <Text style={styles.trendTitle}>{trend.title}</Text>
                    <View style={styles.trendBadge}>
                      <TrendingUp size={12} color="#32CD32" />
                      <Text style={styles.trendPercentage}>{trend.percentage}</Text>
                    </View>
                  </View>
                  <Text style={styles.trendDescription}>{trend.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Food Insights</Text>
          <Text style={styles.headerSubtitle}>Learn about nutrition, recipes, and cooking tips</Text>
        </View>

        {/* Featured Insight */}
        <View style={styles.featuredSection}>
          <TouchableOpacity style={styles.featuredCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }} 
              style={styles.featuredImage} 
            />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredBadge}>
                <Lightbulb size={16} color="#FFD700" />
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
              <Text style={styles.featuredTitle}>The Science of Flavor Pairing</Text>
              <Text style={styles.featuredDescription}>
                Discover how molecular gastronomy principles can elevate your cooking.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  selectedTab === tab && styles.activeTab
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          {renderContent()}
        </View>

        {/* Daily Tip */}
        <View style={styles.dailyTipSection}>
          <View style={styles.dailyTipHeader}>
            <Heart size={20} color="#E91E63" />
            <Text style={styles.dailyTipTitle}>Daily Nutrition Tip</Text>
          </View>
          <View style={styles.dailyTipCard}>
            <Text style={styles.dailyTipText}>
              "Eating a rainbow of colors ensures you get a variety of nutrients. Aim for 5 different colored fruits and vegetables each day!"
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Learning</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <BookOpen size={24} color="#006400" />
              <Text style={styles.quickActionText}>Recipe Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Lightbulb size={24} color="#FF8F00" />
              <Text style={styles.quickActionText}>Cooking Tips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <TrendingUp size={24} color="#3F51B5" />
              <Text style={styles.quickActionText}>Food Trends</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Heart size={24} color="#E91E63" />
              <Text style={styles.quickActionText}>Nutrition Facts</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  featuredSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featuredCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#006400',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  insightImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  insightContent: {
    flex: 1,
    marginLeft: 15,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 10,
    lineHeight: 20,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  categoryBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  recipeImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  recipeContent: {
    flex: 1,
    marginLeft: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 6,
  },
  recipeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#006400',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  playButton: {
    backgroundColor: '#32CD32',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  trendCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  trendImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  trendContent: {
    flex: 1,
    marginLeft: 15,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trendPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#32CD32',
  },
  trendDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
  dailyTipSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dailyTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dailyTipTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  dailyTipCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  dailyTipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
});