"use client";

import { useMemo, useState } from "react";

export interface BulkActionOption {
  value: string;
  label: string;
  requiresStatus?: boolean;
}

interface StatusOption {
  value: string;
  label: string;
}

interface BulkActionToolbarProps {
  selectedCount: number;
  actions: BulkActionOption[];
  statusOptions?: StatusOption[];
  onApply: (action: string, status?: string) => Promise<void>;
}

export default function BulkActionToolbar({
  selectedCount,
  actions,
  statusOptions = [],
  onApply,
}: BulkActionToolbarProps) {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeAction = useMemo(
    () => actions.find((action) => action.value === selectedAction),
    [actions, selectedAction]
  );

  if (selectedCount <= 0) {
    return null;
  }

  const handleApply = async () => {
    if (!selectedAction) {
      setError("Please select a bulk action.");
      return;
    }

    if (activeAction?.requiresStatus && !selectedStatus) {
      setError("Please choose a status.");
      return;
    }

    const confirmed = window.confirm(
      `Apply "${activeAction?.label ?? selectedAction}" to ${selectedCount} item(s)?`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onApply(
        selectedAction,
        activeAction?.requiresStatus ? selectedStatus : undefined
      );
      setSuccess("Bulk action completed.");
      setSelectedAction("");
      setSelectedStatus("");
    } catch (applyError) {
      const message =
        applyError instanceof Error ? applyError.message : "Bulk action failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-700">{selectedCount} item(s) selected</p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={selectedAction}
            onChange={(event) => setSelectedAction(event.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Select action</option>
            {actions.map((action) => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </select>

          {activeAction?.requiresStatus ? (
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          ) : null}

          <button
            type="button"
            onClick={handleApply}
            disabled={isSubmitting || !selectedAction}
            className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-2 text-sm text-green-600">{success}</p> : null}
    </div>
  );
}

