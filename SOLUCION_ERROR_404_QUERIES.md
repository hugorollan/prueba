# 🔧 SOLUCIÓN ERROR HTTP 404 - Query Functions

## 🔴 Problema Actual

La aplicación React está intentando llamar a:
```
/api/v2/ontologies/ri.ontology.main.ontology.122b5e19-6632-4dd9-acb1-4a41f4571048/queries/analizarDatasetServerless/execute
```

Pero recibe **HTTP 404**, lo que significa que la Query no está registrada en esa ontología.

---

## 🎯 SOLUCIÓN: Registrar las Query Functions en la Ontología Correcta

### Opción 1: Usar Ontology Manager (RECOMENDADO)

1. **Abre Ontology Manager**
   - Ve a la ontología: `ri.ontology.main.ontology.122b5e19-6632-4dd9-acb1-4a41f4571048`
   
2. **Importa las funciones como Queries**
   - Click en "Add Function" o "Import Function"
   - Busca: `analizarDatasetServerless`
   - RID: `ri.function-registry.main.function.28bb1f29-0e30-4e99-bc79-3f4524bd2da0`
   - Versión: `^0.4.0`
   
3. **Verifica que tenga API Name**
   - La función debe tener `apiName: "analizarDatasetServerless"`
   - Esto la hace accesible como Query

4. **Guarda los cambios**

---

### Opción 2: Verificar en qué Ontología están registradas

Las funciones pueden estar en una ontología diferente. Para verificar:

1. **Ve al repositorio TypeScript Functions**
   - :resource[ri.stemma.main.repository.e19f1bef-e5b2-4b6b-b501-d3be51a220a9]
   
2. **Revisa "Resources"**
   - Deberías ver "Query Functions (2)"
   - `analizar_dataset_automatico` v0.2.6
   - `analizarDatasetServerless` v0.4.0

3. **Verifica el Ontology RID**
   - Mira qué ontología está vinculada
   - Si es diferente a `122b5e19-6632-4dd9-acb1-4a41f4571048`, necesitas:
     - **O bien**: Actualizar la app React para usar esa ontología
     - **O bien**: Mover las funciones a la ontología correcta

---

### Opción 3: Actualizar la Ontología en la App React

Si las funciones están en una ontología diferente, actualiza el código:

**Archivo**: `src/components/AnalisisFinal.tsx`

```typescript
// Cambiar esta línea:
const ontologyRid = 'ri.ontology.main.ontology.122b5e19-6632-4dd9-acb1-4a41f4571048';

// Por la ontología correcta donde están las funciones
// (Revisa en el repo TypeScript qué ontología usa)
```

---

## 🔍 DIAGNÓSTICO: Verificar qué Ontología Usar

### Paso 1: Verifica en el repo TypeScript

1. Abre :resource[ri.stemma.main.repository.e19f1bef-e5b2-4b6b-b501-d3be51a220a9]
2. Ve a "Resources" → Mira el "Ontology" asignado
3. Anota el RID de la ontología

### Paso 2: Verifica en Developer Console de la App React

1. Abre Developer Console de tu app
2. Ve a "Functions" o "Resources"
3. Verifica si `analizarDatasetServerless` está importada
4. Si no está, impórtala

---

## ✅ SOLUCIÓN RÁPIDA (Método preferido)

**En Developer Console de la App React:**

1. Ve a **"Functions"** o **"Resources"**
2. Click **"Add"** o **"+"**
3. Busca: **`analizarDatasetServerless`**
4. Selecciona versión: **`^0.4.0`**
5. Click **"Save"**
6. **Regenera el SDK** (pestaña "SDK versions")
7. **Espera 1-2 minutos**
8. **Prueba la app nuevamente**

---

## 🎯 ARQUITECTURA CORRECTA

Para que funcione, necesitas:

```
1. Función TypeScript publicada ✅
   └─ RID: ri.function-registry.main.function.28bb1f29...
   └─ apiName: "analizarDatasetServerless"
   └─ Versión: 0.4.0

2. Función registrada en Ontología ❓
   └─ Ontology RID: ??? (VERIFICAR)
   └─ Accesible como Query

3. App React configurada ✅
   └─ Llama a: /api/v2/ontologies/{ONTOLOGY_RID}/queries/analizarDatasetServerless/execute
```

---

## 📞 SIGUIENTE PASO

**Verifica en el repositorio TypeScript qué Ontology RID está usando:**

1. Abre: :resource[ri.stemma.main.repository.e19f1bef-e5b2-4b6b-b501-d3be51a220a9]
2. Panel izquierdo → "Resources"
3. Mira el número debajo de "Ontology" 
4. **Compárteme ese RID**

Con ese RID, actualizaré la aplicación React para que use la ontología correcta.

---

## 💡 ALTERNATIVA: Usar la función Python directamente

Si el problema persiste, podemos usar `analizar_dataset_automatico` (Python) directamente:

```typescript
const queryApiName = 'analizarDatasetAutomatico'; // En lugar de 'analizarDatasetServerless'
```

Esta función Python SÍ está registrada como Query (vimos v0.2.6 en el panel).

¿Quieres que pruebe esta alternativa?
