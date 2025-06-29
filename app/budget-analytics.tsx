import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChartBar as BarChart3, ChartPie as PieChart, Calendar, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

export default function BudgetAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📊' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  // Mock data for analytics
  const analyticsData = {
    totalSpent: 78500,
    budgetTotal: 120000,
    savingsTotal: 41500,
    percentUsed: 65.4,
    topCategories: [
      { name: 'Restaurants', amount: 42500, percentage: 54.1 },
      { name: 'Street Food', amount: 18750, percentage: 23.9 },
      { name: 'Groceries', amount: 12250, percentage: 15.6 },
      { name: 'Drinks', amount: 5000, percentage: 6.4 },
    ],
    monthlyTrend: [
      { month: 'Jan', amount: 65000 },
      { month: 'Feb', amount: 72000 },
      { month: 'Mar', amount: 68000 },
      { month: 'Apr', amount: 78500 },
    ],
    topExpenses: [
      { name: 'Jollof Rice Special', restaurant: 'Lagos Kitchen', amount: 4500, date: 'Apr 20' },
      { name: 'Suya Platter', restaurant: 'Suya Spot', amount: 6500, date: 'Apr 18' },
      { name: 'Grilled Chicken', restaurant: 'Spice Garden', amount: 6500, date: 'Apr 15' },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <CustomLogo size="medium" color="#FFFFFF" />
          <Text style={styles.headerTitle}>Budget Analytics</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodOption,
                selectedPeriod === period.id && styles.periodOptionActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.id && styles.periodTextActive
              ]}>
                {period.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Total Spent</Text>
              <TrendingUp size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.overviewAmount}>{formatPrice(analyticsData.totalSpent)}</Text>
            <Text style={styles.overviewSubtext}>
              {analyticsData.percentUsed}% of budget used
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${analyticsData.percentUsed}%` }
                ]} 
              />
            </View>
          </View>

          <View style={styles.overviewRow}>
            <View style={styles.overviewCardSmall}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Budget</Text>
                <DollarSign size={20} color="#4CAF50" />
              </View>
              <Text style={styles.overviewAmount}>{formatPrice(analyticsData.budgetTotal)}</Text>
            </View>
            <View style={styles.overviewCardSmall}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>Savings</Text>
                <TrendingDown size={20} color="#4CAF50" />
              </View>
              <Text style={styles.overviewAmount}>{formatPrice(analyticsData.savingsTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <Text style={styles.sectionTitle}>Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spending by Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <PieChart size={20} color="#006400" />
          </View>
          
          <View style={styles.categoryBreakdown}>
            {analyticsData.topCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryBar}>
                  <View 
                    style={[
                      styles.categoryFill, 
                      { 
                        width: `${category.percentage}%`,
                        backgroundColor: index === 0 ? '#FF6B6B' : 
                                        index === 1 ? '#4ECDC4' : 
                                        index === 2 ? '#FFD700' : '#3F51B5'
                      }
                    ]} 
                  />
                </View>
                <View style={styles.categoryDetails}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>{formatPrice(category.amount)}</Text>
                  <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Trend</Text>
            <BarChart3 size={20} color="#006400" />
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.barChart}>
              {analyticsData.monthlyTrend.map((month, index) => {
                const maxAmount = Math.max(...analyticsData.monthlyTrend.map(m => m.amount));
                const heightPercentage = (month.amount / maxAmount) * 100;
                
                return (
                  <View key={index} style={styles.barColumn}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${heightPercentage}%`,
                          backgroundColor: index === analyticsData.monthlyTrend.length - 1 ? 
                            '#FF6B6B' : '#4CAF50'
                        }
                      ]} 
                    />
                    <Text style={styles.barLabel}>{month.month}</Text>
                    <Text style={styles.barValue}>
                      {formatPrice(month.amount).replace('₦', '')}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Top Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Expenses</Text>
            <TouchableOpacity onPress={() => router.push('/expense-history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {analyticsData.topExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseRestaurant}>{expense.restaurant}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatPrice(expense.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Budget Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Save on Weekday Lunches</Text>
              <Text style={styles.tipText}>
                Order from restaurants offering lunch specials or meal prep on weekends to save up to 30% on weekday lunches.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🔍</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Track Recurring Expenses</Text>
              <Text style={styles.tipText}>
                Identify patterns in your food spending to better allocate your monthly budget.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  periodOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodOptionActive: {
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
  overviewSection: {
    marginBottom: 25,
    gap: 15,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 15,
  },
  overviewCardSmall: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  overviewTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  overviewAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  overviewSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  categoryFilter: {
    marginBottom: 25,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  categoryBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 15,
  },
  categoryItem: {
    gap: 8,
  },
  categoryBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginRight: 15,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    width: 50,
    textAlign: 'right',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  barChart: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    width: 60,
  },
  bar: {
    width: 30,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 4,
  },
  expenseRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
    alignSelf: 'center',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#333333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 20,
  },
});