# 🧪 Guía de Testing y Deployment - Foro Ángeles y Demonios

**Fecha:** 11 Diciembre 2024  
**Versión:** 1.0.0  
**Status:** ✅ Todas las fases completadas

---

## 📋 Testing Checklist

### ✅ Testing Funcional Básico

#### 1. Crear Posts
- [ ] Abrir http://localhost:8081/forum
- [ ] Click en "Nuevo Post"
- [ ] Llenar título (ej: "Excelente experiencia")
- [ ] Llenar comentario (ej: "Todo muy profesional...")
- [ ] Click "Publicar"
- [ ] **Verificar:**
  - ✅ Toast verde "¡Post publicado exitosamente!"
  - ✅ Post aparece al inicio de la lista
  - ✅ Estadísticas incrementan (Total Posts +1)
  - ✅ Modal se cierra automáticamente

#### 2. Cargar Posts desde BD
- [ ] Recargar página (F5)
- [ ] **Verificar:**
  - ✅ Loading spinner aparece
  - ✅ Consola muestra "🔄 Cargando posts desde BD..."
  - ✅ Posts se cargan correctamente
  - ✅ Consola muestra "✅ X posts cargados desde BD"
  - ✅ Estadísticas muestran datos correctos

#### 3. Sistema de Votación - Agregar Voto
- [ ] Click en 👍 de cualquier post
- [ ] **Verificar:**
  - ✅ Toast verde "👍 Like agregado"
  - ✅ Contador de likes +1
  - ✅ Botón de like cambia a estado activo (dorado)
  - ✅ Estadísticas actualizan (Total Likes +1)
  - ✅ Consola: "🗳️ Votando: postId=X..."
  - ✅ Consola: "✅ Respuesta del servidor: {action: 'added'}"

#### 4. Sistema de Votación - Remover Voto
- [ ] Click en 👍 del mismo post (ya votado)
- [ ] **Verificar:**
  - ✅ Toast azul "Like removido"
  - ✅ Contador de likes -1
  - ✅ Botón vuelve a estado normal
  - ✅ Estadísticas actualizan (Total Likes -1)
  - ✅ Consola: "➖ Voto removido: like"

#### 5. Sistema de Votación - Cambiar Voto
- [ ] Click en 👍 de un post
- [ ] Click en 👎 del mismo post
- [ ] **Verificar:**
  - ✅ Toast azul "Cambiado a 👎 Dislike"
  - ✅ Contador likes -1, dislikes +1
  - ✅ Botón like normal, botón dislike activo
  - ✅ Estadísticas actualizan
  - ✅ Consola: "🔄 Voto actualizado: like → dislike"

#### 6. Persistencia de Datos
- [ ] Votar en 3-5 posts diferentes
- [ ] Recargar página (F5)
- [ ] **Verificar:**
  - ✅ Votos persisten (botones activos correctos)
  - ✅ Contadores mantienen valores
  - ✅ Estadísticas correctas

---

### 🔍 Testing de Filtros

#### 7. Filtro por Categoría
- [ ] Click en tab "Clientes"
- [ ] **Verificar:**
  - ✅ Solo posts de categoría "Clientes"
  - ✅ Tab resaltado
  - ✅ Estadísticas actualizan (solo posts visibles)

- [ ] Click en tab "Chicas"
- [ ] **Verificar:**
  - ✅ Solo posts de categoría "Chicas"

- [ ] Click en "Todos"
- [ ] **Verificar:**
  - ✅ Todos los posts visibles

#### 8. Filtro por Ciudad
- [ ] Click en dropdown "Todas las ciudades"
- [ ] Seleccionar una ciudad
- [ ] **Verificar:**
  - ✅ Dropdown muestra ciudad seleccionada
  - ✅ Solo posts de esa ciudad

#### 9. Ordenamiento
- [ ] Probar "Más recientes"
  - ✅ Posts ordenados por fecha (más nuevo primero)

- [ ] Probar "Más votados"
  - ✅ Posts ordenados por likes (mayor primero)

- [ ] Probar "Más populares"
  - ✅ Posts ordenados por (likes - dislikes)

- [ ] Probar "Más comentados"
  - ✅ Posts ordenados por cantidad comentarios

---

### 🛡️ Testing de Errores y Fallbacks

#### 10. Backend Offline
- [ ] Apagar backend (Ctrl+C en terminal del backend)
- [ ] Recargar página del foro
- [ ] **Verificar:**
  - ✅ Toast azul "Usando caché local (sin conexión)"
  - ✅ Posts se cargan desde localStorage
  - ✅ Mensaje error con botón "Reintentar"
  - ✅ Consola: "❌ Error al cargar posts"
  - ✅ Consola: "📦 Posts cargados desde localStorage (fallback)"

#### 11. Reintentar Conexión
- [ ] Encender backend nuevamente
- [ ] Click en botón "Reintentar"
- [ ] **Verificar:**
  - ✅ Loading spinner aparece
  - ✅ Posts se cargan desde BD
  - ✅ Error desaparece

#### 12. Error al Votar (sin conexión)
- [ ] Apagar backend
- [ ] Intentar votar en un post
- [ ] **Verificar:**
  - ✅ Toast rojo "Error al votar. Intenta nuevamente."
  - ✅ Contador NO cambia
  - ✅ Consola: "❌ Error al votar"

#### 13. Error al Publicar (sin conexión)
- [ ] Backend apagado
- [ ] Intentar crear post
- [ ] **Verificar:**
  - ✅ Toast rojo con mensaje error
  - ✅ Modal NO se cierra
  - ✅ Datos del formulario NO se pierden
  - ✅ Usuario puede corregir/reintentar

---

### 🧹 Testing de Limpieza de Caché

#### 14. Limpiar Caché Local
- [ ] Click en botón "Limpiar Caché"
- [ ] **Verificar:**
  - ✅ Aparece confirmación
  - ✅ Mensaje: "¿Deseas limpiar el caché local?"

- [ ] Click "Cancelar"
  - ✅ No pasa nada

- [ ] Click nuevamente "Limpiar Caché"
- [ ] Click "Aceptar"
- [ ] **Verificar:**
  - ✅ Toast verde "Caché limpiado correctamente"
  - ✅ Loading spinner (recargando desde BD)
  - ✅ Posts se recargan correctamente
  - ✅ localStorage vacío (dev tools → Application → Local Storage)
  - ✅ Consola: "🧹 Caché local limpiado"

---

### 📊 Testing de Estadísticas

#### 15. Estadísticas en Tiempo Real
- [ ] Observar 4 cards de estadísticas
- [ ] Crear un post
  - ✅ Total Posts incrementa

- [ ] Votar like en 3 posts
  - ✅ Total Likes incrementa +3

- [ ] Votar dislike en 2 posts
  - ✅ Total Dislikes incrementa +2

- [ ] Remover un like
  - ✅ Total Likes decrementa -1

- [ ] Cambiar un like a dislike
  - ✅ Total Likes -1, Total Dislikes +1

---

### 🎨 Testing de UI/UX

#### 16. Notificaciones Toast
- [ ] Verificar animación suave (entrada desde arriba)
- [ ] Verificar auto-cierre en 3 segundos
- [ ] Click en X para cerrar manualmente
  - ✅ Toast se cierra inmediatamente

- [ ] Verificar colores:
  - ✅ Success: verde
  - ✅ Error: rojo
  - ✅ Info: azul

#### 17. Loading States
- [ ] Al cargar posts:
  - ✅ Spinner dorado girando
  - ✅ Texto "Cargando posts..."

- [ ] Al publicar post:
  - ✅ Botón muestra spinner
  - ✅ Botón deshabilitado
  - ✅ Texto "Publicando..."

#### 18. Responsive Design
- [ ] Desktop (> 1024px)
  - ✅ Layout correcto
  - ✅ Hover effects funcionan

- [ ] Tablet (768px - 1024px)
  - ✅ Layout ajustado
  - ✅ Estadísticas en 4 columnas

- [ ] Mobile (< 768px)
  - ✅ Layout stack vertical
  - ✅ Botones tamaño táctil
  - ✅ Estadísticas en 2 columnas

---

### 🔄 Testing de Sincronización

#### 19. Sincronización BD ↔ localStorage
- [ ] Crear post → Verificar en phpMyAdmin tabla `posts`
- [ ] Votar → Verificar en phpMyAdmin tabla `post_likes`
- [ ] Recargar página → Verificar localStorage tiene datos actualizados
- [ ] Limpiar caché → Verificar localStorage vacío pero BD intacta

#### 20. Integridad de Datos
- [ ] **Verificar en phpMyAdmin:**
  ```sql
  SELECT * FROM posts ORDER BY id DESC LIMIT 5;
  SELECT * FROM post_likes;
  SELECT p.id, p.title, p.likes, p.dislikes, 
         COUNT(pl.id) as votos_registrados
  FROM posts p
  LEFT JOIN post_likes pl ON p.id = pl.post_id
  GROUP BY p.id;
  ```
- [ ] Contadores de likes/dislikes coinciden con registros en `post_likes`

---

## 🚀 Guía de Deployment

### Preparación Pre-Deploy

#### 1. Variables de Entorno
```javascript
// frontend/src/config/api.js
export const API_URL_DEV = "http://localhost:3000";
export const API_URL_PROD = "https://api.easyventas.cl"; // Tu dominio

export const API_URL_CURRENT = 
  process.env.NODE_ENV === "production" 
    ? API_URL_PROD 
    : API_URL_DEV;
```

#### 2. Build del Frontend
```bash
cd frontend
pnpm install
pnpm run build
```

#### 3. Verificar Build
```bash
# Verificar carpeta dist/ creada
ls dist/

# Probar build localmente
pnpm run preview
```

---

### Configuración Backend en Producción

#### 1. Variables de Entorno (.env)
```env
# Backend Production
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_segura
DB_NAME=foroayd_prod
PORT=3000
NODE_ENV=production
```

#### 2. CORS en Producción
```javascript
// backend-foroAyD/index.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://easyventas.cl'  // Tu dominio
    : 'http://localhost:8081',
  credentials: true
};

app.use(cors(corsOptions));
```

#### 3. PM2 para Backend
```bash
# Instalar PM2
npm install -g pm2

# Iniciar backend con PM2
cd backend-foroAyD
pm2 start index.js --name "foro-backend"

# Configurar auto-start
pm2 startup
pm2 save

# Ver logs
pm2 logs foro-backend

# Ver status
pm2 status
```

---

### Deploy en Servidor (VPS/Hosting)

#### Opción A: VPS (Ubuntu/Debian)

**1. Instalar dependencias:**
```bash
# Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL
sudo apt install mysql-server

# Nginx
sudo apt install nginx
```

**2. Configurar MySQL:**
```bash
sudo mysql
CREATE DATABASE foroayd_prod;
CREATE USER 'foro_user'@'localhost' IDENTIFIED BY 'password_segura';
GRANT ALL PRIVILEGES ON foroayd_prod.* TO 'foro_user'@'localhost';
FLUSH PRIVILEGES;

# Importar estructura
mysql -u foro_user -p foroayd_prod < estructura.sql
```

**3. Subir backend:**
```bash
scp -r backend-foroAyD/ usuario@tuservidor:/var/www/
cd /var/www/backend-foroAyD
npm install --production
pm2 start index.js --name foro-backend
```

**4. Configurar Nginx:**
```nginx
# /etc/nginx/sites-available/foro
server {
    listen 80;
    server_name easyventas.cl www.easyventas.cl;

    # Frontend
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/foro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. SSL con Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d easyventas.cl -d www.easyventas.cl
```

---

#### Opción B: Hosting Compartido

**1. Build y comprimir:**
```bash
cd frontend
pnpm run build
tar -czf frontend-build.tar.gz dist/
```

**2. Subir vía FTP:**
- Subir contenido de `dist/` a `public_html/`
- Subir `backend-foroAyD/` a carpeta fuera de public_html

**3. Configurar .htaccess:**
```apache
# public_html/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Proxy para API
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

---

### Checklist Post-Deploy

- [ ] ✅ Frontend accesible en https://tudominio.com
- [ ] ✅ API responde en https://tudominio.com/api/test
- [ ] ✅ Base de datos conectada
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ SSL activo (candado verde)
- [ ] ✅ Crear post funciona
- [ ] ✅ Cargar posts funciona
- [ ] ✅ Votar funciona
- [ ] ✅ Estadísticas actualizan
- [ ] ✅ Toast notifications aparecen
- [ ] ✅ Responsive en móviles
- [ ] ✅ PM2 ejecutando backend
- [ ] ✅ Nginx sirviendo frontend
- [ ] ✅ Logs monitoreados: `pm2 logs`

---

### Monitoreo Post-Deploy

**1. Logs del Backend:**
```bash
pm2 logs foro-backend --lines 100
```

**2. Logs de Nginx:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**3. Estado del servidor:**
```bash
pm2 status
systemctl status nginx
systemctl status mysql
```

**4. Base de datos:**
```sql
-- Verificar posts recientes
SELECT id, title, created_at FROM posts ORDER BY created_at DESC LIMIT 10;

-- Verificar votos
SELECT COUNT(*) as total_votos FROM post_likes;

-- Estadísticas
SELECT 
  COUNT(DISTINCT p.id) as total_posts,
  SUM(p.likes) as total_likes,
  SUM(p.dislikes) as total_dislikes
FROM posts p;
```

---

### Troubleshooting Común

#### Error: CORS en producción
```javascript
// backend-foroAyD/index.js
const allowedOrigins = [
  'http://localhost:8081',
  'https://easyventas.cl',
  'https://www.easyventas.cl'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### Error: Conexión a BD en producción
```javascript
// Verificar pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

#### Error: Frontend no carga en subdirectorio
```javascript
// vite.config.js
export default {
  base: '/foro/', // Si está en /foro/
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
};
```

---

## 📝 Notas Finales

### Mantenimiento Regular
- **Diario:** Verificar logs de errores
- **Semanal:** Revisar estadísticas de uso
- **Mensual:** Backup de base de datos
  ```bash
  mysqldump -u root -p foroayd_prod > backup_$(date +%Y%m%d).sql
  ```

### Próximas Mejoras (Futuro)
- [ ] Sistema de comentarios en posts
- [ ] Autenticación de usuarios real (no test)
- [ ] Subir imágenes en posts
- [ ] Notificaciones push
- [ ] Moderación de contenido
- [ ] Sistema de reputación
- [ ] Búsqueda en posts

### Soporte
- **Backend API:** `http://localhost:3000/api/test`
- **Frontend:** `http://localhost:8081/forum`
- **Base de Datos:** MAMP/MySQL - phpMyAdmin

---

**✅ Sistema Listo para Producción!**

Todas las fases completadas exitosamente. El foro está funcional, optimizado y listo para usuarios reales.

