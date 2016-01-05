# Nines Pinger

This is the component of Nines that sends HTTP requests to specified URLs and logs the results.

The URLs are currently specified in the file ./data/urls.json.

The logs are currently written to files in the ./logs directory.

# Installation Instructions

1. Navigate to the Nines application root directory
2. Clone this repository
3. Navigate to the root directory of your new clone of this repository [cd nines-pinger]
4. Create a 'logs' directory [mkdir logs]
5. Make a copy nines-pinger.example.sh and name it anything you like (e.g. nines-pinger.sh) [cp nines-pinger.example.sh nines-pinger.sh]
6. Edit your shell script (e.g. nines-pinger.sh) so that it effectively executes the following: $ node nines-pinger.js
7. Add a Crontab entry (or create a Cron job) to run your shell script according to your desired frequency (i.e. the frequency at which you want to ping the URLs). Here's an example crontab line that will run the shell script every thirty minutes:
    */30 * * * * ~/path/from/home/to/nines-pinger.sh

# Product Backlog
| ID | Story |
| -- | ----- |
| 1 | First Story. |
| 2 | Second Story. |
