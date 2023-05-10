# build stage            
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# prod stage
FROM node:18-alpine AS production
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm install --only=production

# copy the builded code
COPY --chown=node:node --from=build /usr/src/app/dist/. ./dist

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
