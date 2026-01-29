/**
 * 用户注册页面
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "lib/api/hooks";
import { t } from "lib/i18n";
import { addLocaleToPath } from "lib/i18n/utils";
import { type Locale } from "lib/i18n/config";

export default function RegisterPage({ params }: { params: { locale: Locale } }) {
  const router = useRouter();
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const locale = params.locale;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 基本验证
    if (!email || !password) {
      setFormError(t(locale, "common", "emailRequired"));
      return;
    }

    if (password.length < 6) {
      setFormError(t(locale, "common", "passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setFormError(t(locale, "common", "passwordsNotMatch"));
      return;
    }

    try {
      await register({ email, password, firstName, lastName });
      // 注册成功，跳转到首页
      router.push(addLocaleToPath("/", locale));
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || t(locale, "common", "registerFailed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-rose-600 animate-fadeIn">
            🎉 {t(locale, "common", "registerTitle")}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {t(locale, "common", "registerSubtitle")}
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-200" onSubmit={handleSubmit}>
          {(formError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-fadeIn">
              {formError || error?.message || t(locale, "common", "registerFailed")}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-2">
                  {t(locale, "common", "firstName")}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-pink-300 placeholder-stone-400 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 hover:border-pink-400"
                  placeholder={t(locale, "common", "firstName")}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-2">
                  {t(locale, "common", "lastName")}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-pink-300 placeholder-stone-400 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 hover:border-pink-400"
                  placeholder={t(locale, "common", "lastName")}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                {t(locale, "common", "email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-pink-300 placeholder-stone-400 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 hover:border-pink-400"
                placeholder={t(locale, "common", "email")}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                {t(locale, "common", "password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-pink-300 placeholder-stone-400 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 hover:border-pink-400"
                placeholder={t(locale, "common", "password")}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                {t(locale, "common", "confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-pink-300 placeholder-stone-400 text-stone-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 hover:border-pink-400"
                placeholder={t(locale, "common", "confirmPassword")}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              {loading ? t(locale, "common", "loading") : t(locale, "common", "register")}
            </button>
          </div>

          <div className="text-sm text-center text-stone-600">
            <p>
              {t(locale, "common", "alreadyHaveAccount")}{" "}
              <Link
                href={addLocaleToPath("/login", locale)}
                className="font-medium text-rose-600 hover:text-rose-800 transition-colors duration-300"
              >
                {t(locale, "common", "login")}
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              href={addLocaleToPath("/", locale)}
              className="text-sm text-rose-600 hover:text-rose-800 transition-colors duration-300"
            >
              ← {t(locale, "common", "home")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
