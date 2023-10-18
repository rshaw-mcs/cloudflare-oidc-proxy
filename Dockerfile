# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /opt/app

# Create a non-root user
RUN useradd -m -u 1001 appuser

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port on which your app will run
EXPOSE 3000

# Switch to the non-root user
USER appuser

# Define the command to run your application
CMD ["npm", "start"]
