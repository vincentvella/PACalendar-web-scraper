FROM node:jessie

RUN mkdir -p /usr/src/app
COPY package.json package-lock.json ./src /usr/src/app/

RUN npm install
RUN npm run build

COPY dist/ /usr/src/app/dist

WORKDIR /usr/src/app

CMD [ "node", "dist/src/index.js" ]
