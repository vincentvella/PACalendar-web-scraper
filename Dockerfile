FROM node:jessie
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . .
CMD [ "node", "dist/index.js" ]
