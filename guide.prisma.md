Parfait 👍 tu veux installer **Prisma dans ton projet NestJS**.
Je vais te donner le **setup étape par étape**, en version claire et pratique, comme tu le ferais dans un vrai projet pro.

---

# 🚀 Étapes d’installation de Prisma dans NestJS

### 1️⃣ Installer Prisma et son client

Dans ton projet NestJS, exécute :

```bash
npm install prisma --save-dev
npm install @prisma/client
```

* `prisma` → l’outil CLI (dev only).
* `@prisma/client` → la librairie générée qui te permet de faire des requêtes dans ton code.

---

### 2️⃣ Initialiser Prisma

Toujours dans ton projet :

```bash
npx prisma init
```

👉 Ça va créer :

* un dossier `prisma/` avec `schema.prisma`
* un fichier `.env` (pour la connexion DB).

---

### 3️⃣ Configurer ta base de données

Dans `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

👉 Tu peux utiliser PostgreSQL, MySQL, SQLite, MongoDB…
Exemple pour MongoDB :

```env
DATABASE_URL="mongodb+srv://user:password@cluster0.mongodb.net/mydb"
```

---

### 4️⃣ Définir ton schéma Prisma

Dans `prisma/schema.prisma` :

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // ou "mysql", "sqlite", "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

---

### 5️⃣ Générer Prisma Client

```bash
npx prisma generate
```

👉 Cela va créer automatiquement le client Prisma typé.

---

### 6️⃣ Créer la PrismaService dans NestJS

Dans `src/prisma/prisma.service.ts` :

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

### 7️⃣ Créer le PrismaModule

Dans `src/prisma/prisma.module.ts` :

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

👉 `@Global()` = tu peux injecter `PrismaService` partout dans ton app.

---

### 8️⃣ Utiliser Prisma dans un service NestJS

Exemple avec `UserService` :

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  create(data: { email: string; name: string }) {
    return this.prisma.user.create({ data });
  }
}
```

---

### 9️⃣ Migration (SQL seulement)

Si tu es en PostgreSQL/MySQL/SQLite → exécute une migration :

```bash
npx prisma migrate dev --name init
```

👉 Ça crée la DB et applique ton schéma.

---

# ✅ Résumé

1. `npm install prisma @prisma/client`
2. `npx prisma init`
3. Config `.env` → base de données
4. Définis ton `schema.prisma`
5. `npx prisma generate`
6. Crée `PrismaService` + `PrismaModule`
7. Utilise Prisma dans tes services NestJS
8. (Si SQL) → `npx prisma migrate dev`

---
