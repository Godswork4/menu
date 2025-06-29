import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Edit3, Trash2, Target, Calendar, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Filter } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';

interface Budget {
  id: number;
  name: string;
  amount: number;
  period: 'week' | 'month' | 'year';
  category: string;
  spent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Expense {
  id: number;
  budgetId: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  restaurant?: string;
}

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      name: 'Monthly Food Budget',
      amount: 50000,
      period: 'month',
      category: 'food',
      spent: 32500,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isActive: true,
    },
    {
      id: 2,
      name: 'Weekly Drinks',
      amount: 8000,
      period: 'week',
      category: 'drinks',
      spent: 5200,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      isActive: true,
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      budgetId: 1,
      amount: 4500,
      description: 'Jollof Rice Special',
      category: 'food',
      date: '2024-01-20',
      restaurant: 'Lagos Kitchen',
    },
    {
      id: 2,
      budgetId: 1,
      amount: 6500,
      description: 'Grilled Chicken',
      category: 'food',
      date: '2024-01-19',
      restaurant: 'Spice Garden',
    },
    {
      id: 3,
      budgetId: 2,
      amount: 1200,
      description: 'Fresh Orange Juice',
      category: 'drinks',
      date: '2024-01-18',
      restaurant: 'Juice Bar',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetCategory, setNewBudgetCategory] = useState('food');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { user, profile } = useAuth();

  const categories = [
    { id: 'food', name: 'Food', icon: '🍽️', color: '#FF6B6B' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', color: '#4ECDC4' },
    { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#45B7D1' },
    { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#FFA726' },
    { id: 'dining', name: 'Dining Out', icon: '🍴', color: '#AB47BC' },
  ];

  const periods = [
    { id: 'week', name: 'Weekly', duration: 7 },
    { id: 'month', name: 'Monthly', duration: 30 },
    { id: 'year', name: 'Yearly', duration: 365 },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getBudgetProgress = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getBudgetStatus = (budget: Budget) => {
    const progress = getBudgetProgress(budget);
    if (progress >= 90) return { status: 'danger', color: '#FF6B6B' };
    if (progress >= 70) return { status: 'warning', color: '#FFA726' };
    return { status: 'good', color: '#4CAF50' };
  };

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((total, budget) => total + budget.spent, 0);
  };

  const getFilteredBudgets = () => {
    if (selectedFilter === 'all') return budgets;
    return budgets.filter(budget => budget.category === selectedFilter);
  };

  const handleCreateBudget = () => {
    if (!newBudgetName || !newBudgetAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(newBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newBudget: Budget = {
      id: Date.now(),
      name: newBudgetName,
      amount: amount,
      period: selectedPeriod,
      category: newBudgetCategory,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + periods.find(p => p.id === selectedPeriod)!.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    };

    setBudgets([...budgets, newBudget]);
    setShowCreateModal(false);
    setNewBudgetName('');
    setNewBudgetAmount('');
    setNewBudgetCategory('food');
    setSelectedPeriod('month');
  };

  const handleDeleteBudget = (budgetId: number) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBudgets(budgets.filter(b => b.id !== budgetId));
            setExpenses(expenses.filter(e => e.budgetId !== budgetId));
          },
        },
      ]
    );
  };

  const getRecentExpenses = () => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
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
          <Text style={styles.headerTitle}>Budget Management</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Target size={24} color="#4CAF50" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Total Budget</Text>
              <Text style={styles.overviewAmount}>{formatPrice(getTotalBudget())}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <TrendingUp size={24} color="#FF6B6B" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Total Spent</Text>
              <Text style={styles.overviewAmount}>{formatPrice(getTotalSpent())}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <DollarSign size={24} color="#FFA726" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Remaining</Text>
              <Text style={styles.overviewAmount}>{formatPrice(getTotalBudget() - getTotalSpent())}</Text>
            </View>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === 'all' && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedFilter === category.id && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(category.id)}
              >
                <Text style={styles.filterChipIcon}>{category.icon}</Text>
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === category.id && styles.filterChipTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Budget List */}
        <View style={styles.budgetSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Budgets</Text>
            <TouchableOpacity onPress={() => router.push('/budget-analytics')}>
              <BarChart3 size={20} color="#006400" />
            </TouchableOpacity>
          </View>

          {getFilteredBudgets().map((budget) => {
            const progress = getBudgetProgress(budget);
            const status = getBudgetStatus(budget);
            const category = categories.find(c => c.id === budget.category);

            return (
              <View key={budget.id} style={styles.budgetCard}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetInfo}>
                    <View style={styles.budgetTitleRow}>
                      <Text style={styles.budgetIcon}>{category?.icon}</Text>
                      <Text style={styles.budgetName}>{budget.name}</Text>
                    </View>
                    <Text style={styles.budgetPeriod}>
                      {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                    </Text>
                  </View>
                  <View style={styles.budgetActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Edit3 size={16} color="#666666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteBudget(budget.id)}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.budgetProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${progress}%`, backgroundColor: status.color }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {formatPrice(budget.spent)} of {formatPrice(budget.amount)} ({progress.toFixed(1)}%)
                  </Text>
                </View>

                <View style={styles.budgetFooter}>
                  <Text style={styles.remainingAmount}>
                    Remaining: {formatPrice(budget.amount - budget.spent)}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.status === 'danger' ? 'Over Budget' : 
                       status.status === 'warning' ? 'Near Limit' : 'On Track'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Expenses */}
        <View style={styles.expensesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity onPress={() => router.push('/expense-history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {getRecentExpenses().map((expense) => {
            const budget = budgets.find(b => b.id === expense.budgetId);
            const category = categories.find(c => c.id === expense.category);

            return (
              <View key={expense.id} style={styles.expenseCard}>
                <View style={styles.expenseIcon}>
                  <Text style={styles.expenseIconText}>{category?.icon}</Text>
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseRestaurant}>{expense.restaurant}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
                <View style={styles.expenseAmount}>
                  <Text style={styles.expensePrice}>-{formatPrice(expense.amount)}</Text>
                  <Text style={styles.expenseBudget}>{budget?.name}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/budget-analytics')}
            >
              <PieChart size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>View Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/expense-history')}
            >
              <BarChart3 size={24} color="#FF6B6B" />
              <Text style={styles.quickActionText}>Expense History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/budget-goals')}
            >
              <Target size={24} color="#FFA726" />
              <Text style={styles.quickActionText}>Set Goals</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={24} color="#3F51B5" />
              <Text style={styles.quickActionText}>Add Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Create Budget Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Budget</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Budget Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Monthly Food Budget"
                  value={newBudgetName}
                  onChangeText={setNewBudgetName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount (₦)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="50000"
                  value={newBudgetAmount}
                  onChangeText={setNewBudgetAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Period</Text>
                <View style={styles.periodSelector}>
                  {periods.map((period) => (
                    <TouchableOpacity
                      key={period.id}
                      style={[
                        styles.periodOption,
                        selectedPeriod === period.id && styles.periodOptionActive
                      ]}
                      onPress={() => setSelectedPeriod(period.id as any)}
                    >
                      <Text style={[
                        styles.periodOptionText,
                        selectedPeriod === period.id && styles.periodOptionTextActive
                      ]}>
                        {period.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        newBudgetCategory === category.id && styles.categoryOptionActive
                      ]}
                      onPress={() => setNewBudgetCategory(category.id)}
                    >
                      <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryOptionText,
                        newBudgetCategory === category.id && styles.categoryOptionTextActive
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateBudget}
              >
                <Text style={styles.createButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overviewIcon: {
    marginRight: 12,
  },
  overviewInfo: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 12,
  },
  filterChip: {
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
  filterChipActive: {
    backgroundColor: '#006400',
    borderColor: '#006400',
  },
  filterChipIcon: {
    fontSize: 14,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  budgetSection: {
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
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#006400',
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  budgetIcon: {
    fontSize: 20,
  },
  budgetName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  budgetPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  budgetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  budgetProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-Semibold',
  },
  expensesSection: {
    marginBottom: 25,
  },
  expenseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 18,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 2,
  },
  expenseRestaurant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  expenseAmount: {
    alignItems: 'flex-end',
  },
  expensePrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
    marginBottom: 2,
  },
  expenseBudget: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
  },
  modalClose: {
    fontSize: 20,
    color: '#666666',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  periodOptionActive: {
    backgroundColor: '#006400',
  },
  periodOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  periodOptionTextActive: {
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryOptionActive: {
    backgroundColor: '#006400',
  },
  categoryOptionIcon: {
    fontSize: 16,
  },
  categoryOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#006400',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});