export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_info: {
        Row: {
          address: string | null
          content: string
          facebook: string | null
          hours: string | null
          id: string
          image: string | null
          instagram: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          content: string
          facebook?: string | null
          hours?: string | null
          id?: string
          image?: string | null
          instagram?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          content?: string
          facebook?: string | null
          hours?: string | null
          id?: string
          image?: string | null
          instagram?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      app_info: {
        Row: {
          description: string | null
          features: string | null
          history: string | null
          id: string
          mission: string | null
          title: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          description?: string | null
          features?: string | null
          history?: string | null
          id?: string
          mission?: string | null
          title: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          description?: string | null
          features?: string | null
          history?: string | null
          id?: string
          mission?: string | null
          title?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          admin_email: string | null
          admin_password: string
          admin_phone: string | null
          app_icon: string | null
          app_name: string
          background_color: string
          created_at: string
          id: string
          notifications: boolean
          primary_color: string
          two_factor_enabled: boolean
          updated_at: string
        }
        Insert: {
          admin_email?: string | null
          admin_password?: string
          admin_phone?: string | null
          app_icon?: string | null
          app_name?: string
          background_color?: string
          created_at?: string
          id?: string
          notifications?: boolean
          primary_color?: string
          two_factor_enabled?: boolean
          updated_at?: string
        }
        Update: {
          admin_email?: string | null
          admin_password?: string
          admin_phone?: string | null
          app_icon?: string | null
          app_name?: string
          background_color?: string
          created_at?: string
          id?: string
          notifications?: boolean
          primary_color?: string
          two_factor_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      gold_items: {
        Row: {
          allow_booking: boolean
          category: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_favorite: boolean
          price_ils: number
          price_jod: number
          price_usd: number
          reserved: boolean
          title: string
          updated_at: string
        }
        Insert: {
          allow_booking?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_favorite?: boolean
          price_ils?: number
          price_jod?: number
          price_usd?: number
          reserved?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          allow_booking?: boolean
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_favorite?: boolean
          price_ils?: number
          price_jod?: number
          price_usd?: number
          reserved?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_deliveries: {
        Row: {
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          notification_id: string
          push_token_id: string
          status: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id: string
          push_token_id: string
          status?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          notification_id?: string
          push_token_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_deliveries_push_token_id_fkey"
            columns: ["push_token_id"]
            isOneToOne: false
            referencedRelation: "push_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          data: Json | null
          id: string
          message: string
          sent_at: string
          sent_count: number
          success_count: number
          title: string
          type: string
        }
        Insert: {
          data?: Json | null
          id?: string
          message: string
          sent_at?: string
          sent_count?: number
          success_count?: number
          title: string
          type?: string
        }
        Update: {
          data?: Json | null
          id?: string
          message?: string
          sent_at?: string
          sent_count?: number
          success_count?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          active: boolean
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_identifier: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          platform: string
          token: string
          updated_at?: string
          user_identifier: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_identifier?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          customer_name: string
          email: string | null
          id: string
          item_id: string | null
          notes: string | null
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "gold_items"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          approved: boolean
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          item_id: string | null
          rating: number
        }
        Insert: {
          approved?: boolean
          comment?: string | null
          created_at?: string
          customer_name: string
          id?: string
          item_id?: string | null
          rating: number
        }
        Update: {
          approved?: boolean
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          item_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "gold_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
