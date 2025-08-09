import axios, { AxiosInstance } from 'axios';
import { SiputzxAPIConfig, APIListResponse } from '../types';
import { ApiHelper } from '../utils/api';

export class SiputzxAPI {
  private client: AxiosInstance; 
  private baseURL: string;
  private apikey?: string;
  private endpointsLoaded: boolean = false;
  private endpointsList: APIListResponse | null = null;
  
  [key: string]: any;

  constructor(config: SiputzxAPIConfig = {}) {
    this.baseURL = config.BASE_URL || 'https://api.siputzx.my.id';
    this.apikey = config.apikey;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apikey && { 'Authorization': `Bearer ${this.apikey}` })
      }
    });

    // Auto-initialize endpoints
    this.initializeEndpoints();
  }

  /**
   * Make a GET request to the API
   */
  public async get<T = any>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const queryString = ApiHelper.createQueryString(params);
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await this.client.get<T>(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   */
  public async post<T = any>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get list of all available API endpoints
   */
  public async getEndpoints(): Promise<APIListResponse> {
    const response = await this.get<APIListResponse>('/api/get');
    this.endpointsList = response;
    return response; 
  }
  
  /**
   * Initialize dynamic endpoints by fetching endpoint list from API
   */
  public async initializeEndpoints(): Promise<void> {
    if (this.endpointsLoaded) return;
    
    try {
      const endpoints = await this.getEndpoints();
      this.setupDynamicEndpoints(endpoints);
      this.endpointsLoaded = true;
    } catch (error) {
      console.error('Failed to initialize endpoints:', error);
    }
  }
  
  /**
   * Setup dynamic endpoints based on API response
   */
  private setupDynamicEndpoints(apiResponse: APIListResponse): void {
    if (!apiResponse || !apiResponse.routes) return;
    
    Object.entries(apiResponse.routes).forEach(([categoryName, category]) => {
      const categoryKey = categoryName.toLowerCase();
      
      if (!this[categoryKey]) {
        this[categoryKey] = {};
      }
      
      category.endpoints.forEach(endpoint => {
        const functionName = ApiHelper.createFunctionName(endpoint.name);
        
        const exampleParams = ApiHelper.parseExampleParams(endpoint.example);
        
        this[categoryKey][functionName] = async (params: any = {}) => {
          if (endpoint.method === 'GET') {
            return this.get(endpoint.path, params);
          } else if (endpoint.method === 'POST') {
            return this.post(endpoint.path, params);
          }
        };
        
        this[categoryKey][functionName].endpoint = endpoint;
        this[categoryKey][functionName].exampleParams = exampleParams;
      });
    });
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      console.error(`API Error (${status}):`, data);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  /**
   * Set API key
   */
  public setApiKey(apikey: string): void {
    this.apikey = apikey;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${apikey}`;
  }

  /**
   * Set base URL
   */
  public setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }
}