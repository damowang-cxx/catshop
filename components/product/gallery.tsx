/**
 * 产品图片画廊组件
 * 支持图片切换、缩略图导航等功能
 * 注意：必须是客户端组件（"use client"）
 */

"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * 产品图片画廊组件
 * @param images - 产品图片数组，包含图片 URL 和 alt 文本
 * @returns 图片画廊的 JSX
 */
export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 从 URL 参数获取当前显示的图片索引，默认为第一张
  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  /**
   * 更新当前显示的图片
   * @param index - 要显示的图片索引
   */
  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    // 更新 URL 参数但不滚动页面
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // 计算下一张和上一张图片的索引（循环）
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  // 导航按钮的样式类名
  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-stone-900 flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-cover"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-stone-300 bg-khaki-light/90 text-stone-700 backdrop-blur-sm">
              <button
                formAction={() => updateImage(previousImageIndex.toString())}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-stone-400"></div>
              <button
                formAction={() => updateImage(nextImageIndex.toString())}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => updateImage(index.toString())}
                  aria-label="Select product image"
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
