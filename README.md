# Croc Hunter - The game!

> This is a fork of [Lachie's repository](https://github.com/lachie83/croc-hunter). For those who want to take a trip down memory lane, [here](https://youtu.be/NVoln4HdZOY) and [here](https://youtu.be/eMOzF_xAm7w) you can find Lachie's original demo videos.

### Building and running

To build the application locally, you need Spin and the TinyGo compiler:

```shell
$ spin build
Executing the build command for component croc-hunter: tinygo build -target=wasi -gc=leaking -o croc-hunter.wasm croc-hunter.go
Successfully ran the build command for the Spin components.
```

To run the application locally:

```shell
$ spin up
Logging component stdio to ".spin/logs/"

Serving http://127.0.0.1:3000
Available Routes:
  croc-hunter: http://127.0.0.1:3000
  fileserver: http://127.0.0.1:3000/static (wildcard)
```

### Deploying to Fermyon Cloud

[Sign up](https://cloud.fermyon.com) for a free [Fermyon Cloud](https://fermyon.com/cloud) account, then run `spin deploy`:

```shell
$ spin deploy
Uploading croc-hunter version 0.1.0+r33d66ef1...
Deploying...
Waiting for application to become ready........ ready
Available Routes:
  croc-hunter: https://croc-hunter.fermyon.app
  fileserver: https://croc-hunter.fermyon.app/static (wildcard)
```
