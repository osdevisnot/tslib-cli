FROM node:lts

LABEL maintainer="Abhishek Shende <osdevisnot@gmail.com>"

WORKDIR /usr/src/tslib-cli

COPY . .

RUN npm link --quiet --production --only=production

CMD [ "tslib-cli" ]
