// src/types/business.ts
export interface BusinessItem {
    code: string;
    name: string;
    is_common: number;
}

export interface BusinessCategory {
    category_no: number;
    category_name: string;
    children: BusinessItem[];
}
