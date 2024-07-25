FROM node:20-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

#EXPOSE 3000 #Lo expongo desde docker-compose

#CMD ["node", "bin/www"] #Lo expongo desde docker-compose