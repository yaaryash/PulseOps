import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type HealthResponse = {
  success: boolean;
  service: string;
  status: string;
};

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance";

type Service = {
  id: string;
  name: string;
  description?: string;
  url?: string;
  status: ServiceStatus;
};

type HealthState =
  | { type: "loading" }
  | { type: "success"; data: HealthResponse }
  | { type: "error"; message: string };

type ServicesState =
  | { type: "loading" }
  | { type: "success"; data: Service[] }
  | { type: "error"; message: string };

type ServiceForm = {
  name: string;
  url: string;
  status: ServiceStatus;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const initialForm: ServiceForm = {
  name: "",
  url: "",
  status: "operational",
};

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return fallback;
}

function App() {
  const [health, setHealth] = useState<HealthState>({ type: "loading" });
  const [services, setServices] = useState<ServicesState>({ type: "loading" });
  const [form, setForm] = useState<ServiceForm>(initialForm);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      try {
        const response = await fetch(`${apiUrl}/health`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        setHealth({ type: "success", data: (await response.json()) as HealthResponse });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setHealth({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    async function loadServices() {
      try {
        const response = await fetch(`${apiUrl}/services`, { signal: controller.signal });
        const payload = (await response.json()) as { data?: Service[]; message?: string };

        if (!response.ok || !payload.data) {
          throw new Error(getErrorMessage(payload, `API returned ${response.status}`));
        }

        setServices({ type: "success", data: payload.data });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setServices({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    void loadHealth();
    void loadServices();

    return () => controller.abort();
  }, []);

  async function handleCreateService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitError("");

    try {
      const response = await fetch(`${apiUrl}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          ...(form.url.trim() ? { url: form.url.trim() } : {}),
          status: form.status,
        }),
      });
      const payload = (await response.json()) as { data?: Service; message?: string };

      if (!response.ok || !payload.data) {
        throw new Error(getErrorMessage(payload, `API returned ${response.status}`));
      }

      setServices((current) => ({
        type: "success",
        data: current.type === "success" ? [payload.data!, ...current.data] : [payload.data!],
      }));
      setForm(initialForm);
      setSubmitState("idle");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create service");
      setSubmitState("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">PulseOps · Phase 2</p>
          <h1 id="page-title">Know what is running.</h1>
        </div>
        <p className="intro">
          Register the services your team relies on and establish the foundation for
          operational visibility.
        </p>
      </section>

      <section className="health-card" aria-live="polite">
        <div>
          <p className="card-label">Platform health</p>
          {health.type === "loading" && <p className="status">Checking API connection…</p>}
          {health.type === "success" && (
            <p className="status status--healthy">
              {health.data.service} is {health.data.status}
            </p>
          )}
          {health.type === "error" && (
            <p className="status status--error">Unable to reach API: {health.message}</p>
          )}
        </div>
        <span
          className={`status-dot ${health.type === "success" ? "status-dot--healthy" : ""}`}
          aria-hidden="true"
        />
      </section>

      <section className="services-layout" aria-labelledby="services-title">
        <div className="services-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Service registry</p>
              <h2 id="services-title">Monitored services</h2>
            </div>
            {services.type === "success" && <span className="service-count">{services.data.length}</span>}
          </div>

          {services.type === "loading" && <p className="empty-state">Loading services…</p>}
          {services.type === "error" && (
            <p className="empty-state error-text">Unable to load services: {services.message}</p>
          )}
          {services.type === "success" && services.data.length === 0 && (
            <p className="empty-state">No services registered yet. Add your first one.</p>
          )}
          {services.type === "success" && services.data.length > 0 && (
            <ul className="service-list">
              {services.data.map((service) => (
                <li className="service-row" key={service.id}>
                  <span className={`service-indicator service-indicator--${service.status}`} />
                  <div>
                    <p>{service.name}</p>
                    {service.url && (
                      <a href={service.url} rel="noreferrer" target="_blank">
                        {service.url}
                      </a>
                    )}
                  </div>
                  <span className={`status-badge status-badge--${service.status}`}>
                    {service.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="create-panel" aria-labelledby="create-title">
          <p className="eyebrow">Quick add</p>
          <h2 id="create-title">Register a service</h2>
          <form onSubmit={handleCreateService}>
            <label>
              Service name
              <input
                autoComplete="off"
                maxLength={80}
                minLength={2}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Payments API"
                required
                value={form.name}
              />
            </label>
            <label>
              Service URL <span className="optional">optional</span>
              <input
                inputMode="url"
                onChange={(event) => setForm({ ...form, url: event.target.value })}
                placeholder="https://api.example.com"
                type="url"
                value={form.url}
              />
            </label>
            <label>
              Current status
              <select
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as ServiceStatus })
                }
                value={form.status}
              >
                <option value="operational">Operational</option>
                <option value="degraded">Degraded</option>
                <option value="outage">Outage</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
            {submitState === "error" && <p className="form-error">{submitError}</p>}
            <button disabled={submitState === "submitting"} type="submit">
              {submitState === "submitting" ? "Adding service…" : "Add service"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}

export default App;
