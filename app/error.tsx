/**
 * 错误边界组件
 * 当应用发生错误时显示的错误页面
 * 注意：必须是客户端组件（"use client"）
 */

"use client";

/**
 * 错误页面组件
 * @param reset - 重置错误状态的函数，由 Next.js 自动提供
 * @returns 错误提示页面的 JSX
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-stone-300 bg-khaki-light p-8 md:p-12">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      {/* 重试按钮，点击后尝试重新渲染组件 */}
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-amber-700 p-4 tracking-wide text-white hover:bg-amber-800 transition-colors"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
