# 🚨 SOLUCIÓN AL ERROR 404 - Función No Accesible

## 📊 Diagnóstico del Problema

Según el Debug Log de tu aplicación:
```
📡 Status: 404
❌ Método 1: Falló
❌ Método 2: Falló  
❌ Método 3: Falló
```

**Error 404 = "Not Found"** en TODOS los métodos significa:

### ❌ **LA FUNCIÓN Y LA APLICACIÓN ESTÁN EN ONTOLOGÍAS DIFERENTES**

Esto es el problema principal. En Foundry, las funciones Python Query solo son accesibles desde aplicaciones que:
1. Están en la **misma Ontología** que la función
2. O tienen acceso a una **Ontología compartida** donde está la función
3. Y tienen los **permisos correctos**

---

## ✅ SOLUCIÓN DEFINITIVA - Paso a Paso

### **OPCIÓN 1: Verificar y Alinear Ontologías** (RECOMENDADO)

#### Paso 1: Identificar la Ontología de la Función

1. Ve a **Ontology Manager**
2. Busca la función: `analizarDatasetAutomatico`
3. Abre la función y mira en qué **Ontología** está
4. Anota el nombre de la Ontología (ejemplo: "EYSA Ontology", "Production Ontology", etc.)

#### Paso 2: Identificar la Ontología de la Aplicación

1. Ve a **Developer Console**
2. Abre tu aplicación: "App Análisis PII-PSI"
3. En la sección "Ontology SDK" o "Resources", verifica qué Ontología tiene configurada
4. Anota el nombre de la Ontología

#### Paso 3: Comparar y Alinear

**Si son DIFERENTES:**

**Opción A: Mover la Aplicación a la Ontología de la Función**
1. En Developer Console, cambia la Ontología de la aplicación
2. Regenera el SDK
3. Republica la aplicación

**Opción B: Mover la Función a la Ontología de la Aplicación** (MÁS FÁCIL)
1. Ve al repositorio de Python Functions
2. Verifica la configuración de Ontología
3. Publica la función en la Ontología correcta

**Opción C: Usar una Ontología Compartida**
1. Crea o usa una Ontología compartida existente
2. Mueve tanto la función como la aplicación a esa Ontología
3. Configura los permisos adecuados

---

### **OPCIÓN 2: Añadir Permisos de Ejecución**

Incluso si están en la misma Ontología, puede fallar por permisos:

1. Ve a **Ontology Manager**
2. Busca y abre: `analizarDatasetAutomatico`
3. Ve a la pestaña **"Permissions"** o **"Roles"**
4. Añade permiso de **"Execute"** para:
   - Tu usuario personal
   - La aplicación (usando su Application RID)
   - Un grupo de usuarios
5. Guarda los cambios

**Application RID:**
```
ri.third-party-applications.main.application.19cd33c0-5e30-41f8-9c44-69e372825c4b
```

---

### **OPCIÓN 3: Solución Alternativa - Implementar Lógica Localmente**

Si no puedes resolver el problema de Ontologías/permisos, puedes implementar la lógica de análisis directamente en TypeScript:

#### Ventajas:
- ✅ No depende de la función Python
- ✅ Funciona siempre
- ✅ Más rápido (sin llamadas de red)
- ✅ Sin problemas de permisos/ontologías

#### Desventajas:
- ❌ No lee el schema real del dataset (debes ingresar manualmente)
- ❌ Duplicación de lógica
- ❌ No usa Spark para análisis de datos

¿Quieres que implemente esta alternativa?

---

## 🔍 Cómo Verificar si el Problema se Resolvió

Después de aplicar cualquiera de las soluciones, sigue estos pasos:

### 1. Despliega la Nueva Versión

Esta nueva versión incluye:
- ✅ Mejor autenticación usando OSDK client
- ✅ Debug log mejorado
- ✅ Documentación inline del problema

### 2. Prueba la Aplicación

1. Abre la aplicación
2. Ingresa un dataset RID
3. Click "🚀 ANALIZAR DATASET"
4. **Observa el Debug Log**

### 3. Interpreta los Resultados

#### ✅ **SI FUNCIONA:**
```
🔑 Obteniendo token de autenticación...
✅ Token obtenido correctamente
🔄 Método SDK: Usando Foundry SDK Client
📍 URL: https://eysa.palantirfoundry.com/api/v2/functions/...
📦 Parámetros: { dataset_rid: "ri.foundry..." }
📡 Status: 200 OK
✅ Método SDK: Exitoso!
✅ ¡Análisis completado exitosamente!
```

#### ❌ **SI SIGUE FALLANDO CON 404:**
```
📡 Status: 404 Not Found
❌ Método SDK: Falló
```
→ Confirma que las Ontologías son diferentes
→ Aplica la Opción 1 arriba

#### ❌ **SI FALLA CON 403:**
```
📡 Status: 403 Forbidden
❌ Método SDK: Falló
```
→ Es un problema de permisos
→ Aplica la Opción 2 arriba

---

## 📋 Checklist de Diagnóstico

Usa este checklist para identificar exactamente dónde está el problema:

### Estado de la Función:
- [x] ✅ Función publicada (v0.2.1)
- [x] ✅ Tiene `api_name` configurado
- [ ] ❓ ¿Está en la misma Ontología que la aplicación?
- [ ] ❓ ¿Tiene permisos de Execute?

### Estado de la Aplicación:
- [x] ✅ Aplicación desplegada (v0.3.1)
- [x] ✅ Código actualizado con autenticación OSDK
- [ ] ❓ ¿Qué Ontología tiene configurada?
- [ ] ❓ ¿Puede acceder a la Ontología de la función?

### Permisos:
- [ ] ❓ ¿Tu usuario tiene acceso a la función?
- [ ] ❓ ¿La aplicación tiene Execute permission?
- [ ] ❓ ¿El dataset es accesible?

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### 1. **AHORA - Mergea el Nuevo PR**
   - El código está mejorado con mejor autenticación
   - Incluye diagnóstico inline del problema
   - Despliega versión 0.3.2 o superior

### 2. **INVESTIGAR - Verifica Ontologías**
   ```
   FUNCIÓN:     ¿En qué Ontología está?
   APLICACIÓN:  ¿En qué Ontología está?
   IGUALES:     [ ] SÍ  [ ] NO
   ```

### 3. **RESOLVER - Aplica la Solución**
   - Si son diferentes → Opción 1 (alinear ontologías)
   - Si son iguales → Opción 2 (añadir permisos)
   - Si no puedes → Opción 3 (implementar localmente)

### 4. **PROBAR - Verifica el Fix**
   - Ingresa dataset RID
   - Observa Debug Log
   - ¿Status 200 o 404/403?

---

## 📞 Información para Soporte

Si necesitas contactar a Soporte de Palantir, proporciona:

**Función Python:**
- RID: `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
- Nombre: `analizar_dataset_automatico`
- API Name: `analizarDatasetAutomatico`
- Versión: 0.2.1
- Repositorio: `ri.stemma.main.repository.47bf78b2-a987-4cc8-bfb2-aeced129bc49`

**Aplicación React:**
- RID: `ri.third-party-applications.main.application.19cd33c0-5e30-41f8-9c44-69e372825c4b`
- Nombre: App Análisis PII-PSI
- Repositorio: `ri.stemma.main.repository.19f8e0b0-267b-460a-9c9d-a7746de85558`

**Error:**
- Código: 404 Not Found
- Endpoint probado: `/api/v2/functions/{functionRid}/execute`
- Autenticación: Bearer token via OSDK client
- Contexto: Función Python Query no accesible desde aplicación React

**Pregunta específica:**
"¿Cómo puedo verificar que la función Python y la aplicación React están en la misma Ontología, y cómo puedo moverlas si no lo están?"

---

## 📚 Documentación Útil

- [Ontology Overview](https://www.palantir.com/docs/foundry/ontology/overview/)
- [Function Permissions](https://www.palantir.com/docs/foundry/object-permissioning/ontology-permissions/)
- [Query Functions](https://www.palantir.com/docs/foundry/functions/query-functions/)
- [Developer Console Setup](https://www.palantir.com/docs/foundry/developer-console/create-application/)

---

**Última actualización:** 2026-01-26  
**Branch:** ai-fde/fix-404-errors  
**Status:** ⚠️ Código mejorado - Pendiente alinear Ontologías
