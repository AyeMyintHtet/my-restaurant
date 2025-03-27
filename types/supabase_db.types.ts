

export interface buffetTable{
    id: number;
    table_no: number;
    max_customer: string;
    is_used: boolean;
}
export interface customerTable {
    id: number;
    created_at: Date;
    table_id: number;
    tier_id: number;
    customer_count: number;
    
}
export interface menuCategoryTable {
    id: number;
    name: string
}

export interface menuItemTable {
    id: number;
    name: string;
    tier_id: number;
    category_id: number;
    image: string;
    available_amt: number;
    created_at: string;
}
export interface otherInfoTable{
    id:number;
    name: string;
    value:string;
}
export interface tierListTable{
    id: number;
    name : string;
    amount: number;
}

export type IDatabases = 'buffet_table' | 'customer' | 'menu_category' | 'menu_item' | 'other_info' | 'tier_list';