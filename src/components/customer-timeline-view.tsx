"use client";

import React, { useState } from "react";
import { useActivities, useCreateActivity } from "../hooks/use-timeline";
import { useTimelineStore } from "../stores/timeline.store";
import { ActivityDTO, ActivityType } from "../schemas/timeline.schema";
import {
  History,
  Phone,
  MessageSquare,
  Users,
  FileText,
  Mail,
  Plus,
  Clock,
  Sparkles,
  Calendar,
} from "lucide-react";

export function CustomerTimelineView({ customerId }: { customerId?: string }) {
  const { filterType, setFilterType, isCreateActivityModalOpen, setCreateActivityModalOpen } =
    useTimelineStore();
  const { data: activities = [], isLoading } = useActivities(customerId);

  const filtered = activities.filter((a) => {
    if (filterType === "all") return true;
    return a.type === filterType;
  });

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-emerald-500" />;
      case "call":
        return <Phone className="h-4 w-4 text-blue-500" />;
      case "meeting":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Action and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/70">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              Timeline Interaksi Pelanggan
            </h2>
            <p className="text-xs text-muted-foreground">
              Riwayat log panggilan, pesan WhatsApp, rapat, dan catatan negosiasi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["all", "whatsapp", "call", "meeting", "note"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize border transition-all ${
                filterType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border/80 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {type === "all" ? "Semua Kanal" : type}
            </button>
          ))}
          <button
            onClick={() => setCreateActivityModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 ml-2"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Catat Interaksi</span>
          </button>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 h-6 w-6 rounded-full bg-background border border-border/80 flex items-center justify-center shadow-xs group-hover:border-primary transition-colors">
              {getIcon(item.type)}
            </div>

            {/* Card Content */}
            <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs hover:border-primary/50 transition-all space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide px-1.5 py-0.5 bg-muted rounded text-[10px]">
                    {item.type}
                  </span>
                  <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(item.completedAt || item.createdAt)}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">
                  Pelanggan: {item.customerName || "Budi Santoso"}
                </span>
                {item.dealTitle && (
                  <span className="text-primary truncate max-w-xs font-medium">
                    Terkait: {item.dealTitle}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-border/60 rounded-xl text-xs text-muted-foreground">
            Belum ada catatan interaksi pada kanal ini.
          </div>
        )}
      </div>

      <CreateActivityModal customerId={customerId} />
    </div>
  );
}

function CreateActivityModal({ customerId }: { customerId?: string }) {
  const { isCreateActivityModalOpen, setCreateActivityModalOpen } = useTimelineStore();
  const createActivityMutation = useCreateActivity(customerId);

  const [type, setType] = useState<ActivityType>("whatsapp");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("Budi Santoso");

  if (!isCreateActivityModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActivityMutation.mutate(
      {
        customerId: customerId || "cust-01",
        customerName,
        type,
        title,
        description,
        status: "completed",
      },
      {
        onSuccess: () => {
          setCreateActivityModalOpen(false);
          setTitle("");
          setDescription("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border/80 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h3 className="text-base font-bold text-foreground">Catat Interaksi Baru</h3>
          <button
            onClick={() => setCreateActivityModalOpen(false)}
            className="text-muted-foreground hover:text-foreground text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-foreground block mb-1">Kanal Interaksi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
              >
                <option value="whatsapp">WhatsApp Chat</option>
                <option value="call">Panggilan Telepon</option>
                <option value="meeting">Rapat / Kunjungan</option>
                <option value="note">Catatan Internal</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground block mb-1">Pelanggan</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Ringkasan Interaksi</label>
            <input
              type="text"
              required
              placeholder="Misal: Penjelasan penawaran harga & follow up sampel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-foreground block mb-1">Detail Pembahasan / Catatan</label>
            <textarea
              rows={3}
              placeholder="Catatan respon klien, keberatan yang disampaikan, atau kesepakatan berikutnya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border/80 focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateActivityModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border/80 font-medium text-muted-foreground hover:bg-muted/50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createActivityMutation.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              {createActivityMutation.isPending ? "Menyimpan..." : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
