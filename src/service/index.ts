import { User } from "@/types";
interface SignupResponse {
  status: "success";
}

export const Auth = {
  signup: async (user: User): Promise<SignupResponse> => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({ user }),
      redirect: "follow",
    };

    const response = await fetch(
      "https://app.bananacrystal.com/api/users/sign_up",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
