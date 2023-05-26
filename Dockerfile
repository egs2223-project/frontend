FROM node:alpine
COPY ./frontend-k3s /
WORKDIR /
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

