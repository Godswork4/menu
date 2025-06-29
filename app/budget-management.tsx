import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3, Trash2, Target, Calendar, TrendingUp, TrendingDown, DollarSign, ChartPie as PieChart, ChartBar as BarChart3, Filter } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';
import { useAuth } from '@/contexts/AuthContext';
import { fetchBudgetGoals, createBudgetGoal, updateBudgetGoal, deleteBudgetGoal, BudgetGoal } from '@/lib/budget';

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetCategory, setNewBudgetCategory] = useState('food');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBudgets();
    }
  }, [user]);

  const loadBudgets = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await fetchBudgetGoals(user.id);
      
      if (error) throw error;
      
      setBudgets(data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
      Alert.alert('Error', 'Failed to load your budgets. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBudgets();
  };

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
    return `₦${(price / 100).toLocaleString()}`; // Convert from kobo to naira
  };

  const getBudgetProgress = (budget: BudgetGoal) => {
    return Math.min((budget.current_amount / budget.target_amount) * 100, 100);
  };

  const getBudgetStatus = (budget: BudgetGoal) => {
    const progress = getBudgetProgress(budget);
    if (progress >= 90) return { status: 'danger', color: '#FF6B6B' };
    if (progress >= 70) return { status: 'warning', color: '#FFA726' };
    return { status: 'good', color: '#4CAF50' };
  };

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => total + budget.target_amount, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((total, budget) => total + budget.current_amount, 0);
  };

  const getFilteredBudgets = () => {
    if (selectedFilter === 'all') return budgets;
    return budgets.filter(budget => budget.category === selectedFilter);
  };

  const handleCreateBudget = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a budget');
      return;
    }
    
    if (!newBudgetName || !newBudgetAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(newBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate deadline based on period
      const now = new Date();
      const period = periods.find(p => p.id === selectedPeriod);
      const deadline = new Date(now);
      deadline.setDate(now.getDate() + (period?.duration || 30));
      
      const { data, error } = await createBudgetGoal(user.id, {
        name: newBudgetName,
        target_amount: Math.round(amount * 100), // Convert to kobo
        deadline: deadline.toISOString().split('T')[0],
        category: newBudgetCategory,
        is_recurring: false,
      });
      
      if (error) throw error;
      
      setBudgets([...budgets, data]);
      setShowCreateModal(false);
      resetForm();
      
      Alert.alert('Success', 'Budget created successfully!');
    } catch (error) {
      console.error('Error creating budget:', error);
      Alert.alert('Error', 'Failed to create budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await deleteBudgetGoal(budgetId);
              
              if (error) throw error;
              
              setBudgets(budgets.filter(b => b.id !== budgetId));
              Alert.alert('Success', 'Budget deleted successfully');
            } catch (error) {
              console.error('Error deleting budget:', error);
              Alert.alert('Error', 'Failed to delete budget. Please try again.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setNewBudgetName('');
    setNewBudgetAmount('');
    setNewBudgetCategory('food');
    setSelectedPeriod('month');
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <CustomLogo size="medium" color="#FFFFFF" />
            <Text style={styles.headerTitle}>Budget Management</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Loading your budgets...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#006400']}
            tintColor={'#006400'}
          />
        }
      >
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

          {getFilteredBudgets().length === 0 ? (
            <View style={styles.emptyState}>
              <Target size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No Budgets Found</Text>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'all' 
                  ? 'Create your first budget to start tracking your spending'
                  : `No budgets found for the selected category. Try a different filter or create a new budget.`}
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </View>
          ) : (
            getFilteredBudgets().map((budget) => {
              const progress = getBudgetProgress(budget);
              const status = getBudgetStatus(budget);
              const category = categories.find(c => c.id === budget.category);

              return (
                <View key={budget.id} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <View style={styles.budgetInfo}>
                      <View style={styles.budgetTitleRow}>
                        <Text style={styles.budgetIcon}>{category?.icon || '💰'}</Text>
                        <Text style={styles.budgetName}>{budget.name}</Text>
                      </View>
                      <Text style={styles.budgetPeriod}>
                        {new Date(budget.deadline).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
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
                      {formatPrice(budget.current_amount)} of {formatPrice(budget.target_amount)} ({progress.toFixed(1)}%)
                    </Text>
                  </View>

                  <View style={styles.budgetFooter}>
                    <Text style={styles.remainingAmount}>
                      Remaining: {formatPrice(budget.target_amount - budget.current_amount)}
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
            })
          )}
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
                  editable={!isSubmitting}
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
                  editable={!isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, isSubmitting && styles.createButtonDisabled]}
                onPress={handleCreateBudget}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Create Budget</Text>
                )}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666666',
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
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
  },
});