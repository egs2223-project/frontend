FROM node:alpine
COPY ./ ./
WORKDIR ./
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]