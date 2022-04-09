FROM node:16

# Copy app and install packages
WORKDIR /var/app
COPY    package*.json ./
COPY    . .
RUN     npm i
RUN     npm i -g pm2 

ENV PORT 8080

ENV MONGO_URL mongodb+srv://RosePinkDragon:pm19Mc2UXnqw5OxA@nodejs.kmdkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

ENV SECRET !wdwxu*mg8DWJQw$g=^45Q#asRt&C*pVrzr@JEu5VXgf4=vHGpm-AXj3E+gQqT?r4ud2qqVW^u2u74%9y-J&Ub*DLXUQ=ZCpD^f

ENV NODE_ENV prod

EXPOSE  8080

CMD     ["pm2-runtime", "index.js"]