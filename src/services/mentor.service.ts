import { apiConfig } from "../config/api.config";
import { request } from "../utils/request.utils";

export default class MentorService {
  async getMentors() {
    return request<{ id: string; name: string }[]>(
      {
        method: "GET",
        url: apiConfig.url.mentors,
      },
      {
        useCache: true,
      },
    );
  }

  async getMentor(id: string) {
    return request<{ id: string; name: string }[]>(
      {
        method: "GET",
        url: apiConfig.url.mentors,
        data: { id },
      },
      {
        useCache: true,
      },
    );
  }

  async add(args: Record<string, unknown>) {
    return request<{ id: string; name: string }[]>({
      method: "POST",
      url: apiConfig.url.mentors,
      data: { args },
    });
  }
}
