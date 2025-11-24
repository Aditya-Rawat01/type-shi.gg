FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build


FROM node:20-alpine AS runner
COPY --from=builder ./app/package.json ./package.json
COPY --from=builder ./app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
RUN npm i --production
EXPOSE 3000
CMD [ "npm","run","deploy:start" ]
# this doesnt involve the env file, so i have to either add the docker compose or use the command line to add env vars