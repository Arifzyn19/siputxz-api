export interface SiputzxAPIConfig {
  BASE_URL?: string;
  apikey?: string;
  autoLoad?: boolean; 
}

export interface APIEndpoint {
  id: number;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  example: string;
  hasAllModules: boolean;
  isPremium: boolean;
  isMaintenance: boolean;
  isPublic: boolean;
}

export interface APICategory {
  title: string;
  endpoints: APIEndpoint[];
}

export interface APIRoutes {
  [category: string]: APICategory;
}

export interface APIListResponse {
  status: boolean;
  routes: APIRoutes;
}