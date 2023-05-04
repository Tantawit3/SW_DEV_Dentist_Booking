# FROM node:16.8.0
# WORKDIR /usr/src/app
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY . .
# RUN yarn --prod --frozen-lockfile

# CMD ["yarn", "start:prod"]

# First Stage : to install and build dependences
FROM node:16.10.0 AS builder
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn --prod --frozen-lockfile
COPY . ./
RUN yarn run build

# Second Stage : Setup command to run your app using lightweight node image
FROM node:16.10.0-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8000
CMD ["node", "dist/main"]