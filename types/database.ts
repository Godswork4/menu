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
  storage: {
    Buckets: {
      [_ in 'food-images']: {
        Row: {
          id: string;
          name: string;
          owner: string | null;
          created_at: string | null;
          updated_at: string | null;
          public: boolean | null;
          avif_autodetection: boolean | null;
          file_size_limit: number | null;
          allowed_mime_types: string[] | null;
          owner_id: string | null;
        };
        Insert: {
          id: string;
          name: string;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          public?: boolean | null;
          avif_autodetection?: boolean | null;
          file_size_limit?: number | null;
          allowed_mime_types?: string[] | null;
          owner_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          public?: boolean | null;
          avif_autodetection?: boolean | null;
          file_size_limit?: number | null;
          allowed_mime_types?: string[] | null;
          owner_id?: string | null;
        };
      };
    };
    Objects: {
      [_ in 'food-images']: {
        Row: {
          name: string;
          bucket_id: string | null;
          owner: string | null;
          created_at: string | null;
          updated_at: string | null;
          last_accessed_at: string | null;
          metadata: Record<string, any> | null;
          id: string;
          version: string | null;
          owner_id: string | null;
        };
        Insert: {
          name: string;
          bucket_id?: string | null;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_accessed_at?: string | null;
          metadata?: Record<string, any> | null;
          id?: string;
          version?: string | null;
          owner_id?: string | null;
        };
        Update: {
          name?: string;
          bucket_id?: string | null;
          owner?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_accessed_at?: string | null;
          metadata?: Record<string, any> | null;
          id?: string;
          version?: string | null;
          owner_id?: string | null;
        };
      };
    };
  };
}