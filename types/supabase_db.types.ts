

export interface buffetTable {
    id: number;
    table_no: number;
    max_customer: number;
    is_used: boolean;
}
export interface customerTable {
    id: number;
    created_at: string;
    table_id: number;
    tier_id: number;
    customer_count: number;
    paid: boolean;
    tier_list: tierListTable;
    buffet_table: buffetTable;
}
export interface menuCategoryTable {
    id: number;
    name: string
}

export interface menuItemTable {
    id: number;
    name: string;
    tier_list: tierListTable;
    menu_category: menuCategoryTable;
    image: string;
    available_amt: number;
    created_at: string;
}
export interface otherInfoTable {
    id: number;
    name: string;
    value: string;
}
export interface tierListTable {
    id: number;
    name: string;
    amount: number;
    level: number;
}

export type IDatabases = 'buffet_table' | 'customer' | 'menu_category' | 'menu_item' | 'other_info' | 'tier_list';