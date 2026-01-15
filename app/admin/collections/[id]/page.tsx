/**
 * 编辑分类页面
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: string;
}

export default function EditCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await fetch(`/api/admin/collections/${collectionId}`);
        if (!response.ok) {
          throw new Error("获取分类失败");
        }
        const data = await response.json();
        const collectionData = data.data || data;
        setCollection(collectionData);
        setFormData({
          title: collectionData.title || "",
          handle: collectionData.handle || "",
          description: collectionData.description || "",
          image: collectionData.image || "",
        });
      } catch (err: any) {
        console.error("获取分类错误:", err);
        setError(err.message || "获取分类失败");
      } finally {
        setLoading(false);
      }
    }

    if (collectionId) {
      fetchCollection();
    }
  }, [collectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "更新分类失败");
      }

      router.push("/admin/collections");
      router.refresh();
    } catch (err: any) {
      console.error("更新分类错误:", err);
      setError(err.message || "更新分类失败，请稍后重试");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这个分类吗？此操作无法撤销。")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除分类失败");
      }

      router.push("/admin/collections");
      router.refresh();
    } catch (err: any) {
      console.error("删除分类错误:", err);
      setError(err.message || "删除分类失败");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error && !collection) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <Link
          href="/admin/collections"
          className="text-amber-600 hover:text-amber-800"
        >
          返回分类列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">编辑分类</h1>
          <p className="mt-2 text-sm text-gray-600">
            更新分类信息
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          删除分类
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                分类信息
              </h3>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  分类名称 *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="handle"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL 标识符 *
                </label>
                <input
                  type="text"
                  name="handle"
                  id="handle"
                  required
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  分类描述
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  分类图片 URL
                </label>
                <input
                  type="url"
                  name="image"
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="预览"
                      className="h-32 w-32 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/collections"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "保存中..." : "保存更改"}
          </button>
        </div>
      </form>
    </div>
  );
}
