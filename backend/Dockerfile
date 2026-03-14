FROM node:20-alpine

# edge-tts nécessite Python + pip
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --break-system-packages edge-tts

WORKDIR /app

# Dépendances d'abord (cache Docker)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Code source
COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
