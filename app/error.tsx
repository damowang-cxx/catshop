"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-stone-300 bg-khaki-light p-8 md:p-12">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-amber-700 p-4 tracking-wide text-white hover:bg-amber-800 transition-colors"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
