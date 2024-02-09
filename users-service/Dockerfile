FROM node:20

ENV TZ America/Sao_Paulo
ENV NODE_ENV=production

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli
RUN npm run build

CMD ["npm", "run", "start:prod"]
