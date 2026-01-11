// Commerce Provider 功能特性定义

/**
 * Provider 功能特性配置
 * 用于声明 Provider 支持的功能
 */
export interface CommerceFeatures {
  // 购物车功能
  cart: boolean;
  
  // 用户认证功能（登录/注册）
  customerAuth: boolean;
  
  // 愿望单/收藏功能
  wishlist: boolean;
  
  // 订单功能
  orders: boolean;
  
  // 搜索功能
  search: boolean;
  
  // 产品推荐功能
  productRecommendations: boolean;
  
  // 分类功能
  collections: boolean;
  
  // 菜单功能
  menus: boolean;
  
  // 页面功能
  pages: boolean;
}

/**
 * 默认功能配置（全部禁用）
 */
export const defaultFeatures: CommerceFeatures = {
  cart: false,
  customerAuth: false,
  wishlist: false,
  orders: false,
  search: false,
  productRecommendations: false,
  collections: false,
  menus: false,
  pages: false,
};

/**
 * 完整功能配置（全部启用）
 */
export const fullFeatures: CommerceFeatures = {
  cart: true,
  customerAuth: true,
  wishlist: true,
  orders: true,
  search: true,
  productRecommendations: true,
  collections: true,
  menus: true,
  pages: true,
};
