## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Endpoints

### Endpoints posts
### Récupérer tous les posts
- **GET** `/posts`
- **Réponse :**
```json
[
  {
    "id": "le id",
    "title": "Titre du post",
    "body": "Contenu du post",
    "userId": "le id de l'utilisateur"
  },
  ...
]
```

### Créer un post (authentification requise)
- **POST** `/posts/create`
- **Headers :**
  - `Authorization: Bearer <token JWT>`
- **Body :**
```json
{
  "title": "Titre obligatoire",
  "body": "Contenu obligatoire"
}
```
- **Réponse :**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "le id",
    "title": "Titre obligatoire",
    "body": "Contenu obligatoire",
    "userId": "le id de l'utilisateur"
  }
}
```

### Modifier un post (authentification requise)
- **PATCH** `/posts/update/:id`
- **Headers :**
  - `Authorization: Bearer <token JWT>`
- **Body :** (au moin   s un champ)
```json
{
  "title": "Nouveau titre",
  "body": "Nouveau contenu"
}
```
- **Réponse :**
```json
{
  "message": "Post updated successfully",
  "post": {
    "id": "le id",
    "title": "Nouveau titre",
    "body": "Nouveau contenu",
    "userId": "le id de l'utilisateur"
  }
}
```

### Supprimer un post (authentification requise)
- **DELETE** `/posts/delete/:id`
- **Headers :**
  - `Authorization: Bearer <token JWT>`
- **Réponse :**
```json
{
  "message": "Post deleted successfully"
}
```

### Endpoints user

### Créer un utilisateur
- **POST** `/auth/register`
- **Body :**
```json
{
  "email": "email obligatoire",
  "password": "password obligatoire",
  "username": "username obligatoire"
}
```
- **Réponse :**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "le id",
    "email": "email obligatoire",
    "password": "password obligatoire"
  }
}
```

### Se connecter
- **POST** `/auth/login`
- **Body :**
```json
{
  "email": "email obligatoire",
  "password": "password obligatoire"
}
```
- **Réponse :**
```json
{
  "message": "User signed in successfully",
  "user": {
    "id": "le id",
    "email": "email obligatoire",
    "password": "password obligatoire"
  }
}
```

### Documentation swagger
- **GET** `/api`


### Documentation swagger
- **GET** `/api-json`


# test coverage
$ npm run test:cov
```

## Deployment



```bash
$ npm install -g mau
$ mau deploy
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

## Auteur
- Projet réalisé par [NIKIEMA MARIUS]

## Licence
[MIT](LICENSE)

