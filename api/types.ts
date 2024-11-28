// API 响应的基础接口
export interface ApiResponse {
    code: number;
    time: number;
    time2: string;
    data: NewsItem[];
}

// 热搜项的接口
export interface NewsItem {
    index: number;
    word: string;
    hotScore: string;
    hotTagImg?: string;
    img?: string;
    url: string;
}

// 搜索参数接口
export interface SearchParams {
    id: string;
    key: string;
} 