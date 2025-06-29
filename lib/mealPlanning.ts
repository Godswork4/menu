import { supabase } from './supabase';

export interface MealPlan {
  id: string;
  date: string;
  meal_type: string;
  food_name: string;
  restaurant: string;
  price: number;
  image_url: string | null;
  scheduled_time: string;
  is_ordered: boolean;
  is_recurring: boolean;
  notes?: string;
}

export interface ScheduledOrder {
  id: string;
  meal_plan_id: string;
  order_date: string;
  order_time: string;
  status: 'scheduled' | 'processing' | 'delivered' | 'cancelled';
  reminder_set: boolean;
}

// Meal Plans
export const fetchMealPlans = async (
  userId: string,
  filters?: {
    date?: string;
    mealType?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  try {
    let query = supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId);
    
    if (filters?.date) {
      query = query.eq('date', filters.date);
    }
    
    if (filters?.mealType) {
      query = query.eq('meal_type', filters.mealType);
    }
    
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return { data: null, error };
  }
};

export const createMealPlan = async (
  userId: string,
  mealPlan: Omit<MealPlan, 'id'>
) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: userId,
        date: mealPlan.date,
        meal_type: mealPlan.meal_type,
        food_name: mealPlan.food_name,
        restaurant: mealPlan.restaurant,
        price: mealPlan.price,
        image_url: mealPlan.image_url,
        scheduled_time: mealPlan.scheduled_time,
        is_ordered: mealPlan.is_ordered,
        is_recurring: mealPlan.is_recurring,
        notes: mealPlan.notes,
      })
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return { data: null, error };
  }
};

export const updateMealPlan = async (
  mealPlanId: string,
  updates: Partial<MealPlan>
) => {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates)
      .eq('id', mealPlanId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating meal plan:', error);
    return { data: null, error };
  }
};

export const deleteMealPlan = async (mealPlanId: string) => {
  try {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', mealPlanId);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return { error };
  }
};

// Helper function to create recurring meal plans
export const createRecurringMealPlans = async (
  userId: string,
  baseMealPlan: Omit<MealPlan, 'id'>,
  recurrencePattern: {
    frequency: 'daily' | 'weekly';
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
    numberOfOccurrences: number;
  }
) => {
  try {
    const mealPlans = [];
    const baseDate = new Date(baseMealPlan.date);
    
    for (let i = 0; i < recurrencePattern.numberOfOccurrences; i++) {
      let nextDate = new Date(baseDate);
      
      if (recurrencePattern.frequency === 'daily') {
        nextDate.setDate(baseDate.getDate() + i);
      } else if (recurrencePattern.frequency === 'weekly') {
        nextDate.setDate(baseDate.getDate() + (i * 7));
      }
      
      // Skip days not in daysOfWeek if specified
      if (recurrencePattern.daysOfWeek && recurrencePattern.daysOfWeek.length > 0) {
        const dayOfWeek = nextDate.getDay();
        if (!recurrencePattern.daysOfWeek.includes(dayOfWeek)) {
          continue;
        }
      }
      
      mealPlans.push({
        user_id: userId,
        date: nextDate.toISOString().split('T')[0],
        meal_type: baseMealPlan.meal_type,
        food_name: baseMealPlan.food_name,
        restaurant: baseMealPlan.restaurant,
        price: baseMealPlan.price,
        image_url: baseMealPlan.image_url,
        scheduled_time: baseMealPlan.scheduled_time,
        is_ordered: false,
        is_recurring: true,
        notes: baseMealPlan.notes,
      });
    }
    
    if (mealPlans.length === 0) {
      return { data: null, error: new Error('No valid recurring dates found') };
    }
    
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlans)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating recurring meal plans:', error);
    return { data: null, error };
  }
};

// Get meal plans for the current week
export const getWeekMealPlans = async (userId: string) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    
    const startDateStr = startOfWeek.toISOString().split('T')[0];
    const endDateStr = endOfWeek.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    // Group by date and meal type
    const groupedByDate = data.reduce((acc, meal) => {
      if (!acc[meal.date]) {
        acc[meal.date] = {};
      }
      
      if (!acc[meal.date][meal.meal_type]) {
        acc[meal.date][meal.meal_type] = [];
      }
      
      acc[meal.date][meal.meal_type].push(meal);
      return acc;
    }, {} as Record<string, Record<string, MealPlan[]>>);
    
    return { data: groupedByDate, error: null };
  } catch (error) {
    console.error('Error getting week meal plans:', error);
    return { data: null, error };
  }
};