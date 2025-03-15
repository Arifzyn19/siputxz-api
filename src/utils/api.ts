import { APIEndpoint } from '../types';

/**
 * Helper class for API utilities
 */
export class ApiHelper {
  /**
   * Extract example parameters from an endpoint's example string
   * @param example Example string from API (e.g., "param1=value1&param2=value2")
   * @returns Object containing the parameters
   */
  static parseExampleParams(example: string): Record<string, string> {
    if (!example) return {};
    
    const params: Record<string, string> = {};
    const pairs = example.split('&');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key] = value;
      }
    });
    
    return params;
  }
  
  /**
   * Create a camelCase function name from an endpoint title
   * @param name The endpoint name
   * @returns Camelcase function name
   */
  static createFunctionName(name: string): string {
    // Remove special characters, replace spaces with underscores
    const cleanName = name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    
    // Convert to camelCase
    return cleanName.split('_')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }
  
  /**
   * Generate TypeScript interface from example parameters
   * @param endpoint API endpoint data
   * @returns TypeScript interface definition as string
   */
  static generateTypeInterface(endpoint: APIEndpoint): string {
    const params = ApiHelper.parseExampleParams(endpoint.example);
    const interfaceName = `${ApiHelper.createFunctionName(endpoint.name)}Params`;
    
    let interfaceCode = `export interface ${interfaceName} {\n`;
    
    Object.keys(params).forEach(key => {
      interfaceCode += `  ${key}: string;\n`;
    });
    
    interfaceCode += '}\n';
    return interfaceCode;
  }
  
  /**
   * Create query string from parameters
   * @param params Object containing query parameters
   * @returns URL query string
   */
  static createQueryString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
}