import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AxiosError } from "axios";

const Register = () => {
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

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      let errorMessage: string | string[] =
        "Registration failed. Please try again.";

      if (error instanceof Error) {
        // Handle client-side validation errors
        if (
          error.message.includes("Please fill") ||
          error.message.includes("Password must")
        ) {
          errorMessage = error.message;
        }
      }

      if (error instanceof AxiosError) {
        // Handle server validation errors
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || "Invalid input";

          // Handle express-validator error format
          if (Array.isArray(error.response.data?.errors)) {
            errorMessage = error.response.data.errors.map(
              (err: { msg: string }) => err.msg
            );
          }
        } else if (error.response?.status === 409) {
          errorMessage = "Username already exists";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (!error.response) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="auth-redirect">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="link-button"
          disabled={isSubmitting}
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;
