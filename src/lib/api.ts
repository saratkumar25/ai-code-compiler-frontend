export interface GenerateRequest {
  prompt: string;
}

export interface PipelineResponse {
  intent: any;
  architecture: any;
  schemas: any;
  validation: {
    valid: boolean;
    errors: any[];
    warnings: string[];
    score: number;
  };
  execution: {
    success: boolean;
    checks: any[];
    summary: string;
    readiness: number;
  };
  _meta: any;
}

export interface MetricsResponse {
  metrics: {
    totalRequests: number;
    successfulGenerations: number;
    validationFailures: number;
    repairAttempts: number;
    successRate: string;
    averageLatencyMs: number;
    stageAverages: Record<string, number>;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  async generate(prompt: string): Promise<PipelineResponse> {
    const res = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to generate');
    }
    return res.json();
  },

  async validate(schemas: any): Promise<PipelineResponse['validation']> {
    const res = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemas }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to validate');
    }
    return res.json();
  },

  async repair(schemas: any, validation: any): Promise<PipelineResponse> {
    const res = await fetch(`${API_BASE_URL}/repair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemas, validation }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to repair');
    }
    return res.json();
  },

  async getMetrics(): Promise<MetricsResponse> {
    const res = await fetch(`${API_BASE_URL}/metrics`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch metrics');
    }
    return res.json();
  },
};
