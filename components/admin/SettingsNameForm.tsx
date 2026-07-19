"use client";

import { FormEvent, useState } from "react";

type SettingsNameFormProps = {
  initialName: string;
};

export function SettingsNameForm({ initialName }: SettingsNameFormProps) {
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      const result = (await response.json()) as { message?: string; admin?: { name: string } };

      if (!response.ok) {
        throw new Error(result.message || "Unable to update settings.");
      }

      setName(result.admin?.name || name);
      setStatus({ type: "success", message: "Name updated." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Unable to update settings." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="admin-settings-form" onSubmit={handleSubmit}>
      <label>
        Display name
        <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required />
      </label>
      {status ? (
        <p className={`admin-form-status ${status.type === "success" ? "is-success" : ""}`} role="status">
          {status.message}
        </p>
      ) : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save name"}
      </button>
    </form>
  );
}
