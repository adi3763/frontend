import React, { useContext, useEffect, useState } from "react";
import Layout from "../Common/Layout";
import { AdminAuthContext } from "../Context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading,user } = useContext(AdminAuthContext);
const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (loading) return; // wait until auth state is known

    if (user) {
      const role = user.role?.toLowerCase?.();
      if (role === "admin" || role === "super_admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  console.log(user);

  function changeHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  }

  async function submitHandler(e) {
    e.preventDefault();
    setFormError("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await login(formData); // assumes provider throws or toasts on failure
    } catch (err) {
      // if your provider rethrows, show a message here
      setFormError(err?.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-fuchsia-600/30 blur-3xl" />

      <Layout>
        <section className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg">
                  {/* lock icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5M3.75 19.5a7.5 7.5 0 1116.5 0" /></svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Welcome back</h1>
                <p className="mt-2 text-sm text-slate-300">Sign in to your account to continue</p>
              </div>

              {/* Form */}
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Form-level error */}
                {formError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {formError}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      onBlur={() => setErrors((e) => ({ ...e, ...validateForm() }))}
                      autoComplete="email"
                      inputMode="email"
                      className={`peer w-full rounded-xl border px-4 py-3 text-slate-100 placeholder-slate-400 outline-none ring-0 transition focus:border-indigo-400 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 ${errors.email ? "border-red-500" : "border-white/10 bg-white/10"}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      onBlur={() => setErrors((e) => ({ ...e, ...validateForm() }))}
                      autoComplete="current-password"
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-slate-100 outline-none transition focus:border-indigo-400 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/20 ${errors.password ? "border-red-500" : "border-white/10 bg-white/10"}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 my-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {/* icons omitted for brevity */}
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-400/30" />
                    <span className="text-slate-300">Remember me</span>
                  </label>
                  <a href="#" className="font-medium text-indigo-300 hover:text-indigo-200">Forgot password?</a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-4 py-3 font-semibold text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/30
                    ${loading ? "bg-slate-600 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 hover:opacity-95"}
                  `}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent"></span>
                      Logging in…
                    </span>
                  ) : (
                    <>
                      <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-0" />
                      Login
                    </>
                  )}
                </button>

                {/* Divider & Socials kept as-is */}
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400/80">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </section>
      </Layout>
    </div>
  );
}

