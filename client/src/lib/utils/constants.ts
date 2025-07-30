// Base API URLs
export const BASE_URL = "https://api.example.com"; // Replace with your actual base URL

// Endpoint URLs
export const USERS_URL = `${BASE_URL}/private/users`;
export const PLANS_URL = `${BASE_URL}/private/plans`;
export const CREATE_SUBSCRIPTION_URL = `${BASE_URL}/private/subscription/create`;
export const UPDATE_SUBSCRIPTION_URL = `${BASE_URL}/private/subscription/update`;
export const DELETE_SUBSCRIPTION_URL = `${BASE_URL}/private/subscription/delete`;

// Example frontend routes (optional)
export const DASHBOARD_URL = "/admin/dashboard";
export const LOGIN_URL = "/auth/login";

// Other constants (optional)
export const DEFAULT_PAGE_SIZE = 20;
export const DATE_FORMAT = "yyyy-MM-dd"; // You can use this with date-fns or similar
export const TIMEOUT = 5000; // Default timeout for fetch requests in milliseconds
export const DEFAULT_ERROR_MESSAGE =
  "An unexpected error occurred. Please try again later.";
