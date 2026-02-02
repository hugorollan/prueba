# 🔧 Instrucciones para Completar la Integración de la Función Python

## 📋 Resumen del Problema

Tu aplicación React está intentando llamar a una función Python, pero **la función no está accesible desde la aplicación** porque falta un paso crítico: **importar la función en el Developer Console**.

## ✅ Función Python - Estado Actual

- **RID:** `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
- **Nombre:** `analizar_dataset_automatico`
- **API Name:** `analizarDatasetAutomatico`
- **Versión:** `0.2.1`
- **Estado:** ✅ Publicada y funcionando
- **Repositorio:** :resource[ri.stemma.main.repository.47bf78b2-a987-4cc8-bfb2-aeced129bc49]

## ❌ Problema Identificado

La aplicación React (:resource[ri.stemma.main.repository.19f8e0b0-267b-460a-9c9d-a7746de85558]) **NO PUEDE** llamar directamente a la función Python porque:

1. **La función no está importada** en el Developer Console de la aplicación
2. **No hay SDK generado** para esta función en el repositorio React
3. El código intentaba llamar a la API incorrecta

## 🔧 Solución - Pasos a Seguir

### Opción 1: Importar la Función en Developer Console (RECOMENDADO)

Esta es la forma **correcta y recomendada** de integrar funciones Python en aplicaciones React OSDK:

1. **Abre tu aplicación en Developer Console**
   - Navega a: Developer Console > Aplicaciones
   - Abre: "App Análisis PII-PSI" (RID: `ri.third-party-applications.main.application.19cd33c0-5e30-41f8-9c44-69e372825c4b`)

2. **Importa la función Python**
   - Ve a la pestaña de "Resources" o "Ontology" en Developer Console
   - Click en "Add Resources" o "Import"
   - Busca la función: `analizarDatasetAutomatico` o pega el RID: `ri.function-registry.main.function.ede5758f-d860-40ab-bee0-0208088e6510`
   - Impórtala a la aplicación

3. **Regenera el SDK**
   - Después de importar, Developer Console generará automáticamente el SDK
   - Esto creará archivos TypeScript para llamar a la función de forma tipada

4. **Actualiza el código React**
   - Una vez que el SDK esté generado, podrás importar y usar la función así:
   ```typescript
   import { Client } from "@osdk/client";
   import { analizarDatasetAutomatico } from "@ontology/sdk";
   
   // En tu componente:
   const client = useClient(); // Hook de @osdk/react
   
   const resultado = await client(analizarDatasetAutomatico).executeFunction({
     datasetRid: rid
   });
   ```

### Opción 2: Usar la API de Queries Directamente (ALTERNATIVA)

Si no puedes importar en Developer Console, el código actual **ya está actualizado** para intentar llamar a la función como Query:

- ✅ Ya cambié el endpoint a: `/api/v2/ontologies/queries/analizarDatasetAutomatico/execute`
- ✅ Ya configuré la autenticación con cookies
- ✅ Ya añadí logs de depuración

**IMPORTANTE:** Esta opción requiere que:
1. La función esté definida como Query (con `api_name`)
2. La función esté en la misma Ontología que la aplicación
3. Tengas permisos para ejecutar queries

### Opción 3: Verificar Permisos de la Función

Si las opciones anteriores fallan, verifica:

1. **Permisos de la función:**
   - Ve a la función en Ontology Manager
   - Verifica que tu usuario/aplicación tenga permiso de "Execute"

2. **Ontología correcta:**
   - Asegúrate de que la función y la aplicación estén en la misma Ontología
   - O que la función esté en una Ontología compartida accesible

## 🧪 Cómo Probar

1. **Commit y despliega** los cambios actuales:
   ```bash
   npm run build
   npm run lint
   ```

2. **Publica** una nueva versión de la aplicación

3. **Prueba** ingresando un RID de dataset real

4. **Revisa la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña Console
   - Busca los logs que empiezan con 🔍, 📦, 📡, ✅ o ❌
   - Estos te dirán exactamente qué está fallando

## 📝 Cambios Realizados en Este Branch

1. ✅ Corregido el endpoint de la API para usar `/api/v2/ontologies/queries/`
2. ✅ Cambiado la autenticación para usar `credentials: 'include'`
3. ✅ Añadido logging detallado para depuración
4. ✅ Mejorado el manejo de errores con mensajes más claros
5. ✅ Mantenido el fallback con datos de ejemplo
6. ✅ Actualizada la UI para reflejar el estado de configuración

## 🚀 Próximos Pasos Recomendados

1. **Mergea este branch** a master
2. **Ve al Developer Console** y sigue la Opción 1 (Importar la función)
3. **Regenera el SDK** y actualiza el código para usar el SDK tipado
4. **Prueba** con un dataset real
5. **Documenta** el proceso para futuros desarrolladores

## 📚 Recursos Útiles

- [Python Functions Documentation](https://www.palantir.com/docs/foundry/functions/python-getting-started/)
- [Query Functions Documentation](https://www.palantir.com/docs/foundry/functions/query-functions/)
- [OSDK React Documentation](https://www.palantir.com/docs/foundry/ontology-sdk-react-applications/overview/)
- [Developer Console Documentation](https://www.palantir.com/docs/foundry/developer-console/create-application/)

## ❓ ¿Necesitas Ayuda?

Si sigues teniendo problemas:
1. Revisa los logs de la consola del navegador
2. Verifica los permisos en Ontology Manager
3. Confirma que la función esté en la Ontología correcta
4. Abre un issue con Palantir Support si es necesario

---

**Última actualización:** 2026-01-26  
**Branch:** ai-fde/fix-python-function-integration  
**Estado:** ⚙️ Código actualizado - Pendiente importación en Developer Console
