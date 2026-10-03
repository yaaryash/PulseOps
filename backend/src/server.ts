import app from "./app";

const port = Number(process.env.PORT ?? 5000);

app.listen(port, () => {
  console.info(`PulseOps API is listening on http://localhost:${port}`);
});
