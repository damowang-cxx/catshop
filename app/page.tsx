import { redirect } from "next/navigation";
import { autoDetectFallbackLocale } from "lib/i18n/config";

export default function RootPage() {
  redirect(`/${autoDetectFallbackLocale}`);
}
