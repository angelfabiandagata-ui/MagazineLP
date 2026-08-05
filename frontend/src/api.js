// Servir los archivos estáticos de la app compilada desde /frontend/dist
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Fallback para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});