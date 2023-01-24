FROM node:lts-alpine as build

WORKDIR /app

COPY src src
COPY package.json tsconfig.json ./

RUN npm install
RUN npm run build


FROM node:lts-alpine

WORKDIR /app

RUN apk add ffmpeg

COPY package.json ./
COPY settings.example.yaml ./settings.yaml
COPY data data
COPY locales locales
COPY --from=build /app/dist ./dist

RUN npm install --omit=dev

CMD npm start
