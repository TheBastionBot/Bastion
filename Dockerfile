FROM node:lts-alpine3.20 as build

WORKDIR /app

RUN apk add --no-cache make g++ python3

COPY src src
COPY package.json tsconfig.json ./

RUN npm install
RUN npm run build


FROM node:lts-alpine3.20

WORKDIR /app

RUN apk add --no-cache make g++ python3 ffmpeg

COPY package.json ./
COPY settings.example.yaml ./settings.yaml
COPY data data
COPY locales locales
COPY --from=build /app/dist ./dist

RUN npm install --omit=dev

CMD npm start
