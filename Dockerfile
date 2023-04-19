FROM node:alpine
COPY ./frontend /
WORKDIR /
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

