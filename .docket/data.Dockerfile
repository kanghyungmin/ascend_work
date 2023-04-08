FROM node:16 AS builder
WORKDIR /prepare
COPY . .
RUN yarn

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /prepare .

EXPOSE 3000
CMD [ "nest", "start" "data-app" ]