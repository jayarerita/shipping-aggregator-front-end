# Build react app

FROM node:19-alpine3.17 as build

WORKDIR /app

# Copy over the list of node packages and versions
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install all node packages
RUN npm install

# Copy files over
COPY . .

RUN npm run build

# Build nginx

FROM nginx:1.23.4-alpine as proxy

# Copy files built in the earlier stage into the nginx directory for serving
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]