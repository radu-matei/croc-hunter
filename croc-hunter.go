// The infamous "croc-hunter" game as featured at many a demo
package main

import (
	"fmt"
	"net/http"
	"os"

	spin "github.com/fermyon/spin/sdk/go/http"
)

func init() {
	spin.Handle(func(w http.ResponseWriter, r *http.Request) {
		handler(w, r)
	})
}

const (
	html = `
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<title>Croc Hunter</title>
				<link rel='stylesheet' href='/static/game.css'/>
				<link rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
				<link rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
			</head>
			<body>
				<canvas id="canvasBg" width="800" height="490" ></canvas>
				<canvas id="canvasEnemy" width="800" height="500" ></canvas>
				<canvas id="canvasJet" width="800" height="500" ></canvas>
				<canvas id="canvasHud" width="800" height="500" ></canvas>
				<script src='/static/game2.js'></script>
				<div class="details">
				<strong>Powered By: </strong>%s<br>
				</div>
			</body>
		</html>
		`
)

func handler(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path == "/healthz" {
		w.WriteHeader(http.StatusOK)
		return
	}

	powered := os.Getenv("POWERED_BY")

	if powered == "" {
		powered = "spin"
	}

	fmt.Fprintf(w, html, powered)
}

func main() {}
