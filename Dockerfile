# In works for now please restrain from use or make it work!!
FROM node:16

# Copy app and install packages
WORKDIR /var/app
COPY    package*.json ./
COPY    . .
RUN     npm i
RUN     npm i -g pm2 

ENV PORT 8080

EXPOSE  8080

CMD     ["pm2-runtime", "index.js"]