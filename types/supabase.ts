export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            buffet_table: {
                Row: {
                    id: number
                    is_used: boolean
                    max_customer: number
                    table_no: number
                }
                Insert: {
                    id?: number
                    is_used?: boolean
                    max_customer: number
                    table_no: number
                }
                Update: {
                    id?: number
                    is_used?: boolean
                    max_customer?: number
                    table_no?: number
                }
                Relationships: []
            }
            customer: {
                Row: {
                    created_at: string
                    customer_count: number
                    id: number
                    paid: boolean
                    table_id: number | null
                    tier_id: number | null
                }
                Insert: {
                    created_at?: string
                    customer_count?: number
                    id?: number
                    paid?: boolean
                    table_id?: number | null
                    tier_id?: number | null
                }
                Update: {
                    created_at?: string
                    customer_count?: number
                    id?: number
                    paid?: boolean
                    table_id?: number | null
                    tier_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "customer_table_table_id_fkey"
                        columns: ["table_id"]
                        isOneToOne: false
                        referencedRelation: "buffet_table"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "customer_table_tier_id_fkey"
                        columns: ["tier_id"]
                        isOneToOne: false
                        referencedRelation: "tier_list"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
    }
}
