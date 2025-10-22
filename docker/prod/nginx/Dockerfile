# Use a stable version of Nginx for production
FROM nginx:1.23.4-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY ./docker/local/nginx/default.conf /etc/nginx/conf.d/default.conf

# Set appropriate permissions for the Nginx config
RUN chmod 644 /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP and 443 for HTTPS (if needed)
EXPOSE 80
EXPOSE 443

# Clean up unused files from Nginx (optional to reduce image size)
RUN rm -rf /var/cache/apk/*

# Set Nginx to run in the background
CMD ["nginx", "-g", "daemon off;"]
