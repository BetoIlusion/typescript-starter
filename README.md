<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Sistema de Gestión de Inventario - NestJS

Un proyecto completo de inventario y stock construido con **NestJS**, siguiendo las mejores prácticas de arquitectura y patrones de diseño.

## 📋 Descripción

Sistema de gestión de inventario que implementa:
- ✅ CRUD completo de productos
- ✅ Gestión de stock con múltiples tipos de movimientos
- ✅ Historial de movimientos y auditoría
- ✅ Validaciones y manejo de errores con try-catch
- ✅ Filtros y búsquedas avanzadas
- ✅ Estadísticas del catálogo
- ✅ Arquitectura modular escalable

## 🚀 Características Principales

### Productos
- Crear, leer, actualizar y eliminar productos
- Búsqueda por nombre (búsqueda parcial)
- Filtrado por categoría
- Filtrado por rango de precio
- Estadísticas de catálogo
- Soft delete (desactivación) y hard delete

### Stock/Inventario
- Registrar stock inicial
- Entradas de stock (compras)
- Salidas de stock (ventas)
- Devoluciones de clientes
- Ajustes de stock
- Historial de movimientos
- Alertas de stock bajo

## 📦 Dependencias Recomendadas

### Instalación de dependencias actuales:

```bash
npm install
```

### Dependencias similares a Jetstream (Backend) para expandir el proyecto:

#### 1. Autenticación y Autorización
```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
npm install -D @types/bcrypt
```

#### 2. Base de Datos (ORM)
```bash
# Opción 1: TypeORM (recomendado)
npm install typeorm @nestjs/typeorm pg

# Opción 2: Prisma
npm install @prisma/client
npm install -D prisma
```

#### 3. Validación Avanzada
```bash
npm install class-validator class-transformer joi
```

#### 4. Configuración
```bash
npm install @nestjs/config dotenv
```

#### 5. Logging
```bash
npm install winston
```

#### 6. Documentación API
```bash
npm install @nestjs/swagger swagger-ui-express
```

#### 7. Seguridad
```bash
npm install helmet cors @nestjs/throttler
```

#### 8. Testing
```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

#### 9. Tareas Asincrónicas
```bash
npm install @nestjs/schedule
npm install @nestjs/bull bull # Para colas con Redis
```

## 📁 Estructura del Proyecto

```
src/
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── entities/
│   │   └── product.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── stock/
│   ├── dto/
│   │   ├── update-stock.dto.ts
│   │   └── stock-response.dto.ts
│   ├── entities/
│   │   └── stock.entity.ts
│   ├── stock.controller.ts
│   ├── stock.service.ts
│   └── stock.module.ts
├── app.module.ts
└── main.ts
```

## 🔧 API Endpoints

### Productos

```bash
# Crear producto
POST /products
Body: {
  "name": "Laptop",
  "description": "Laptop de 15 pulgadas",
  "price": 999.99,
  "category": "electronics"
}

# Obtener todos
GET /products

# Obtener por ID
GET /products/1

# Buscar por nombre
GET /products/search/laptop

# Filtrar por categoría
GET /products/category/electronics

# Filtrar por precio
GET /products/price-range/100/500

# Estadísticas
GET /products/admin/statistics

# Actualizar
PUT /products/1

# Desactivar
DELETE /products/1/deactivate

# Eliminar
DELETE /products/1
```

### Stock

```bash
# Crear stock
POST /stock
Body: { "productId": 1, "initialQuantity": 50 }

# Obtener stock
GET /stock/1

# Obtener todos
GET /stock

# Productos con bajo stock
GET /stock?type=low

# Entrada (compra)
POST /stock/1/entrada
Body: { "quantity": 20, "reason": "Compra" }

# Salida (venta)
POST /stock/1/salida
Body: { "quantity": 5, "reason": "Venta" }

# Devolución
POST /stock/1/devolucion
Body: { "quantity": 2, "reason": "Devolución" }

# Ajuste
PUT /stock/1
Body: { "quantity": 45, "reason": "Ajuste" }

# Historial
GET /stock/1/movements

# Eliminar
DELETE /stock/1
```

## 🎓 Conceptos Implementados

| Concepto | Descripción |
|----------|------------|
| **IF/When** | Validaciones condicionales en servicios |
| **Switch** | Diferentes tipos de movimientos de stock |
| **Try-Catch** | Manejo completo de errores |
| **Maps** | Almacenamiento de datos con `Map<K,V>` |
| **Objetos** | Clases instanciadas (Product, Stock) |
| **Arrays** | Colecciones de resultados |
| **For...Of** | Iteración sobre mapas y arrays |
| **DTOs** | Validación de entrada/salida |
| **REST APIs** | GET, POST, PUT, DELETE completo |
| **Decoradores** | @Controller, @Get, @Post, @Body, @Param |
| **Inyección Dependencias** | Servicios inyectados en controladores |
| **Excepciones** | BadRequestException, NotFoundException |

## 🏃 Ejecutar el proyecto

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Testing
npm run test
npm run test:cov
```

## 📝 Licencia

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)
