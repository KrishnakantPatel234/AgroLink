export const API_BASE_URL = "http://localhost:5000/api";

export const getRequest = async (url) => {
  const res = await fetch(API_BASE_URL + url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const postRequest = async (url, body, token) => {
  const res = await fetch(API_BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// File upload ke liye (FormData)
export const postFormData = async (endpoint, formData, token = null) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  return await res.json();
};
