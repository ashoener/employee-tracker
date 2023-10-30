# Employee Tracker
![License Badge](https://img.shields.io/badge/license-MIT-green)  

## Description

Employee Tracker is a project designed to allow you to manage a database full of employees, roles, and departments.
You can create departments, assign roles to those departments, including salary, and finally asign those roles to employees.
You can also view a total budget for each department.


## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [Questions](#questions)
- [License](#license)

## Installation

To install Employee Tracker, you must first clone the repository.
```bash
git clone https://github.com/ashoener/employee-tracker.git
cd employee-tracker
```
Afterwards, run the following command:
```bash
npm install
```

Once everything is installed, you need to specify what database to connect to. Rename the .env.example file to .env, and fill in the connection information.


## Usage

If you would like to just try it out, run `node seeds.js` to create tables with example information. Note that this will overwrite any tables you may already have.

Once everything is connected, you may run `node index.js` to start up the tracker. All the prompts are labeled, so you may follow them to manager your company.

You may also watch a video [here](#todo) that guides you through the various prompts.


## How to Contribute

If you would like to contribute, create a pull request. Be sure to include information about what your changes do.


## Tests

Currently, there are no tests included with this project. They may be created in the future.


## Questions

If you have any questions, you may contact me via [GitHub](ashoener) or by [email](mailto:a.b.shoener@gmail.com).

## License

This project is covered under the MIT license. You may view it [here](/LICENSE).

