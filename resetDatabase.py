import sqlite3
DB_NAME = "db.sqlite3"

def reset_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Borrar todas las tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tablas = cursor.fetchall()

    for tabla in tablas:
        cursor.execute(f"DROP TABLE IF EXISTS {tabla[0]}")

    conn.commit()
    conn.close()

    print("Database reseteada")

if __name__ == "__main__":
    reset_db()