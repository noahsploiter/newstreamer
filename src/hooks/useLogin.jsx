import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Set initial state to false

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(
        "https://habeshan.ashara-buildingdesigns.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        message.success(data.message);
        login(data.token, data.user);
      } else {
        setError(data.message);
        message.error(data.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      message.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, loginUser };
};

export default useLogin;
