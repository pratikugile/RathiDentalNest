import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

// 1. Open the database
const db = SQLite.openDatabase(
  {
    name: 'RathiDental.db',
    location: 'default',
  },
  () => { console.log('Database opened'); },
  error => { console.error('Database error: ', error); }
);

// 2. Initialize the database (Create tables and seed default users)
export const initDatabase = () => {
  db.transaction(tx => {
    // Create users table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      );`
    );

    // Create gallery_items table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS gallery_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT, -- 'adult' or 'child'
        title TEXT,
        before_image_path TEXT,
        after_image_path TEXT
      );`
    );

    // Seed admin user
    tx.executeSql('SELECT * FROM users WHERE email = ?', ['admin@rathidental.com'], (tx, results) => {
      if (results.rows.length === 0) {
        tx.executeSql('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', ['admin@rathidental.com', 'admin', 'admin']);
      }
    });

    // Seed test user
    tx.executeSql('SELECT * FROM users WHERE email = ?', ['user'], (tx, results) => {
      if (results.rows.length === 0) {
        tx.executeSql('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', ['user', 'user', 'user']);
      }
    });
  });
};

// 3. Function to get a user by email and password
export const getUserByEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password], // Case sensitive for email now to distinguish 'user' and 'User'
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

// 4. Function to add a gallery item
export const addGalleryItem = (title, category, beforeImagePath, afterImagePath) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO gallery_items (title, category, before_image_path, after_image_path) VALUES (?, ?, ?, ?)',
                [title, category, beforeImagePath, afterImagePath],
                (tx, results) => {
                    resolve(results.insertId);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

// 5. Function to get all gallery items
export const getGalleryItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM gallery_items ORDER BY id DESC',
                [],
                (tx, results) => {
                    let items = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        items.push(results.rows.item(i));
                    }
                    resolve(items);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

// 6. Function to delete a gallery item
export const deleteGalleryItem = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM gallery_items WHERE id = ?',
                [id],
                () => {
                    resolve();
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};


// 7. Helper function to save images permanently
export const saveImageToAppDirectory = async (tempUri) => {
    const fileName = tempUri.split('/').pop();
    const newPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
        await RNFS.copyFile(tempUri, newPath);
        return newPath;
    } catch (error) {
        console.error('Error saving image: ', error);
        throw error;
    }
}; 
