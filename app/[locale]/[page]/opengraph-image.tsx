import OpengraphImage from "components/opengraph-image";
import { getPage } from "lib/commerce";

export default async function Image({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageHandle } = await params;
  const page = await getPage(pageHandle);
  const title = page?.seo?.title || page?.title || pageHandle;

  return OpengraphImage({ title });
}
