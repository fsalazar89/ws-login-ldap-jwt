# Specify a base image
FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 8046
ENV PORT=8046
CMD ["npm","run","start"]