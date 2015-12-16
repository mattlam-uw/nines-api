# Description
This is the API server component of the Nines application. It provides a RESTful web API for viewing request response information and errors.

At this time, this should be installed on the same machine that hosts the Nines Pinger component.

Nines Pinger makes the actual HTTP requests and logs the results. This component provides a RESTful API view of the results.

# Dependencies
Node.js version 0.10.29 or newer

# Installation

1. Install Nines API
    1. Navigate to the directory you wish to install to and clone nines-api
        
        ```
        $ git clone git@github.com:mattlam-uw/nines-api.git
        ```
        
    2. Install node modules for Nines API
        
        ```
        $ cd nines-api
        $ npm install
        ```
        
2. Install Nines Pinger
    1. Clone Nines Pinger
        
        ```
        $ git clone git@github.com:mattlam-uw/nines-pinger.git
        ```
        
    2. Install node modules for Nines Pinger
        
        ```
        $ cd nines-pinger
        $ npm install
        ```
        
3. Remove the dummy file in the /nines-pinger/logs/ directory
    
    ```
    $ cd logs
    $ rm dummy.txt
    ```
    
4. Test Nines Pinger
    
    ```
    $ cd ..
    $ node nines-pinger.js
    ```
    
    The program should run for a couple of seconds, then:
    
    ```
    $ cd logs
    $ ls -la
    ```
    
    And you should see at least one file: ```header_request_log.txt```. But there may also be one or more files that start with ```err-```.
5. Test Nines API
    
    ```
    $ cd ../..
    $ node ./bin/www
    ```
    This should start the server. Now you can:
    
    1. Open a browser and navigate to: ```http://localhost:3000/urls```
    2. You should see either an empty object ```{}```, or an array of objects ```[{…},{…},{…}]```
    3. Now test ```http://localhost:3000/errors``` and you should get similar results.
	
# Story Backlog
| ID  | Story |
| --- | ----- |
| 1 | As a developer charged with installing and maintaining this application, I want to be able to use a system config file for setting the path used to locate the urls.json file. |
| 2 | As a developer charged with installing and maintaining this application, I want to be able to use a system config file for setting the log file directory path. |
