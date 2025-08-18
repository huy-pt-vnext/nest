# nest

Run postgres with docker:

```
docker compose --env-file src/config/.env.development down && sudo docker compose --env-file src/config/.env.development up -d
```

Run migrate:

```
npm run migration:run
```

Start app:

```
npm run start:dev
```
