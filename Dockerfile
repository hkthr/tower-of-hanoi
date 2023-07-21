FROM alpine:3.16 as main
RUN apk update && apk add apache2
ENV SERVER_ADDRESS=localhost:80

COPY build/* /var/www/localhost/htdocs/
RUN ln -s /var/www/localhost/htdocs/ /var/www/localhost/htdocs/static

RUN sed -i 's/^#ServerName.*$/ServerName $SERVER_ADDRESS/' /etc/apache2/httpd.conf

EXPOSE 80

CMD ["/usr/sbin/httpd", "-f", "/etc/apache2/httpd.conf", "-DFOREGROUND"]

