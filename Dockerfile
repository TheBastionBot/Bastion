FROM node:24-alpine AS build

WORKDIR /app

RUN apk add --no-cache make g++ python3

COPY package.json package-lock.json tsconfig.json ./

RUN npm ci

COPY src src

RUN npm run build
RUN npm prune --omit=dev


FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg yt-dlp

COPY package.json ./
COPY settings.example.yaml ./settings.yaml
COPY data data
COPY locales locales
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist

USER node

CMD [ "node", "." ]
