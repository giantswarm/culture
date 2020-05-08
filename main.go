package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("\n================================\n\n   CULTURE IS GOING! \n\n   visit http://localhost:8000 \n\n================================\n\n CTRL-C to stop\n\n")
	http.ListenAndServe(":8000", http.FileServer(http.Dir(".")))
}
