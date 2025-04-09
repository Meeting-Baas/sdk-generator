export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
      enum?: string[];
      items?: {
        type: string;
      };
      properties?: Record<string, {
        type: string;
        description: string;
      }>;
    }>;
    required?: string[];
  };
} 