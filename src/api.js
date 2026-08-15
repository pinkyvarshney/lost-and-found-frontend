const BASE_URL = "http://localhost:8080";

export const createClaim = async (claimData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/claims`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(claimData)
  });

  if (!response.ok) {
    throw new Error("Failed to create claim");
  }

  return response.json();
};