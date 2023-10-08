export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      invites: {
        Row: {
          created_id: string;
          email: string;
          poll_id: string;
          pollId: string | null;
        };
        Insert: {
          created_id?: string;
          email?: string;
          poll_id: string;
          pollId?: string | null;
        };
        Update: {
          created_id?: string;
          email?: string;
          poll_id?: string;
          pollId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_9d3e1bf2dce68d6015749fd8495';
            columns: ['pollId', 'pollId'];
            referencedRelation: 'polls';
            referencedColumns: ['id', 'owner_id'];
          },
        ];
      };
      polls: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          ownerId: string;
          private: boolean;
          question: string;
          status: Database['public']['Enums']['polls_status_enum'];
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          owner_id: string;
          ownerId: string;
          private: boolean;
          question: string;
          status?: Database['public']['Enums']['polls_status_enum'];
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          ownerId?: string;
          private?: boolean;
          question?: string;
          status?: Database['public']['Enums']['polls_status_enum'];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_4cd53114af06586534d5dd2b29e';
            columns: ['ownerId'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string;
          created_at: string;
          email: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string;
          created_at?: string;
          email?: string;
          id: string;
          name?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          answer: boolean;
          id: string;
          poll_id: string;
          pollId: string | null;
          user_id: string;
        };
        Insert: {
          answer: boolean;
          id: string;
          poll_id: string;
          pollId?: string | null;
          user_id: string;
        };
        Update: {
          answer?: boolean;
          id?: string;
          poll_id?: string;
          pollId?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'FK_aab8eca9f1091999360a6bb7979';
            columns: ['pollId', 'pollId'];
            referencedRelation: 'polls';
            referencedColumns: ['id', 'owner_id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      polls_status_enum: 'open' | 'closed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
