# 🔗 Guía de Integración: Función Python de Análisis PII/PSI

## 📋 Estado Actual

✅ **Completado:**
- Aplicación OSDK React publicada (v0.2.0)
- Función Python `analizar_dataset_automatico` publicada (v0.2.0)
- 8 tabs funcionales en la aplicación
- Componente AnalisisAutomatico preparado con código comentado

⚙️ **Pendiente:**
- Generar SDK con la función Python en Developer Console
- Descomentar código en AnalisisAutomatico.tsx
- Publicar nueva versión (0.3.0)

---

## 🎯 Función Python Publicada

**Detalles de la Función:**
- **RID:** `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
- **Nombre:** `analizar_dataset_automatico`
- **Versión:** `0.2.0`
- **Parámetros de entrada:** `dataset_rid: String`
- **Retorna:** `String` (JSON con el análisis)

**¿Qué hace la función?**
1. Lee el schema del dataset (nombres y tipos de columnas)
2. Cuenta el número total de registros
3. Analiza cada columna detectando patrones PII/PSI
4. Clasifica por nivel de riesgo: CRÍTICO, ALTO, MEDIO, BAJO
5. Sugiere técnicas de protección (T1-T9)
6. Identifica regulaciones aplicables (GDPR, LOPD, HIPAA)

**Formato de respuesta JSON:**
```json
{
  "dataset_rid": "ri.foundry.main.dataset.xxxxx",
  "total_columns": 5,
  "total_rows": 1000,
  "success": true,
  "columns": [
    {
      "name": "dni",
      "type": "string",
      "risk": "CRITICO",
      "emoji": "🔴",
      "category": "PII_DIRECTO",
      "techniques": ["T1", "T2", "T5"],
      "regulations": ["GDPR Art.9", "LOPD"]
    }
  ]
}
```

---

## 🚀 Pasos para Completar la Integración

### PASO 1: Generar SDK en Developer Console

1. Ve a **Developer Console** en Foundry
2. Busca y abre la aplicación: **"App Análisis PII-PSI"** 
   - RID del repo: `ri.stemma.main.repository.19f8e0b0-267b-460a-9c9d-a7746de85558`
3. En el menú lateral, busca:
   - **"Ontology SDK"** o 
   - **"SDK Configuration"** o
   - **"Resources"** → **"Generate SDK"**
4. Click en **"Generate SDK"** o **"Update SDK"**
5. En la sección **"Functions"**, agregar:
   - **Función:** `analizar_dataset_automatico`
   - **Versión:** `^0.2.0` (o `0.2.0` exacta)
   - **RID:** `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
6. Click en **"Generate"** o **"Save"**
7. Espera a que el SDK se genere (puede tardar 1-2 minutos)

### PASO 2: Actualizar el Código

Una vez que el SDK esté generado, abre el archivo:

**`src/components/AnalisisAutomatico.tsx`**

1. **Descomentar** el bloque de código que dice:
```typescript
// TODO: Una vez que generes el SDK en Developer Console...
/*
// Importar la función del SDK generado
import { client } from '../client';
import { analizar_dataset_automatico } from '@ontology/sdk';
...
*/
```

2. **Comentar** o **eliminar** la sección de SIMULACIÓN que empieza con:
```typescript
// SIMULACIÓN - Remover cuando el SDK esté configurado
await new Promise(resolve => setTimeout(resolve, 2000));
const mockResult: AnalisisAutomaticoResult = { ... };
```

3. **Importar** la función al inicio del archivo:
```typescript
import { client } from '../client';
import { analizar_dataset_automatico } from '@ontology/sdk';
```

### PASO 3: Verificar Imports

El archivo debe quedar así:

```typescript
import { useState } from 'react';
import type { AnalisisAutomaticoResult } from '../types';
import { client } from '../client';
import { analizar_dataset_automatico } from '@ontology/sdk';

interface Props {
  onResultado: (resultado: AnalisisAutomaticoResult) => void;
}

export function AnalisisAutomatico({ onResultado }: Props) {
  // ... resto del código

  const handleAnalizar = async () => {
    // validaciones...
    
    try {
      // Llamar a la función Python
      const resultadoJSON = await client(analizar_dataset_automatico).executeFunction({ 
        dataset_rid: rid 
      });
      
      const resultado: AnalisisAutomaticoResult = JSON.parse(resultadoJSON);
      
      if (resultado.success) {
        onResultado(resultado);
        setError(null);
      } else {
        setError(`Error: ${resultado.error || 'Error desconocido al analizar el dataset'}`);
      }
    } catch (err) {
      setError(`Error al analizar el dataset: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // ... resto del componente
}
```

### PASO 4: Compilar y Probar

1. En **VS Code** (Code Workspaces), abre la terminal
2. Ejecuta:
```bash
npm run build
```
3. Si el build es exitoso, continúa al Paso 5
4. Si hay errores:
   - Verifica que el SDK se haya generado correctamente
   - Revisa los imports
   - Consulta los logs de error

### PASO 5: Commit y Publicar

1. Commit los cambios:
```bash
git add .
git commit -m "Integrar función Python analizar_dataset_automatico

- Actualizar AnalisisAutomatico.tsx con llamada real a función
- Remover simulación y usar función Python v0.2.0
- Agregar manejo de errores y parsing de JSON"
```

2. Push:
```bash
git push origin master
```

3. Espera a que pasen los **CI checks**

4. Publica una nueva **versión 0.3.0**:
   - En Developer Console, ve al repositorio
   - Click en **"Publish"** o **"Create Tag"**
   - Versión: **`0.3.0`** (minor release porque agregamos funcionalidad)
   - Descripción: "Integrar función Python de análisis automático"

### PASO 6: Actualizar en Developer Console

1. Ve a Developer Console → Tu aplicación
2. Click en **"Deploy"** o **"Update"**
3. Selecciona versión **`0.3.0`**
4. Despliega la aplicación

### PASO 7: Probar la Integración

1. Abre la aplicación desplegada
2. Ve al tab **"🤖 Análisis Automático"**
3. Ingresa un RID válido de un dataset real, por ejemplo:
   - `ri.foundry.main.dataset.87a6285f-8eb6-4cda-b364-f6bcd7acc366`
4. Click en **"🚀 ANALIZAR DATASET"**
5. Verifica que:
   - ✅ La función se ejecute sin errores
   - ✅ Los resultados aparezcan en el tab "🎯 Resultados"
   - ✅ Las columnas se clasifiquen correctamente por riesgo
   - ✅ Las técnicas y regulaciones se muestren

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@ontology/sdk'"

**Causa:** El SDK no se generó correctamente.

**Solución:**
1. Ve a Developer Console → SDK Configuration
2. Verifica que `analizar_dataset_automatico` esté en la lista
3. Regenera el SDK
4. Ejecuta `npm install` en el workspace

### Error: "Function not found"

**Causa:** La función no está importada correctamente en el SDK.

**Solución:**
1. Verifica que la versión sea `0.2.0` o `^0.2.0`
2. Verifica el RID: `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
3. Regenera el SDK con la función correcta

### Error al ejecutar la función

**Causa:** El dataset RID no es válido o no tienes permisos.

**Solución:**
1. Verifica que el RID comience con `ri.foundry.main.dataset.`
2. Verifica que tengas permisos de lectura sobre el dataset
3. Prueba con otro dataset

### Error de compilación

**Causa:** Tipos TypeScript incorrectos.

**Solución:**
1. Verifica que `AnalisisAutomaticoResult` esté definido en `src/types/index.ts`
2. Verifica los imports
3. Ejecuta `npm run build` para ver errores detallados

---

## 📦 Archivos Involucrados

- **`src/components/AnalisisAutomatico.tsx`** - Componente con integración
- **`src/types/index.ts`** - Tipos TypeScript
- **`src/client.ts`** - Cliente OSDK
- **`package.json`** - Dependencias
- **`foundry.config.json`** - Configuración de Foundry

---

## 🎉 Resultado Final

Al completar estos pasos tendrás:

✅ **Análisis Automático Real**: Llamando a función Python que lee datasets reales  
✅ **Detección PII/PSI**: Clasificación automática por nombre de columna  
✅ **Niveles de Riesgo**: CRÍTICO, ALTO, MEDIO, BAJO  
✅ **Técnicas Sugeridas**: T1-T9 según el tipo de dato  
✅ **Regulaciones**: GDPR, LOPD, HIPAA identificadas  
✅ **Análisis Manual**: Cuestionario completo funcional  
✅ **Recetas y Técnicas**: Catálogos completos  
✅ **Aplicación Profesional**: Lista para producción  

---

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa los logs en Developer Console
2. Verifica la versión de la función (debe ser 0.2.0)
3. Asegúrate de que el SDK se haya generado correctamente
4. Consulta la documentación de OSDK React Applications

**Función Python RID (cópialo):**
```
ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510
```

**Repositorio React RID:**
```
ri.stemma.main.repository.19f8e0b0-267b-460a-9c9d-a7746de85558
```

---

**¡Buena suerte! 🚀**
