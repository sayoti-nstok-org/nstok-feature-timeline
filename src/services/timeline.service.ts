import {
  ActivityDTO,
  TimelineEventDTO,
  CreateActivityInput,
} from "../schemas/timeline.schema";

export interface TimelineRepositoryPort {
  getActivities(customerId?: string): Promise<ActivityDTO[]>;
  createActivity(input: CreateActivityInput): Promise<ActivityDTO>;
  getTimelineEvents(customerId?: string): Promise<TimelineEventDTO[]>;
}

const STORAGE_KEY_ACTIVITIES = "nstok_crm_activities_cache";

export const initialMockActivities: ActivityDTO[] = [
  {
    id: "act-01",
    organizationId: "org-01",
    customerId: "cust-01",
    customerName: "Budi Santoso",
    dealId: "deal-01",
    dealTitle: "Kontrak Pasokan Bahan Baku 100 Karung",
    type: "whatsapp",
    title: "Followup penawaran diskon kuantiti 5%",
    description: "Klien merespons positif terhadap proposal dan minta dikirimkan sampel beras.",
    status: "completed",
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "act-02",
    organizationId: "org-01",
    customerId: "cust-02",
    customerName: "Siti Rahma",
    dealId: "deal-02",
    dealTitle: "Pengadaan Restock Mingguan Outlet Melati",
    type: "call",
    title: "Panggilan telepon konfirmasi jadwal kirim",
    description: "Telah disepakati pengiriman hari Rabu jam 10:00 WIB via armada pick-up.",
    status: "completed",
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "act-03",
    organizationId: "org-01",
    customerId: "cust-03",
    customerName: "Ahmad Dahlan",
    dealId: "deal-03",
    dealTitle: "Penjualan Grosir Minyak Goreng 50 Karton",
    type: "meeting",
    title: "Kunjungan outlet fisik dan penandatanganan PO",
    description: "PO diterima lengkap dan pembayaran DP 50% telah ditransfer.",
    status: "completed",
    completedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

function getStoredActivities(): ActivityDTO[] {
  if (typeof window === "undefined") return initialMockActivities;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(initialMockActivities));
      return initialMockActivities;
    }
    return JSON.parse(raw);
  } catch {
    return initialMockActivities;
  }
}

function saveStoredActivities(data: ActivityDTO[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const timelineService: TimelineRepositoryPort = {
  async getActivities(customerId?: string): Promise<ActivityDTO[]> {
    try {
      const url = customerId
        ? `/api/crm/activities?customerId=${customerId}`
        : "/api/crm/activities";
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const list = getStoredActivities();
    return customerId ? list.filter((a) => a.customerId === customerId) : list;
  },

  async createActivity(input: CreateActivityInput): Promise<ActivityDTO> {
    try {
      const res = await fetch("/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const list = getStoredActivities();
    const newAct: ActivityDTO = {
      ...input,
      id: `act-${Date.now()}`,
      status: input.status || "completed",
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newAct);
    saveStoredActivities(list);
    return newAct;
  },

  async getTimelineEvents(customerId?: string): Promise<TimelineEventDTO[]> {
    return [
      {
        id: "evt-01",
        customerId: customerId || "cust-01",
        eventType: "stage_changed",
        summary: "Deal dipindahkan ke stage 'Kirim Proposal'",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
  },
};
