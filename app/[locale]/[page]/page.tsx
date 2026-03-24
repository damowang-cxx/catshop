import { getPage } from "lib/commerce";
import { notFound } from "next/navigation";

type CmsPageProps = {
  params: Promise<{ locale: string; page: string }>;
};

export async function generateMetadata({ params }: CmsPageProps) {
  const { page: pageHandle } = await params;
  const page = await getPage(pageHandle);

  return {
    title: page?.seo?.title || page?.title || pageHandle,
    description: page?.seo?.description || page?.bodySummary,
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { page: pageHandle } = await params;
  const page = await getPage(pageHandle);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <article className="rounded-3xl border border-pink-100 bg-white/90 p-8 shadow-sm md:p-12">
        <h1 className="text-3xl font-bold text-stone-900 md:text-5xl">
          {page.title}
        </h1>
        {page.bodySummary ? (
          <p className="mt-4 text-base text-stone-600 md:text-lg">
            {page.bodySummary}
          </p>
        ) : null}
        <div
          className="prose prose-stone mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </article>
    </div>
  );
}
