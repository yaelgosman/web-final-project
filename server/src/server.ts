import intApp from "./index";

const PORT = process.env.PORT || 3000;

intApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
