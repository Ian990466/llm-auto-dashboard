import express from "express";
import { readdir, readFile, writeFile } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DASHBOARDS_DIR = join(__dirname, "dashboards");

const app = express();
const PORT = 3001;

app.get("/api/dashboards", async (_req, res) => {
  try {
    const files = await readdir(DASHBOARDS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const list = await Promise.all(
      jsonFiles.map(async (f) => {
        try {
          const raw = await readFile(join(DASHBOARDS_DIR, f), "utf-8");
          const data = JSON.parse(raw);
          return {
            id: f.replace(/\.json$/, ""),
            title: data.meta?.title || f,
            description: data.meta?.description || "",
            generated_at: data.meta?.generated_at || "",
          };
        } catch {
          return { id: f.replace(/\.json$/, ""), title: f };
        }
      }),
    );
    res.json(list);
  } catch {
    res.json([]);
  }
});

app.get("/api/dashboards/:id", async (req, res) => {
  const { id } = req.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: "Invalid dashboard id" });
  }
  const filePath = join(DASHBOARDS_DIR, `${id}.json`);
  if (!resolve(filePath).startsWith(resolve(DASHBOARDS_DIR))) {
    return res.status(400).json({ error: "Invalid path" });
  }
  try {
    const raw = await readFile(filePath, "utf-8");
    res.json(JSON.parse(raw));
  } catch {
    res.status(404).json({ error: "Dashboard not found" });
  }
});

app.use(express.json({ limit: "2mb" }));

app.post("/api/dashboards/:id", async (req, res) => {
  const { id } = req.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: "Invalid dashboard id" });
  }
  const filePath = join(DASHBOARDS_DIR, `${id}.json`);
  if (!resolve(filePath).startsWith(resolve(DASHBOARDS_DIR))) {
    return res.status(400).json({ error: "Invalid path" });
  }
  try {
    await writeFile(filePath, JSON.stringify(req.body, null, 2), "utf-8");
    res.json({ ok: true, id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () =>
  console.log(`Dashboard API server → http://localhost:${PORT}`),
);
