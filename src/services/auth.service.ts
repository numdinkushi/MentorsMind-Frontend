import { apiConfig } from "../config/api.config";
import { request } from "../utils/request.utils";

export default class AuthService {
  async login(email: string, password: string) {
    return request<{ accessToken: string; refreshToken: string }>({
      method: "POST",
      url: apiConfig.url.auth.login,
      data: { email, password },
    });
  }

  async signup(email: string, password: string) {
    return request<{ accessToken: string; refreshToken: string }>({
      method: "POST",
      url: apiConfig.url.auth.signup,
      data: { email, password },
    });
  }

  async me() {
    return request<{ id: string; email: string }>(
      {
        method: "GET",
        url: apiConfig.url.auth.me,
      },
      {
        useCache: true,
      },
    );
  }
}
