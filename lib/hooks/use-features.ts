"use client";

// 客户端功能检查 Hook

import { useMemo } from "react";
import type { CommerceFeatures } from "@commerce/types";

/**
 * 功能特性配置
 * 在客户端使用，从服务端传递的功能配置
 */
let clientFeatures: CommerceFeatures | null = null;

/**
 * 设置客户端功能配置（由服务端传递）
 */
export function setClientFeatures(features: CommerceFeatures) {
  clientFeatures = features;
}

/**
 * 获取客户端功能配置
 */
export function getClientFeatures(): CommerceFeatures | null {
  return clientFeatures;
}

/**
 * React Hook: 检查功能是否启用
 */
export function useFeature(feature: keyof CommerceFeatures): boolean {
  return useMemo(() => {
    if (!clientFeatures) {
      return false;
    }
    return clientFeatures[feature] === true;
  }, [feature]);
}

/**
 * React Hook: 获取所有功能配置
 */
export function useFeatures(): CommerceFeatures | null {
  return useMemo(() => clientFeatures, []);
}
