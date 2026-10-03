FROM node:20-alpine

WORKDIR /app

COPY orm/package.json orm/package-lock.json ./
RUN npm ci

COPY orm/prisma ./prisma
RUN npx prisma generate

COPY orm/src ./src

EXPOSE 3000

CMD ["sh", "-c", "npm run db:deploy && npm start"]
