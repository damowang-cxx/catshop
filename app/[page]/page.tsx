/**
 * 动态页面组件
 * 用于显示 CMS 管理的静态页面（如关于我们、隐私政策等）
 */

import type { Metadata } from "next";

import Prose from "components/prose";
import { getPage } from "lib/commerce";
import { notFound } from "next/navigation";

/**
 * 生成页面的 SEO 元数据
 * @param props - 包含页面标识的参数对象
 * @returns 页面的元数据
 */
export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

/**
 * 动态页面主组件
 * @param props - 包含页面标识的参数对象
 * @returns 页面内容的 JSX
 */
export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      {/* 页面标题 */}
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      {/* 页面正文内容（支持 HTML） */}
      <Prose className="mb-8" html={page.body} />
      {/* 最后更新时间 */}
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        ).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
