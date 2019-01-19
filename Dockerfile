FROM node:jessie

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm install
RUN npm build

COPY dist/ /usr/src/app/dist

CMD [ "node", "dist/src/index.js" ]
