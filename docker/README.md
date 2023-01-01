# Deploy with docker compose

## Setup

```bash
cp settings.example.yaml settings.yaml
cp example.env .env
```

Configure `.env` first, it is necessary.

For each config in `settings.yaml`, if they are available as environmental variables, there is no need to configure.
Keeping the default values is completely fine for `settings.yaml` as the compulsory values are already supplied by `.env`.

## Start

### Build from source

```bash
docker-compose up -d --build
```

### Use a prebuilt image

```bash
docker-compose up -d
```
