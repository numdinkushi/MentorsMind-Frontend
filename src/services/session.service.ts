import { apiConfig } from "../config/api.config";
import { request } from "../utils/request.utils";

export default class SessionService {
  async create(mentorId: string) {
    return request<{ status: string }>({
      method: "POST",
      url: apiConfig.url.sessions,
      data: { mentorId },
    });
  }

  async getSession(id: string) {
    return request<{ status: string }>(
      {
        method: "GET",
        url: apiConfig.url.sessions,
        data: { id },
      },
      {
        useCache: true,
      },
    );
  }

  async getSessions(args: Record<string, unknown>) {
    return request<{ status: string }>(
      {
        method: "GET",
        url: apiConfig.url.sessions,
        data: { args },
      },
      {
        useCache: true,
      },
    );
  }
}
