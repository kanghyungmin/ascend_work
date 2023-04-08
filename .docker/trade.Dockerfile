FROM node:16 AS builder
WORKDIR /prepare
COPY . .
RUN yarn

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /prepare .
RUN ["npm", "i", "-g", "@nestjs/cli"]
EXPOSE 3000
CMD [ "nest", "start", "trade-app"]