import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            let errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;

            try {
                const errorText = await response.text();
                if (errorText) {
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorJson.title || errorText;
                    } catch {
                        errorMessage = errorText;
                    }
                }
            } catch {
                errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        if (response.status === 204 || response.status === 205) {
            return null as unknown as T;
        }

        if (contentType && contentType.includes("application/json")) {
            return response.json() as Promise<T>;
        }

        return null as unknown as T;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const options: RequestInit = {
            method: "POST",
        };

        if (data instanceof FormData) {
            options.headers = this.getAuthHeaders();
            options.body = data;
        } else if (data) {
            options.headers = {
                "Content-Type": "application/json",
                ...this.getAuthHeaders(),
            };
            options.body = JSON.stringify(data);
        } else {
            options.headers = {
                "Content-Type": "application/json",
                ...this.getAuthHeaders(),
            };
        }

        return this.request<T>(endpoint, options);
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        if (data instanceof FormData) {
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: { ...authHeaders },
                body: data,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PUT con FormData");
            }
            return response.json();

        } else {
            const response = await fetch(fullUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PUT con JSON");
            }
            return response.json();
        }
    }

    async patch<T>(endpoint: string, data: any): Promise<T> {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        const authHeaders = this.getAuthHeaders();

        if (data instanceof FormData) {
            const response = await fetch(fullUrl, {
                method: "PATCH",
                headers: { ...authHeaders },
                body: data
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PATCH con FormData");
            }

            return response.json();
        } else {
            const response = await fetch(fullUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error en la solicitud PATCH con JSON");
            }
            return response.json();
        }
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async downloadFile(endpoint: string, filename: string, data?: any): Promise<void> {
        const url = `${this.baseUrl}${endpoint}`;

        const options: RequestInit = {
            method: data ? "POST" : "GET",
            headers: this.getAuthHeaders(),
        };

        if (data) {
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    }
}

export const apiClient = new ApiClient();