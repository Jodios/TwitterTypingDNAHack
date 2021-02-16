FROM node:14

#create directory
RUN mkdir -p /usr
WORKDIR /usr/

COPY package.json ./
RUN npm install
COPY . ./
RUN ls src

EXPOSE 82
CMD ["npm", "start"] 