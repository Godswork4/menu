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
          business_name?: string | null;
          business_type?: string | null;
          address?: string | null;
          operating_hours?: string | null;
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
          business_name?: string | null;
          business_type?: string | null;
          address?: string | null;
          operating_hours?: string | null;
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
          business_name?: string | null;
          business_type?: string | null;
          address?: string | null;
          operating_hours?: string | null;
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
      food_items: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image_url: string | null;
          prep_time: string | null;
          ingredients: string | null;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description?: string | null;
          price: number;
          category?: string;
          image_url?: string | null;
          prep_time?: string | null;
          ingredients?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          image_url?: string | null;
          prep_time?: string | null;
          ingredients?: string | null;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
      vendor_orders: {
        Row: {
          id: string;
          vendor_id: string;
          customer_id: string;
          food_items: any;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address: string | null;
          customer_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          customer_id: string;
          food_items: any;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address?: string | null;
          customer_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string;
          customer_id?: string;
          food_items?: any;
          total_amount?: number;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
          delivery_address?: string | null;
          customer_phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
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
      food_item_status: 'active' | 'inactive';
      vendor_order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    };
  };
}