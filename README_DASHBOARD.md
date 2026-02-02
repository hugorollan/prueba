# Dashboard de Métricas de Aparcamientos - Valencia

## 📋 Resumen del Proyecto

Dashboard profesional en React + TypeScript para visualizar métricas agregadas de aparcamientos en Valencia. Diseñado con arquitectura limpia, componentes reutilizables y datos mock para desarrollo sin backend.

---

## 🏗️ Estructura de Carpetas

```
src/
├── types/
│   └── parking.types.ts          # Tipos TypeScript para el dominio
├── data/
│   └── mockParkingData.ts        # Datos mock de ejemplo
├── hooks/
│   ├── useParkingData.ts         # Hook para gestionar carga de datos
│   └── useParkingMetrics.ts      # Hook para calcular métricas agregadas
├── components/
│   ├── KPICard/
│   │   ├── KPICard.tsx           # Tarjeta de KPI reutilizable
│   │   └── KPICard.css
│   ├── BarChart/
│   │   ├── BarChart.tsx          # Gráfico de barras
│   │   └── BarChart.css
│   ├── PieChart/
│   │   ├── PieChart.tsx          # Gráfico circular
│   │   └── PieChart.css
│   ├── ParkingTable/
│   │   ├── ParkingTable.tsx      # Tabla con ordenación y paginación
│   │   └── ParkingTable.css
│   ├── LoadingSpinner/
│   │   ├── LoadingSpinner.tsx    # Estado de carga
│   │   └── LoadingSpinner.css
│   └── ErrorMessage/
│       ├── ErrorMessage.tsx      # Manejo de errores
│       └── ErrorMessage.css
├── pages/
│   └── ParkingDashboard/
│       ├── ParkingDashboard.tsx  # Página principal del dashboard
│       └── ParkingDashboard.css
├── App.tsx                        # Componente raíz
└── App.css                        # Estilos globales
```

---

## 🔧 Tipos de Datos (TypeScript)

### Interfaz Principal: `Parking`

```typescript
interface Parking {
  parkingId: string;           // ID único del aparcamiento
  parkingName: string;         // Nombre descriptivo
  district: string;            // Distrito de Valencia
  parkingType: 'UNDERGROUND' | 'SURFACE';  // Tipo
  totalSpaces: number;         // Número total de plazas
  latitude: number;            // Coordenada geográfica
  longitude: number;           // Coordenada geográfica
  source: string;              // Origen de los datos
  ingestTimestamp: Date;       // Fecha de ingesta
}
```

### Métricas Calculadas: `KPIMetrics`

```typescript
interface KPIMetrics {
  totalParkings: number;       // Total de aparcamientos
  totalSpaces: number;         // Total de plazas
  averageSpaces: number;       // Media de plazas
  topDistrict: {               // Distrito con más plazas
    name: string;
    spaces: number;
  };
}
```

---

## 🎨 Componentes Principales

### 1. **KPICard** - Tarjeta de Métricas

Componente reutilizable para mostrar indicadores clave.

**Props:**
```typescript
{
  title: string;              // Título del KPI
  value: string | number;     // Valor principal
  subtitle?: string;          // Subtítulo opcional
  icon?: ReactNode;           // Icono opcional
  color?: 'blue' | 'green' | 'purple' | 'orange';
}
```

**Uso:**
```tsx
<KPICard
  title="Total Aparcamientos"
  value={150}
  icon="🅿️"
  color="blue"
/>
```

---

### 2. **BarChart** - Gráfico de Barras

Visualización de datos categóricos (plazas por distrito).

**Props:**
```typescript
{
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
}
```

---

### 3. **PieChart** - Gráfico Circular

Distribución porcentual (tipo de aparcamiento).

**Props:**
```typescript
{
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title?: string;
}
```

---

### 4. **ParkingTable** - Tabla Interactiva

Tabla con ordenación, paginación y búsqueda.

**Características:**
- ✅ Ordenación por columnas (click en header)
- ✅ Paginación (10 items por página)
- ✅ Badges visuales para tipo de parking
- ✅ Formato de fechas localizado

---

## 🔄 Hooks Personalizados

### `useParkingData`

Gestiona la carga de datos con estados de loading/error.

```typescript
const { data, loading, error, lastUpdate, refetch } = useParkingData();
```

**Retorna:**
- `data`: Array de aparcamientos o null
- `loading`: Boolean indicando carga
- `error`: Mensaje de error o null
- `lastUpdate`: Timestamp de última actualización
- `refetch`: Función para recargar datos

---

### `useParkingMetrics`

Calcula métricas agregadas de forma eficiente (memoización).

```typescript
const { kpis, districtData, typeDistribution } = useParkingMetrics(data);
```

**Retorna:**
- `kpis`: Métricas principales (total, media, top)
- `districtData`: Agregación por distrito
- `typeDistribution`: Distribución por tipo

---

## 📊 Datos Mock

12 aparcamientos de ejemplo con distribución realista:

- **Distritos:** Centro, Ruzafa, Poblados Marítimos, Benimaclet, Campanar, Quatre Carreres
- **Tipos:** 8 subterráneos, 4 superficie
- **Rango de plazas:** 150-600 plazas
- **Coordenadas:** Ubicaciones reales de Valencia

---

## 🎯 Características Implementadas

### ✅ KPIs Principales
1. **Total de aparcamientos**
2. **Plazas totales disponibles**
3. **Media de plazas por aparcamiento**
4. **Distrito con más plazas**

### ✅ Visualizaciones
- **Gráfico de barras:** Plazas por distrito
- **Gráfico circular:** Distribución underground vs. surface

### ✅ Tabla Detallada
- Listado completo de aparcamientos
- Ordenación por todas las columnas
- Paginación inteligente
- Última actualización visible

### ✅ Estados de UI
- **Loading:** Spinner animado durante carga
- **Error:** Mensaje amigable con opción de reintentar
- **Última actualización:** Timestamp en tiempo real
- **Botón de actualización manual**

---

## 🚀 Decisiones de Diseño

### 1. **Arquitectura Limpia (Clean Architecture)**

**Separación de responsabilidades:**
- **`types/`**: Definiciones de tipos (independientes de UI)
- **`data/`**: Fuente de datos (mock, fácilmente reemplazable)
- **`hooks/`**: Lógica de negocio reutilizable
- **`components/`**: UI pura sin lógica de negocio
- **`pages/`**: Composición de componentes

**Ventajas:**
- ✅ Fácil migración a API real (solo cambiar hooks)
- ✅ Componentes 100% reutilizables
- ✅ Testing independiente de cada capa

---

### 2. **Componentes Funcionales + Hooks**

**Uso de React moderno:**
```typescript
// Estado local con useState
const [sortField, setSortField] = useState<SortField>('totalSpaces');

// Cálculos optimizados con useMemo
const kpis = useMemo(() => calculateKPIs(data), [data]);

// Efectos con useEffect
useEffect(() => {
  fetchData();
}, []);
```

**Ventajas:**
- ✅ Código más limpio y legible
- ✅ Mejor rendimiento (memoización)
- ✅ Hooks personalizados reutilizables

---

### 3. **TypeScript Estricto**

**Tipado completo:**
- Interfaces para todas las entidades
- Props tipadas en componentes
- Tipos genéricos en hooks (`DataState<T>`)
- Enums para valores fijos (`ParkingType`)

**Ventajas:**
- ✅ Detección de errores en desarrollo
- ✅ Autocompletado en IDE
- ✅ Documentación implícita

---

### 4. **Diseño Responsive**

**Grid layout + Media queries:**
```css
.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  /* Adaptación móvil */
}
```

**Ventajas:**
- ✅ Funciona en desktop, tablet, móvil
- ✅ Grid automático sin librerías

---

### 5. **Estados de Carga Realistas**

**Simulación de API:**
```typescript
// Delay artificial de 1.5s
await new Promise(resolve => setTimeout(resolve, 1500));

// Simulación de errores aleatorios (5%)
if (Math.random() < 0.05) {
  throw new Error('Error al cargar datos');
}
```

**Ventajas:**
- ✅ Testing de estados de loading/error
- ✅ UX preparada para condiciones reales

---

### 6. **Sin Librerías de Gráficos (Básico)**

**Gráficos custom con SVG/CSS:**
- Implementación simple para demostración
- **Recomendación para producción:** Usar **Chart.js**, **Recharts** o **Victory**

**Por qué custom:**
- ✅ Control total del diseño
- ✅ Aprendizaje de fundamentos
- ❌ No ideal para gráficos complejos

---

## 🔄 Migración a API Real

Para conectar con un backend real, solo necesitas modificar `useParkingData.ts`:

```typescript
// Reemplazar mock por fetch
const response = await fetch('/api/parkings');
const data = await response.json();
setState({
  data: data.parkings,
  loading: false,
  error: null,
  lastUpdate: new Date(),
});
```

**El resto del código NO cambia** (separación de responsabilidades).

---

## 📦 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Build para producción
npm run build
```

---

## 🎨 Paleta de Colores

- **Azul primario:** `#3b82f6` (KPIs, barras)
- **Verde:** `#10b981` (Métricas positivas)
- **Púrpura:** `#8b5cf6` (Destacados)
- **Naranja:** `#f59e0b` (Alertas)
- **Fondo:** Gradiente `#667eea → #764ba2`

---

## 🚀 Próximos Pasos (Sugerencias)

1. **Filtros interactivos:**
   - Por distrito
   - Por tipo de parking
   - Rango de plazas

2. **Mapa geográfico:**
   - Integración con Leaflet/Mapbox
   - Markers con info de aparcamientos

3. **Gráficos avanzados:**
   - Evolución temporal (líneas)
   - Heatmap de ocupación

4. **Exportación de datos:**
   - CSV/Excel
   - PDF con gráficos

5. **Modo oscuro:**
   - Toggle dark/light theme

6. **Búsqueda/filtrado:**
   - Búsqueda por nombre
   - Filtros combinados

---

## 📚 Recursos y Referencias

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Chart.js](https://www.chartjs.org/) (recomendado para producción)
- [Recharts](https://recharts.org/) (alternativa React-friendly)

---

## 👨‍💻 Contacto y Soporte

Para dudas o mejoras, contactar con el equipo de desarrollo.

---

**¡Dashboard listo para uso y extensión! 🎉**
