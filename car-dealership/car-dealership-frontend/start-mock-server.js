const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 3001;

// Configurar middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simular endpoint de autenticación
server.post('/api/auth/token/', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'password123') {
    // Simular una respuesta exitosa
    res.status(200).json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token'
    });
  } else {
    // Simular credenciales inválidas
    res.status(400).json({
      detail: 'No active account found with the given credentials'
    });
  }
});

// Simular endpoint de perfil de usuario
server.get('/api/auth/user/', (req, res) => {
  const db = router.db.getState();
  res.status(200).json(db.profile);
});

// Usar el enrutador para otras rutas
server.use(router);

// Iniciar el servidor
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
