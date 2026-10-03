import { useEffect, useState } from "react";

type HealthResponse = {
  success: boolean;
  service: string;
  status: string;
};

type HealthState =
  | { type: "loading" }
  | { type: "success"; data: HealthResponse }
  | { type: "error"; message: string };

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function App() {
  const [health, setHealth] = useState<HealthState>({ type: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function checkApiHealth() {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = (await response.json()) as HealthResponse;
        setHealth({ type: "success", data });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        setHealth({ type: "error", message });
      }
    }

    void checkApiHealth();
    return () => controller.abort();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Phase 1 · Project Foundation</p>
        <h1 id="page-title">PulseOps</h1>
        <p className="intro">
          Your operations dashboard foundation is ready. The frontend is connected
          to the API health endpoint.
        </p>
      </section>

      <section className="health-card" aria-live="polite">
        <div>
          <p className="card-label">API health</p>
          {health.type === "loading" && <p className="status">Checking connection…</p>}
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
    </main>
  );
}

export default App;
