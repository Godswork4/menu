import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, TrendingUp, TrendingDown, Plus, Target, Calendar } from 'lucide-react-native';

export default function Budget() {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [budgetGoal, setBudgetGoal] = useState('250000');

  const periods = ['Week', 'Month', 'Year'];

  const budgetData = {
    current: 173750,
    target: 250000,
    spent: 76250,
    remaining: 173750,
    savings: 23750,
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const transactions = [
    {
      id: 1,
      name: 'Green Garden Bistro',
      category: 'Healthy Food',
      amount: -12995,
      date: 'Today',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    },
    {
      id: 2,
      name: 'Spice Kitchen',
      category: 'Indian Cuisine',
      amount: -9250,
      date: 'Yesterday',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    },
    {
      id: 3,
      name: 'Grocery Store',
      category: 'Groceries',
      amount: -33625,
      date: '2 days ago',
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    },
    {
      id: 4,
      name: 'Budget Reward',
      category: 'Savings',
      amount: +7500,
      date: '3 days ago',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg',
    },
  ];

  const budgetMeals = [
    {
      id: 1,
      name: 'Budget Bowl',
      description: 'Rice, beans, vegetables and protein',
      price: 3995,
      originalPrice: 6495,
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
      savings: 2500,
    },
    {
      id: 2,
      name: 'Value Sandwich',
      description: 'Fresh ingredients, great taste',
      price: 2745,
      originalPrice: 4495,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      savings: 1750,
    },
    {
      id: 3,
      name: 'Economy Wrap',
      description: 'Filling and nutritious wrap',
      price: 3495,
      originalPrice: 4995,
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
      savings: 1500,
    },
  ];

  const progressPercentage = (budgetData.spent / budgetData.target) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budget Tracker</Text>
          <Text style={styles.headerSubtitle}>Manage your food spending wisely</Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Food Budget - {selectedPeriod}</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.budgetAmount}>
              <Text style={styles.remainingAmount}>{formatPrice(budgetData.remaining)}</Text>
              <Text style={styles.budgetLabel}>Remaining</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {formatPrice(budgetData.spent)} of {formatPrice(budgetData.target)} spent
              </Text>
            </View>

            <View style={styles.budgetStats}>
              <View style={styles.statItem}>
                <TrendingUp size={16} color="#32CD32" />
                <Text style={styles.statLabel}>Saved</Text>
                <Text style={styles.statValue}>{formatPrice(budgetData.savings)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Target size={16} color="#006400" />
                <Text style={styles.statLabel}>Target</Text>
                <Text style={styles.statValue}>{formatPrice(budgetData.target)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budget Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <DollarSign size={24} color="#006400" />
              <Text style={styles.goalTitle}>Monthly Food Budget</Text>
            </View>
            <View style={styles.goalInput}>
              <Text style={styles.goalCurrency}>₦</Text>
              <TextInput
                style={styles.goalAmount}
                value={budgetGoal}
                onChangeText={setBudgetGoal}
                keyboardType="numeric"
                placeholder="250000"
              />
            </View>
            <TouchableOpacity style={styles.saveGoalButton}>
              <Text style={styles.saveGoalText}>Save Goal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget-Friendly Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget-Friendly Meals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {budgetMeals.map((meal) => (
              <TouchableOpacity key={meal.id} style={styles.mealCard}>
                <Image source={{ uri: meal.image }} style={styles.mealImage} />
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save {formatPrice(meal.savings)}</Text>
                </View>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealDescription}>{meal.description}</Text>
                  <View style={styles.mealPricing}>
                    <Text style={styles.mealPrice}>{formatPrice(meal.price)}</Text>
                    <Text style={styles.mealOriginalPrice}>{formatPrice(meal.originalPrice)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Image source={{ uri: transaction.image }} style={styles.transactionImage} />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{transaction.name}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.amount > 0 ? '+' : ''}{formatPrice(Math.abs(transaction.amount))}
                </Text>
                {transaction.amount > 0 ? (
                  <TrendingUp size={16} color="#32CD32" />
                ) : (
                  <TrendingDown size={16} color="#FF6B6B" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Plus size={24} color="#006400" />
              <Text style={styles.quickActionText}>Add Expense</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Target size={24} color="#FF8F00" />
              <Text style={styles.quickActionText}>Set Goal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <Calendar size={24} color="#3F51B5" />
              <Text style={styles.quickActionText}>Plan Meals</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <TrendingUp size={24} color="#32CD32" />
              <Text style={styles.quickActionText}>View Reports</Text>
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
  periodContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  periodButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  periodButtonActive: {
    backgroundColor: '#006400',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  editButton: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  budgetAmount: {
    alignItems: 'center',
    marginBottom: 20,
  },
  remainingAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  budgetLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  budgetStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 20,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  goalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  goalCurrency: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#006400',
    marginRight: 8,
  },
  goalAmount: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    paddingVertical: 15,
  },
  saveGoalButton: {
    backgroundColor: '#006400',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  mealCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 120,
  },
  savingsBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  mealInfo: {
    padding: 12,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  mealPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#006400',
  },
  mealOriginalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  transactionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  positiveAmount: {
    color: '#32CD32',
  },
  negativeAmount: {
    color: '#FF6B6B',
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