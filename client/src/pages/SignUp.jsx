import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SingUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Sign up failed");
      }

      setFormData({});

      navigate("/sign-in");
    } catch (err) {
      setError(err?.error ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center">
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
        <legend className="fieldset-legend text-3xl">Login</legend>

        <form onSubmit={onSubmit}>
          <label className="label">Username</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Username"
            name="username"
            id="username"
            onChange={handleChange}
          />

          <label className="label">Email</label>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            name="email"
            id="email"
            onChange={handleChange}
          />

          <label className="label">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            name="password"
            id="password"
            onChange={handleChange}
          />

          <button disabled={loading} className="btn btn-neutral mt-4 w-full">
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div>
          Have an account?{" "}
          <Link to="/sign-in" className="text-primary">
            Sign In
          </Link>
        </div>
      </fieldset>
    </div>
  );
}
