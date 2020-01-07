FROM nginx
RUN mkdir /app
COPY /dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
