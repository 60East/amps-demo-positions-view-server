## AMPS View Server Demo

This project provides a quick introduction into using Webix DataTable with AMPS 
JavaScript client by building a simple web application which utilizes the AMPS 
technologies in order to provide web UI for a view server.


#### Prerequisites

- AMPS Server **v5.3** or higher.
- Python **2.7** or **3.5** with AMPS Python client installed. The detailed instructions on how to download 
  and install the client are available [here](http://devnull.crankuptheamps.com/documentation/html/5.3.0.0/dev-guides/python/html/chapters/installing.html)
- Node.js (**v6.9.1** or higher) with NPM (Node Package Manager). It can be downloaded from [the official website](https://nodejs.org/en/download/) or via 
  your operating system's [package manager](https://nodejs.org/en/download/package-manager/) (preferred).


#### Project Files

The project directory consists of the following paths:

- `publishers` - A set of scripts and data files that generate a data flow to AMPS;
- `servers` - AMPS Server configuration files for three instances in corresponding subdirectories (`us`, `uk`, `sg`);
- `web_ui` - the web interface project directory that contains a TypeScript web application that connects to AMPS.


#### Installation

Once the AMPS Python client is installed we only need to install Web Interface dependencies. From the project directory, 
navigate to the `web_ui` directory and run the following command:

```bash
npm install --save
```

The above command installs packages required for this application to work. The 
command installs these packages locally in the `web_ui` directory.


#### Quick Start

- Navigate to the `servers/us` directory and start the first AMPS server instance. Optionally, you can also
  start `uk` and `sg` instances from their corresponding directories to evaluate replication between AMPS instances:

```bash
cd servers/us
<PATH_TO_AMPS_SERVER_BINARY>/ampServer us.xml
```

- Start the publishing scripts that generate real-time data flow:

```bash
cd publishers
./all.py
```

- Start the web interface (from `web_ui`) and open it in a browser:

```bash
npm start
```

Once started, the web interface will be available at `http://127.0.0.1:8888`.

- Click on the "Connect" button to see the view server in action.

The more detailed instruction about the user interface is available in the README.md file in the `web_ui` directory.


#### Galvanometer

Each AMPS instance comes with the built-in web interface called Galvanometer. It's enabled by default and provides
real-time visual information about the AMPS instance. In particular, it allows to query and subscribe to AMPS topics 
and see message data. Navigate to `http://<server_ip>:8085` for the `us` instance (`8185` and `8285` for `uk` and `sg`)
to see Galvanometer in action. To query topics, navigate to the `SQL` page.
