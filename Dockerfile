FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm","run","start" ]
# this doesnt involve the env file, so i have to either add the docker compose or use the command line to add env vars