import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp, TrendingDown, DollarSign, Edit3, Trash2, Check } from 'lucide-react-native';
import CustomLogo from '@/components/CustomLogo';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
}

export default function BudgetGoals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Save for Dinner Party',
      targetAmount: 50000,
      currentAmount: 35000,
      deadline: '2024-05-15',
      category: 'food',
      isCompleted: false,
    },
    {
      id: 2,
      name: 'Reduce Weekly Takeout',
      targetAmount: 10000,
      currentAmount: 8500,
      deadline: '2024-04-30',
      category: 'savings',
      isCompleted: false,
    },
    {
      id: 3,
      name: 'Monthly Grocery Budget',
      targetAmount: 80000,
      currentAmount: 80000,
      deadline: '2024-03-31',
      category: 'groceries',
      isCompleted: true,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('food');

  const categories = [
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'groceries', name: 'Groceries', icon: '🛒' },
    { id: 'savings', name: 'Savings', icon: '💰' },
    { id: 'dining', name: 'Dining Out', icon: '🍴' },
  ];

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getGoalStatus = (goal: Goal) => {
    if (goal.isCompleted) return { status: 'completed', color: '#4CAF50' };
    
    const progress = getGoalProgress(goal);
    if (progress >= 90) return { status: 'almost', color: '#4CAF50' };
    if (progress >= 50) return { status: 'progress', color: '#FFA726' };
    return { status: 'started', color: '#FF6B6B' };
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalAmount || !newGoalDeadline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(newGoalAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newGoal: Goal = {
      id: Date.now(),
      name: newGoalName,
      targetAmount: amount,
      currentAmount: 0,
      deadline: newGoalDeadline,
      category: newGoalCategory,
      isCompleted: false,
    };

    setGoals([...goals, newGoal]);
    resetForm();
    setShowAddModal(false);
  };

  const handleDeleteGoal = (id: number) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGoals(goals.filter(goal => goal.id !== id));
          },
        },
      ]
    );
  };

  const handleMarkCompleted = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, isCompleted: true, currentAmount: goal.targetAmount } 
        : goal
    ));
  };

  const resetForm = () => {
    setNewGoalName('');
    setNewGoalAmount('');
    setNewGoalDeadline('');
    setNewGoalCategory('food');
  };

  const getActiveGoals = () => {
    return goals.filter(goal => !goal.isCompleted);
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.isCompleted);
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
          <Text style={styles.headerTitle}>Budget Goals</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Target size={24} color="#4CAF50" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Active Goals</Text>
              <Text style={styles.overviewAmount}>{getActiveGoals().length}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <Check size={24} color="#FFA726" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Completed</Text>
              <Text style={styles.overviewAmount}>{getCompletedGoals().length}</Text>
            </View>
          </View>

          <View style={styles.overviewCard}>
            <View style={styles.overviewIcon}>
              <DollarSign size={24} color="#FF6B6B" />
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewLabel}>Total Saved</Text>
              <Text style={styles.overviewAmount}>
                {formatPrice(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          
          {getActiveGoals().length === 0 ? (
            <View style={styles.emptyState}>
              <Target size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateTitle}>No Active Goals</Text>
              <Text style={styles.emptyStateText}>
                Set budget goals to track your progress and save money
              </Text>
              <TouchableOpacity 
                style={styles.addGoalButton}
                onPress={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addGoalText}>Add New Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            getActiveGoals().map((goal) => {
              const progress = getGoalProgress(goal);
              const status = getGoalStatus(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const category = categories.find(c => c.id === goal.category);

              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <Text style={styles.goalIcon}>{category?.icon}</Text>
                      <Text style={styles.goalName}>{goal.name}</Text>
                    </View>
                    <View style={styles.goalActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit3 size={16} color="#666666" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 size={16} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.goalAmounts}>
                    <Text style={styles.currentAmount}>{formatPrice(goal.currentAmount)}</Text>
                    <Text style={styles.targetAmount}>of {formatPrice(goal.targetAmount)}</Text>
                  </View>

                  <View style={styles.goalProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${progress}%`, backgroundColor: status.color }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{progress.toFixed(1)}% Complete</Text>
                  </View>

                  <View style={styles.goalFooter}>
                    <View style={styles.deadlineInfo}>
                      <Calendar size={14} color="#666666" />
                      <Text style={styles.deadlineText}>
                        {daysRemaining > 0 
                          ? `${daysRemaining} days left (${formatDate(goal.deadline)})` 
                          : `Deadline: ${formatDate(goal.deadline)}`}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={() => handleMarkCompleted(goal.id)}
                    >
                      <Check size={14} color="#FFFFFF" />
                      <Text style={styles.completeButtonText}>Mark Complete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Completed Goals */}
        {getCompletedGoals().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Goals</Text>
            
            {getCompletedGoals().map((goal) => {
              const category = categories.find(c => c.id === goal.category);

              return (
                <View key={goal.id} style={[styles.goalCard, styles.completedGoalCard]}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <Text style={styles.goalIcon}>{category?.icon}</Text>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <View style={styles.completedBadge}>
                        <Check size={12} color="#FFFFFF" />
                        <Text style={styles.completedText}>Completed</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.goalAmounts}>
                    <Text style={styles.currentAmount}>{formatPrice(goal.targetAmount)}</Text>
                    <Text style={styles.completedDate}>
                      Completed on {formatDate(new Date().toISOString().split('T')[0])}
                    </Text>
                  </View>

                  <View style={styles.goalProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: '100%', backgroundColor: '#4CAF50' }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>100% Complete</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Goal Setting Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>🎯</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Set SMART Goals</Text>
              <Text style={styles.tipText}>
                Make your goals Specific, Measurable, Achievable, Relevant, and Time-bound for better success.
              </Text>
            </View>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>📊</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Track Progress Regularly</Text>
              <Text style={styles.tipText}>
                Update your progress weekly to stay motivated and make adjustments as needed.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Goal Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Save for Dinner Party"
                  value={newGoalName}
                  onChangeText={setNewGoalName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Amount (₦)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="50000"
                  value={newGoalAmount}
                  onChangeText={setNewGoalAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Deadline</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD"
                  value={newGoalDeadline}
                  onChangeText={setNewGoalDeadline}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        newGoalCategory === category.id && styles.categoryOptionActive
                      ]}
                      onPress={() => setNewGoalCategory(category.id)}
                    >
                      <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                      <Text style={[
                        styles.categoryOptionText,
                        newGoalCategory === category.id && styles.categoryOptionTextActive
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
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleAddGoal}
              >
                <Text style={styles.createButtonText}>Create Goal</Text>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    marginBottom: 15,
  },
  goalCard: {
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
  completedGoalCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  goalIcon: {
    fontSize: 20,
  },
  goalName: {
    fontSize: 16,
    fontFamily: 'Inter-Semibold',
    color: '#000000',
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 10,
    fontFamily: 'Inter-Semibold',
    color: '#4CAF50',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  goalAmounts: {
    marginBottom: 15,
  },
  currentAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  targetAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  completedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  goalProgress: {
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
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  completeButtonText: {
    fontSize: 12,
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
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  addGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-Semibold',
    color: '#FFFFFF',
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