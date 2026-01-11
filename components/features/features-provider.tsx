"use client";

// 功能配置 Provider - 将服务端的功能配置传递到客户端

import { setClientFeatures } from "lib/hooks/use-features";
import type { CommerceFeatures } from "@commerce/types";
import { useEffect } from "react";

interface FeaturesProviderProps {
  features: CommerceFeatures;
  children: React.ReactNode;
}

/**
 * 功能配置 Provider
 * 将服务端的功能配置传递到客户端组件
 */
export function FeaturesProvider({
  features,
  children,
}: FeaturesProviderProps) {
  useEffect(() => {
    setClientFeatures(features);
  }, [features]);

  return <>{children}</>;
}
