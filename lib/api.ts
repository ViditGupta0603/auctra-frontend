import axios from "axios";

const api = axios.create({
  baseURL:
    "https://auctra-backend-gunz.onrender.com/api",
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    /**
     * INVALID TOKEN
     */
    if (
      error.response?.status ===
      401
    ) {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      /**
       * REDIRECT LOGIN
       */
      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;