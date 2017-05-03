# AWS S3 Connector

An Arrow connector to AWS S3.

# Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Service Compatibility](#service-compatibility)
- [Changelog](#changelog)
- [Development](#development)
- [License](#license)

# Installation
The connector works in the context of Arrow application.

So first [create your Arrow application](http://docs.appcelerator.com/platform/latest/#!/guide/API_Builder_Getting_Started). 

In the terminal from the root of your app install the connector with:

```sh 
appc install connector/appc.aws.s3
```

# Configuration
After the installation you will see `conf/appc.aws.s3.default.js` config file.

It will contain template with all configuration parameters.

Some of them have default values but other must be configured appropriately.

For this connector you need to set the following configuration properties:
```sh
    connectors: {
      'appc.aws.s3': {
        accessKeyId: '<MANDATORY. ACCESS KEY ID>'
        secretAccessKey: '<MANDATORY. SECRET ACCESS KEY>'
      }
    }
```

# Usage
Run your arrow application with:
```sh 
appc run
```

Then open the admin ui pannel usually at http://localhost:8080/arrow to play with the available models and exposed endpoints.

# Service Compatibility
[Please read this for more information on connector versions, sdk versions and coverage](./COMPATIBILITY.md)

# Changelog

Please see [the changelog](./CHANGELOG.md)

# Development
> This section is for individuals developing the AWS S3 Connector and not intended for end-users.

## Sample Development Workflow

Clone this repository

From the root of your project run `npm install`

Run `npm test` to see unite test suite test results

Start doing your code changes

Make sure the test suite is still working after code changes

### Start the connector in standalone mode 
Run the following command to do this:
```sh
npm start
```

Usually you could open http://localhost:8080/arrow to play with the available models and endpoints.

## Contributing 

This project is open source and licensed under the [Apache Public License (version 2)](http://www.apache.org/licenses/LICENSE-2.0).  Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

To protect the interests of the contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once.

[You can digitally sign the CLA](http://bit.ly/app_cla) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

# Legal Stuff

This software is licensed under the Apache 2 Public License. However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement. Copyright (c) 2014-2017 by Appcelerator, Inc. All Rights Reserved.

Appcelerator is a registered trademark of Appcelerator, Inc. Arrow and associated marks are trademarks of Appcelerator. All other marks are intellectual property of their respective owners. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at [http://www.appcelerator.com/legal](http://www.appcelerator.com/legal).