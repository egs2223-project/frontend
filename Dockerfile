FROM node:alpine
COPY ./
WORKDIR ./
RUN npm install
RUN npm start