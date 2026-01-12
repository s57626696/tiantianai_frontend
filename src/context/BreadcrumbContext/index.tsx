import React, {createContext, useContext, useState, ReactNode} from "react";

export interface BreadcrumbItem {
    label: string;   // 显示文字
    path?: string;   // 可点击跳转的路径，可选
}

interface BreadcrumbContextType {
    crumbs: BreadcrumbItem[];
    setCrumbs: (newCrumbs: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
    crumbs: [],
    setCrumbs: () => {
    },
});

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);
    return (
        <BreadcrumbContext.Provider value={{crumbs, setCrumbs}}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
