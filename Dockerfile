FROM node:18-alpine as build

WORKDIR /app

RUN apk add git python3 libtool build-base

COPY ./src ./src
COPY ./package.json ./yarn.lock* ./tsconfig.json ./

RUN yarn install

RUN yarn build

RUN yarn install --production

FROM node:18-alpine

WORKDIR /app

RUN apk add bash screen git ffmpeg

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY ./package.json ./yarn.lock* ./tsconfig.json ./bastion.sh ./settings.example.yaml ./

RUN cp settings.example.yaml settings.yaml

COPY ./data ./data
COPY ./locales ./locales
COPY ./scripts ./scripts

SHELL [ "/bin/bash", "-c" ]

CMD ./bastion.sh --start && ./bastion.sh --show
