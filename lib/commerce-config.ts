// Commerce 配置管理

import type { CommerceFeatures } from "@commerce/types";
import { defaultFeatures, fullFeatures } from "@commerce/features";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export interface CommerceConfig {
  features: CommerceFeatures;
  provider?: {
    name: string;
    config?: Record<string, any>;
  };
}

let configCache: CommerceConfig | null = null;

/**
 * 读取 commerce.config.json 配置
 */
export function getCommerceConfig(): CommerceConfig {
  if (configCache) {
    return configCache;
  }

  try {
    const configPath = join(process.cwd(), "commerce.config.json");
    
    if (!existsSync(configPath)) {
      configCache = {
        features: defaultFeatures,
      };
      return configCache;
    }
    
    const configContent = readFileSync(configPath, "utf-8");
    const config: CommerceConfig = JSON.parse(configContent);
    
    // 处理环境变量替换
    if (config.provider?.config) {
      Object.keys(config.provider.config).forEach((key) => {
        const value = config.provider!.config![key];
        if (typeof value === "string" && value.startsWith("${") && value.endsWith("}")) {
          const envVar = value.slice(2, -1);
          config.provider.config![key] = process.env[envVar] || value;
        }
      });
    }
    
    configCache = config;
    return config;
  } catch (error) {
    // 如果配置文件解析失败，返回默认配置
    console.warn("Failed to parse commerce.config.json, using default config:", error);
    configCache = {
      features: defaultFeatures,
    };
    return configCache;
  }
}

/**
 * 获取功能配置
 * 优先使用 commerce.config.json 中的配置，如果没有则使用 Provider 声明的功能
 */
export function getFeatures(
  providerFeatures?: CommerceFeatures
): CommerceFeatures {
  const config = getCommerceConfig();
  
  // 如果配置文件中明确设置了功能，使用配置文件
  if (config.features && Object.keys(config.features).length > 0) {
    // 如果 Provider 也声明了功能，合并两者（配置文件优先）
    if (providerFeatures) {
      return mergeFeatures(providerFeatures, config.features);
    }
    return config.features;
  }
  
  // 否则使用 Provider 声明的功能
  return providerFeatures || defaultFeatures;
}

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(
  feature: keyof CommerceFeatures,
  providerFeatures?: CommerceFeatures
): boolean {
  const features = getFeatures(providerFeatures);
  return features[feature] === true;
}

/**
 * 合并功能配置
 * 配置文件中的设置会覆盖 Provider 声明的功能
 */
export function mergeFeatures(
  providerFeatures: CommerceFeatures,
  configFeatures?: Partial<CommerceFeatures>
): CommerceFeatures {
  if (!configFeatures) {
    return providerFeatures;
  }
  
  return {
    ...providerFeatures,
    ...configFeatures,
  };
}
