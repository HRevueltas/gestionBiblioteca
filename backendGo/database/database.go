package database

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func DBConnection() (*sql.DB, error) {
	db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/bibliotecatest")
	if err != nil {
		return nil, err
	}
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	fmt.Println("Successfully connected!")
	return db, nil
}

func Close(db *sql.DB) {
	err := db.Close()
	if err != nil {
		fmt.Println("Error while closing the database connection:", err)
	} else {
		fmt.Println("Database connection closed successfully")
	}
}
