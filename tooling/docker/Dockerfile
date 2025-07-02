#Create our image from Node 22.12.0
FROM node:22.12.0

# Install the Angular CLI globally
RUN npm install -g @angular/cli

#Create a new directory to run our app.
RUN mkdir -p /usr/src/app

#Set the new directory as our working directory
WORKDIR /usr/src/app

#Copy all the content to the working directory
COPY . /usr/src/app

#install node packages to node_modules
RUN npm install --force

#Our app runs on port 8080. Expose it!
EXPOSE 8080

##Build the angular app in production mode and store the artifacts in dist folder
RUN ng build --configuration production --base-href=/hccl/

#Run the application.
CMD npm start