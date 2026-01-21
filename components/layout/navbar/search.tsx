"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { type Locale } from "lib/i18n/config";
import { t } from "lib/i18n";
import { addLocaleToPath } from "lib/i18n/utils";

export default function Search({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();

  return (
    <Form
      action={addLocaleToPath("/search", locale)}
      className="w-max-[550px] group relative w-full lg:w-80 xl:w-full"
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder={t(locale, "common", "searchPlaceholder")}
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-md w-full rounded-full border-2 border-pink-200 bg-white px-4 py-2 text-stone-900 shadow-sm transition-all duration-300 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 md:text-sm"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-rose-400 transition-colors duration-300 group-hover:text-rose-600" />
      </div>
    </Form>
  );
}

export function SearchSkeleton({ locale }: { locale: Locale }) {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder={t(locale, "common", "searchPlaceholder")}
        className="w-full rounded-full border-2 border-pink-200 bg-white px-4 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-rose-400" />
      </div>
    </form>
  );
}
