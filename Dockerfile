FROM node:jessie
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
CMD npm run build
COPY dist/ /app/dist
CMD [ "node", "dist/index.js" ]
