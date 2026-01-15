/**
 * 分类管理页面
 * 显示分类列表，支持创建、编辑和删除
 */

import { requireAdminAuth } from "lib/admin/auth";
import { adminApiClient } from "lib/api/admin-client";
import Link from "next/link";

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: string;
  productCount?: number;
}

async function getCollections(): Promise<Collection[]> {
  try {
    const collections = await adminApiClient.get<Collection[]>("/collections");
    return Array.isArray(collections) ? collections : [];
  } catch (error: any) {
    console.error("获取分类列表失败:", error);
    return [];
  }
}

export default async function CollectionsPage() {
  await requireAdminAuth();
  const collections = await getCollections();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            管理产品分类，共 {collections.length} 个分类
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          添加分类
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
            <p className="mt-1 text-sm text-gray-500">
              开始创建您的第一个分类吧
            </p>
            <div className="mt-6">
              <Link
                href="/admin/collections/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800"
              >
                添加分类
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/admin/collections/${collection.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {collection.image && (
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-md object-cover"
                              src={collection.image}
                              alt={collection.title}
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {collection.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {collection.handle}
                          </div>
                          {collection.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {collection.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {collection.productCount || 0} 个产品
                          </div>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
