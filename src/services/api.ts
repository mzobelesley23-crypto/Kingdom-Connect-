import { User, UserRole, PrayerRequest, AuditLog, Announcement, DailyScripture } from '../types';

const TOKEN_KEY = 'kc_auth_session_token';

export const ApiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-session-token'] = token;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { error: response.statusText };
      }
      const error: any = new Error(errorBody.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = errorBody;
      throw error;
    }

    return response.json();
  },

  async login(userId: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    this.setToken(res.token);
    return res;
  },

  async register(name: string, email: string): Promise<{ token: string; user: User }> {
    const res = await this.request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email })
    });
    this.setToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  },

  async getAllUsers(): Promise<{ users: User[] }> {
    return this.request<{ users: User[] }>('/api/auth/users');
  },

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  },

  // Prayer requests (Strict Backend Enforcement)
  async getPrayers(): Promise<{ prayers: PrayerRequest[] }> {
    return this.request<{ prayers: PrayerRequest[] }>('/api/prayer');
  },

  async submitPrayer(data: { title: string; request: string; category: string }): Promise<{ prayer: PrayerRequest }> {
    return this.request<{ prayer: PrayerRequest }>('/api/prayer', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updatePrayer(id: string, status: string, pastoralNotes?: string): Promise<{ prayer: PrayerRequest }> {
    return this.request<{ prayer: PrayerRequest }>(`/api/prayer/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, pastoralNotes })
    });
  },

  // Admin API (Role Protected)
  async getAdminMetrics(): Promise<any> {
    return this.request('/api/admin/metrics');
  },

  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    return this.request<{ logs: AuditLog[] }>('/api/admin/audit-logs');
  },

  async updateUserRole(targetUserId: string, newRole: UserRole): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>(`/api/admin/users/${targetUserId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ newRole })
    });
  },

  async toggleLivestream(streamId?: string): Promise<any> {
    return this.request('/api/admin/live/toggle', {
      method: 'POST',
      body: JSON.stringify({ streamId })
    });
  },

  async getDailyDevotional(): Promise<{ devotional: DailyScripture }> {
    return this.request<{ devotional: DailyScripture }>('/api/devotional/today');
  },

  async publishAnnouncement(data: Partial<Announcement>): Promise<{ announcement: Announcement }> {
    return this.request<{ announcement: Announcement }>('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async saveDailyScripture(data: Partial<DailyScripture>): Promise<{ dailyScripture: DailyScripture }> {
    return this.request<{ dailyScripture: DailyScripture }>('/api/admin/daily-scripture', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Security test suite runner
  async runSecurityTests(): Promise<any> {
    return this.request('/api/security/run-tests', {
      method: 'POST'
    });
  }
};
