
# 🚀 Setup complet NestJS + Prisma + PostgreSQL (Neon)

## 1. 📦 Installation initiale

```bash
# Installer NestJS CLI
npm i -g @nestjs/cli

# Créer un nouveau projet
nest new my-app
cd my-app

# Installer Prisma + PostgreSQL
npm install prisma @prisma/client
npm install --save-dev ts-node

# Installer validation
npm install class-validator class-transformer

# Installer Swagger (doc API)
npm install @nestjs/swagger swagger-ui-express
```

---

## 2. 🗄️ Création base de données (Neon)

1. Va sur [https://neon.tech](https://neon.tech) → crée un compte.
2. Crée un **projet PostgreSQL**.
3. Récupère la connexion `DATABASE_URL`, elle ressemble à :

```
postgresql://user:password@ep-xxx-123.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 3. 🔑 Config `.env`

Crée un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://user:password@ep-xxx-123.eu-central-1.aws.neon.tech/neondb?sslmode=require"
PORT=3000
```

---

## 4. ⚙️ Config Prisma

Initialise Prisma :

```bash
npx prisma init
```

👉 Cela crée un dossier `prisma/` avec un fichier `schema.prisma`.

### Exemple `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  todo_id    String   @id @default(uuid())
  title      String
  description String?
  completed  Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```

---

## 5. 📥 Migration & génération

Applique le schéma à ta DB Neon :

```bash
npx prisma migrate dev --name init
```

Génère le client Prisma :

```bash
npx prisma generate
```

---

## 6. 🛠️ Service Prisma dans Nest

Créer le module Prisma :

```bash
nest g module prisma
nest g service prisma
```

### `prisma.service.ts`

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

## 7. ✅ Exemple module Todo

### Générer module/controller/service :

```bash
nest g module todos
nest g controller todos
nest g service todos
```

### DTO

`src/todos/dto/create-todo.dto.ts`

```ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Boolean)
  @IsBoolean()
  completed: boolean;
}
```

### Service

`src/todos/todos.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany();
  }

  findOne(todo_id: string) {
    return this.prisma.todo.findUnique({ where: { todo_id } });
  }

  create(data: CreateTodoDto) {
    return this.prisma.todo.create({ data });
  }

  delete(todo_id: string) {
    return this.prisma.todo.delete({ where: { todo_id } });
  }
}
```

### Controller

`src/todos/todos.controller.ts`

```ts
import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTodoDto) {
    return this.todosService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todosService.delete(id);
  }
}
```

---

## 8. 🌍 Validation globale

Dans `main.ts` :

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Todos API')
    .setDescription('API de gestion des tâches')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

---

## 9. 🚀 Lancer l’app

```bash
npm run start:dev
```

API dispo sur :
👉 `http://localhost:3000/todos`
Swagger dispo sur :
👉 `http://localhost:3000/api`

---

## 10. 📌 Résumé des commandes utiles

```bash
# Migration
npx prisma migrate dev --name init

# Voir la DB avec Prisma Studio
npx prisma studio

# Générer client Prisma
npx prisma generate
```

---

✅ Avec ça tu as un **setup complet** : NestJS + Prisma + PostgreSQL (Neon) + Validation + Swagger.
