

export interface buffetTable{
    id: number;
    table_no: number;
    max_customer: string;
    is_used: boolean;
}
export interface Customer {
    id: number;
    created_at: Date;
    table_id: number;
    tier_id: number;
    customer_count: number;
    
}
export interface menuCategory {
    id: number;
    name: string
}

export interface menuItem {
    id: number;
    name: string;
    tier_id: number;
    category_id: number;
    image: string;
    available_amt: number;
    created_at: string;
}
export interface otherInfo{
    id:number;
    time_limit: string;
}
export interface tierList{
    id: number;
    name : string;
    amount: number;
}