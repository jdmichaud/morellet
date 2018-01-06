FROM nginx:1.13.8

RUN apt update
RUN apt install -y curl xz-utils less
# Install node/npm
RUN cd /root && \
  curl -sOL https://nodejs.org/dist/v8.9.3/node-v8.9.3-linux-x64.tar.xz && \
  tar xf node-v8.9.3-linux-x64.tar.xz && \
  (export PATH=$PATH:/root/node-v8.9.3-linux-x64/bin; npm install -g n) && \
  (export PATH=$PATH:/root/node-v8.9.3-linux-x64/bin; n 8.9.4) && \
  npm update -g npm && \
  rm -fr node-v8.9.3-linux-x64 node-v8.9.3-linux-x64.tar.xz

COPY . /root/morellet/
RUN cd /root/morellet && \
  npm install && \
  npm run build && \
  cp -r dist/* /usr/share/nginx/html && \
  cd /root && \
  rm -fr morellet
