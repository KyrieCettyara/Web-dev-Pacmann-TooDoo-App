import psycopg2
import psycopg2.extras

DB_URI = 'postgresql://postgres:root@localhost:5432/todoo_app'
client = psycopg2.connect(DB_URI)
db = client.cursor(cursor_factory=psycopg2.extras.DictCursor)
