This is simple nuget v2 client which works with nexus. 

It was created to go around problems with certificates which nuget written in mono has. 
It is usable only when nuget is used as source of application packages which 
then get installed on machines within environment. Unusable for nuget being source os libraries. 

# Running for development
First build project it will install dependencies and compile typescript:
 
`npm run build`

Then run:
 
`node target/index.js` to run main file - it will display help on commands

# Installing global
Run

`npm run install-global`

To install dependencies, compile and link index.js to command: `nuget-downloader`

Now you can type `nuget-downloader` in terminal and execute from any folder

# Updating

`npm uninstall -g nuget-downloader`

Then install new version and link it again