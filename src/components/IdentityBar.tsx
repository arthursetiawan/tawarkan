"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/components/StoreProvider";

export function IdentityBar() {
  const { ready, identity, setName, switchAccount } = useStore();
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (identity) setDraft(identity.displayName);
  }, [identity]);

  if (!ready) {
    return <p className="identity-bar identity-bar--muted">Memuat identitas…</p>;
  }

  if (!editing) {
    return (
      <div className="identity-bar">
        <span>
          Kamu: <strong>{identity?.displayName ?? "Penjelajah"}</strong>
        </span>
        <button
          type="button"
          className="btn btn--link"
          onClick={() => setEditing(true)}
        >
          Ganti nama
        </button>
        <button
          type="button"
          className="btn btn--link"
          onClick={() => {
            const name = window.prompt(
              "Nama akun lokal baru (untuk coba peran pembeli/penjual lain):",
              "Pembeli demo",
            );
            if (name != null) switchAccount(name || "Pembeli demo");
          }}
        >
          Akun lain
        </button>
      </div>
    );
  }

  return (
    <form
      className="identity-bar identity-bar--edit"
      onSubmit={(e) => {
        e.preventDefault();
        if (draft.trim()) {
          setName(draft.trim());
          setEditing(false);
        }
      }}
    >
      <label className="field field--inline">
        <span className="sr-only">Nama tampilan</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={40}
          placeholder="Nama / toko"
          autoFocus
        />
      </label>
      <button type="submit" className="btn btn--primary btn--small">
        Simpan
      </button>
      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={() => {
          setDraft(identity?.displayName ?? "");
          setEditing(false);
        }}
      >
        Batal
      </button>
    </form>
  );
}
