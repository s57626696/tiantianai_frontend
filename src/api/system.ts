import request from "../utils/request";

export interface LogoOut {
    id: number;
    name: string;
    url: string;
}

export const getLogo = async (): Promise<string> => {
    const res: LogoOut = await request.get("/system/logo");
    return res.url; // 取 url 字段
};

export {};
