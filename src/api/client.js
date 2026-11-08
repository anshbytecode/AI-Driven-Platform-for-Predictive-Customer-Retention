// API Client for Meridian AI-Driven Retention Platform
// Connects to Express + PostgreSQL backend with graceful fallback

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', database_connected: false, error: err.message };
  }
}

export async function fetchCustomers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/customers?${query}`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Backend fetch failed, falling back to local dataset:', err.message);
    return null;
  }
}

export async function fetchCustomerById(id) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch customer 360');
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error fetching customer detail:', err);
    return null;
  }
}

export async function updateCustomer(id, data) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error updating customer:', err);
    return null;
  }
}

export async function createCustomer(data) {
  try {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error creating customer:', err);
    return null;
  }
}

export async function fetchXaiGlobal() {
  try {
    const res = await fetch(`${API_BASE}/xai/global/importance`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchXaiCustomer(customerId) {
  try {
    const res = await fetch(`${API_BASE}/xai/${customerId}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSegmentationClusters() {
  try {
    const res = await fetch(`${API_BASE}/segmentation/clusters`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEarlyWarnings() {
  try {
    const res = await fetch(`${API_BASE}/early-warnings`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchClvOverview() {
  try {
    const res = await fetch(`${API_BASE}/clv/overview`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRecommendations() {
  try {
    const res = await fetch(`${API_BASE}/recommendations/all`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchUplift(customerId) {
  try {
    const res = await fetch(`${API_BASE}/recommendations/uplift/${customerId}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function runWhatIfSimulation(payload) {
  try {
    const res = await fetch(`${API_BASE}/simulator/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRevenueRisk() {
  try {
    const res = await fetch(`${API_BASE}/revenue-risk/overview`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/campaigns`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createCampaign(data) {
  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAbTests() {
  try {
    const res = await fetch(`${API_BASE}/ab-testing`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchNlpSentiment() {
  try {
    const res = await fetch(`${API_BASE}/nlp/sentiment`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function queryCopilotAi(query) {
  try {
    const res = await fetch(`${API_BASE}/copilot/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRagDocs() {
  try {
    const res = await fetch(`${API_BASE}/rag/documents`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchFraudSentinel() {
  try {
    const res = await fetch(`${API_BASE}/fraud/sentinel`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRealtimeEvents() {
  try {
    const res = await fetch(`${API_BASE}/realtime/events`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function simulateRealtimeEvent(eventData) {
  try {
    const res = await fetch(`${API_BASE}/realtime/simulate-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchModelMonitoring() {
  try {
    const res = await fetch(`${API_BASE}/monitoring/metrics`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/security/audit-logs`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function logAuditAction(payload) {
  try {
    await fetch(`${API_BASE}/security/audit-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // silent
  }
}

// Database Studio (Neon/Supabase Table Explorer)
export async function fetchDatabaseTables() {
  try {
    const res = await fetch(`${API_BASE}/database/tables`);
    if (!res.ok) throw new Error('Failed to fetch database tables');
    return await res.json();
  } catch (err) {
    console.warn('[API Client] Error fetching DB tables:', err);
    return null;
  }
}

export async function fetchDatabaseTableRows(tableName) {
  try {
    const res = await fetch(`${API_BASE}/database/tables/${tableName}`);
    if (!res.ok) throw new Error(`Failed to fetch rows for ${tableName}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Error fetching rows for ${tableName}:`, err);
    return null;
  }
}

