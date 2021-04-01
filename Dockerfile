FROM node:13-alpine
RUN npm install
RUN npm build
WORKDIR /usr/src/app
COPY ./node_modules ./node_modules
COPY ./dist .
COPY ./ormconfig.js ./ormconfig.js
COPY ./.env ./.env
COPY ./migrations ./migrations
COPY ./typeormconfig.js ./typeormconfig.js
COPY ./package*.json ./
COPY ./tsconfig*.json ./
EXPOSE 3000

CMD [ "node", "./src/main.js" ]
