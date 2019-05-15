FROM mhart/alpine-node:10

# Create app directory
WORKDIR /home/node

# Add package.json, package.lock.json and yarn.lock
ADD package*.json yarn.lock ./
RUN rm -rf /home/node/node_modules
# Install app dependencies and dependencies to build bcrypt
RUN apk add --no-cache git \
    && apk add --no-cache make gcc g++ python \
    && yarn install \
    && apk del make gcc g++ python

# Copy app
COPY . /home/node

# Expose port
EXPOSE 3000

# Run app
CMD ["yarn", "start:dev"]
