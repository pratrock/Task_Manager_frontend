import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AxiosError } from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | string[]>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear errors when user starts typing
  useEffect(() => {
    setError("");
  }, [formData.username, formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Client-side validation
      if (!formData.username.trim() || !formData.password.trim()) {
        throw new Error("Please fill in all fields");
      }
      // Server-side validation
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/dashboard");
    } catch (error) {
      let errorMessage: string | string[] = "Login failed. Please try again.";

      if (error instanceof Error) {
        // Client-side validation errors
        if (error.message === "Please fill in all fields") {
          errorMessage = error.message;
        }
      }

      if (error instanceof AxiosError) {
        // Server-side validation errors
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || "Invalid input";

          // Handle express-validator error format
          if (Array.isArray(error.response.data?.errors)) {
            errorMessage = error.response.data.errors.map(
              (err: { msg: string }) => err.msg
            );
          }
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (!error.response) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      // Set error message
      setError(errorMessage);
    } finally {
      // Reset form state
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            aria-label="Username"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            aria-label="Password"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="error-message">
            /* Display error messages */
            {Array.isArray(error) ? (
              <ul>
                {error.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p>{error}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? "submitting" : ""}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="auth-redirect">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="link-button"
          disabled={isSubmitting}
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
