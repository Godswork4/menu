export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'customer' | 'delivery' | 'vendor';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          total_orders: number;
          points: number;
          rating: number;
          member_since: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'delivery' | 'vendor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          total_orders?: number;
          points?: number;
          rating?: number;
          member_since?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'customer' | 'delivery' | 'vendor';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          total_orders?: number;
          points?: number;
          rating?: number;
          member_since?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          restaurant_name: string;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          restaurant_name: string;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          restaurant_name?: string;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          food_item_id: string;
          food_name: string;
          restaurant_name: string;
          price: number;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_item_id: string;
          food_name: string;
          restaurant_name: string;
          price: number;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_item_id?: string;
          food_name?: string;
          restaurant_name?: string;
          price?: number;
          image_url?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'customer' | 'delivery' | 'vendor';
      order_status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
    };
  };
}