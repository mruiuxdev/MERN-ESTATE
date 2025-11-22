import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInSuccess,
  singInStart,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(singInStart());

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        dispatch(signInFailure(data?.message || "Sign in failed"));
        throw new Error(data?.message || "Sign in failed");
      }

      setFormData({});
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err?.error ?? String(err)));
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
        <legend className="fieldset-legend text-3xl">Sign In</legend>

        <form onSubmit={onSubmit}>
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
              "Sign In"
            )}
          </button>
          <OAuth />
        </form>
        <div>
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-primary">
            Sign Up
          </Link>
        </div>
      </fieldset>
    </div>
  );
}
