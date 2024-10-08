FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate dev

RUN npm run build

EXPOSE 3000:3000

CMD [ "npm", "run", "start:prod" ]