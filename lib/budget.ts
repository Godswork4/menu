import { supabase } from './supabase';

export interface BudgetGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  category: string;
  is_completed: boolean;
  is_recurring: boolean;
}

export interface BudgetTransaction {
  id: string;
  budget_id?: string;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  restaurant?: string;
}

// Budget Goals
export const fetchBudgetGoals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('budget_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching budget goals:', error);
    return { data: null, error };
  }
};

export const createBudgetGoal = async (
  userId: string,
  goal: Omit<BudgetGoal, 'id' | 'current_amount' | 'is_completed'>
) => {
  try {
    const { data, error } = await supabase
      .from('budget_goals')
      .insert({
        user_id: userId,
        name: goal.name,
        target_amount: goal.target_amount,
        current_amount: 0,
        deadline: goal.deadline,
        category: goal.category,
        is_completed: false,
        is_recurring: goal.is_recurring,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating budget goal:', error);
    return { data: null, error };
  }
};

export const updateBudgetGoal = async (
  goalId: string,
  updates: Partial<BudgetGoal>
) => {
  try {
    const { data, error } = await supabase
      .from('budget_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating budget goal:', error);
    return { data: null, error };
  }
};

export const deleteBudgetGoal = async (goalId: string) => {
  try {
    const { error } = await supabase
      .from('budget_goals')
      .delete()
      .eq('id', goalId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting budget goal:', error);
    return { error };
  }
};

// Budget Transactions
export const fetchBudgetTransactions = async (
  userId: string,
  filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
    budgetId?: string;
  }
) => {
  try {
    let query = supabase
      .from('budget_transactions')
      .select('*')
      .eq('user_id', userId);
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.budgetId) {
      query = query.eq('budget_id', filters.budgetId);
    }
    
    if (filters?.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    
    const { data, error } = await query.order('transaction_date', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching budget transactions:', error);
    return { data: null, error };
  }
};

export const createBudgetTransaction = async (
  userId: string,
  transaction: Omit<BudgetTransaction, 'id'>
) => {
  try {
    const { data, error } = await supabase
      .from('budget_transactions')
      .insert({
        user_id: userId,
        budget_id: transaction.budget_id,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        transaction_date: transaction.transaction_date,
        restaurant: transaction.restaurant,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // If this transaction is associated with a budget goal, update the goal's current amount
    if (transaction.budget_id) {
      await updateBudgetGoalAmount(transaction.budget_id, transaction.amount);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating budget transaction:', error);
    return { data: null, error };
  }
};

export const deleteBudgetTransaction = async (
  transactionId: string,
  budgetId?: string,
  amount?: number
) => {
  try {
    const { error } = await supabase
      .from('budget_transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
    
    // If this transaction was associated with a budget goal, update the goal's current amount
    if (budgetId && amount) {
      await updateBudgetGoalAmount(budgetId, -amount); // Reverse the amount
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting budget transaction:', error);
    return { error };
  }
};

// Helper function to update a budget goal's current amount
const updateBudgetGoalAmount = async (goalId: string, amount: number) => {
  try {
    // First get the current amount
    const { data: goal, error: fetchError } = await supabase
      .from('budget_goals')
      .select('current_amount, target_amount')
      .eq('id', goalId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newAmount = goal.current_amount + amount;
    const isCompleted = newAmount >= goal.target_amount;
    
    // Update the goal
    const { error: updateError } = await supabase
      .from('budget_goals')
      .update({
        current_amount: newAmount,
        is_completed: isCompleted,
      })
      .eq('id', goalId);
    
    if (updateError) throw updateError;
    
    return { error: null };
  } catch (error) {
    console.error('Error updating budget goal amount:', error);
    return { error };
  }
};

// Budget Analytics
export const getBudgetSummary = async (
  userId: string,
  period: 'week' | 'month' | 'year'
) => {
  try {
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = now.toISOString().split('T')[0];
    
    // Get all transactions in the period
    const { data: transactions, error } = await supabase
      .from('budget_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('transaction_date', startDateStr)
      .lte('transaction_date', endDateStr);
    
    if (error) throw error;
    
    // Calculate totals
    const totalSpent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalSaved = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Group by category
    const categorySummary = transactions
      .filter(t => t.amount < 0) // Only include expenses
      .reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    
    // Convert to array and sort by amount
    const categories = Object.entries(categorySummary)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
    
    // Get active goals
    const { data: goals } = await supabase
      .from('budget_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', false);
    
    const totalBudget = goals?.reduce((sum, g) => sum + g.target_amount, 0) || 0;
    
    return {
      data: {
        totalSpent,
        totalSaved,
        totalBudget,
        remaining: totalBudget - totalSpent,
        categories,
        period,
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting budget summary:', error);
    return { data: null, error };
  }
};