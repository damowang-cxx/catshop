"use client";

// 功能门控组件 - 根据功能开关条件渲染子组件

import { useFeature } from "lib/hooks/use-features";
import type { CommerceFeatures } from "@commerce/types";
import type { ReactNode } from "react";

interface FeatureGateProps {
  feature: keyof CommerceFeatures;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 功能门控组件
 * 只有当指定功能启用时才渲染子组件
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
