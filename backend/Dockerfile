FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./

# https://github.com/Ilyes-El-Majouti/pdftopic/blob/main/docs/dependencies-installation.md
RUN apk add --no-cache imagemagick

RUN npm install

COPY . . 

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
