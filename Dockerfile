FROM node:jessie

RUN npm install
RUN npm run build
RUN mkdir -p /usr/src/app

COPY package.json package-lock.json /usr/src/app/

COPY dist/ /usr/src/app/dist

WORKDIR /usr/src/app

CMD [ "node", "dist/src/index.js" ]
