import SQLite from 'react-native-sqlite-storage';
import { User, GalleryItem, TeamMember, Testimonial, FAQ, CareGuide, Lead } from '../types';

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

    // Create team_members table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        qualification TEXT,
        image_path TEXT,
        display_order INTEGER DEFAULT 0
      );`
    );

    // Create testimonials table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        treatment_type TEXT,
        content TEXT,
        image_path TEXT,
        rating INTEGER DEFAULT 5
      );`
    );

    // Create FAQs table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        answer TEXT
      );`
    );

    // Create Care Guides table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS care_guides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
      );`
    );

    // Create Leads table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        treatment_interest TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT
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
export const getUserByEmailAndPassword = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (tx, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            resolve({
              id: user.id,
              email: user.email,
              password: user.password,
              role: user.role,
              createdAt: user.created_at || new Date().toISOString(),
            });
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          console.error('Error fetching user:', error);
          reject(error);
        }
      );
    });
  });
};

// 4. Function to add a gallery item
export const addGalleryItem = (
  title: string, 
  category: 'adult' | 'child', 
  beforeImagePath: string, 
  afterImagePath: string
): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO gallery_items (title, category, before_image_path, after_image_path) VALUES (?, ?, ?, ?)',
                [title, category, beforeImagePath, afterImagePath],
                (tx, results) => {
                    resolve(results.insertId || 0);
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

// 5. Function to get all gallery items
export const getGalleryItems = (): Promise<GalleryItem[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM gallery_items ORDER BY id DESC',
                [],
                (tx, results) => {
                    let items: GalleryItem[] = [];
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
export const deleteGalleryItem = (id: number): Promise<void> => {
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

// --- Team Member Functions ---

export const addTeamMember = (member: Omit<TeamMember, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO team_members (name, role, qualification, image_path, display_order) VALUES (?, ?, ?, ?, ?)',
        [member.name, member.role, member.qualification, member.image_path, member.display_order || 0],
        (tx, results) => resolve(results.insertId || 0),
        (tx, error) => reject(error)
      );
    });
  });
};

export const getTeamMembers = (): Promise<TeamMember[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM team_members ORDER BY display_order ASC, id DESC',
        [],
        (tx, results) => {
          let items: TeamMember[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => reject(error)
      );
    });
  });
};

export const deleteTeamMember = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM team_members WHERE id = ?',
        [id],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

// --- Testimonial Functions ---

export const addTestimonial = (testimonial: Omit<Testimonial, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO testimonials (patient_name, treatment_type, content, image_path, rating) VALUES (?, ?, ?, ?, ?)',
        [testimonial.patient_name, testimonial.treatment_type, testimonial.content, testimonial.image_path || '', testimonial.rating],
        (tx, results) => resolve(results.insertId || 0),
        (tx, error) => reject(error)
      );
    });
  });
};

export const getTestimonials = (): Promise<Testimonial[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM testimonials ORDER BY id DESC',
        [],
        (tx, results) => {
          let items: Testimonial[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => reject(error)
      );
    });
  });
};

export const deleteTestimonial = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM testimonials WHERE id = ?',
        [id],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

// --- FAQ Functions ---

export const addFAQ = (question: string, answer: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO faqs (question, answer) VALUES (?, ?)',
        [question, answer],
        (tx, results) => resolve(results.insertId || 0),
        (tx, error) => reject(error)
      );
    });
  });
};

export const getFAQs = (): Promise<FAQ[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM faqs ORDER BY id DESC',
        [],
        (tx, results) => {
          let items: FAQ[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => reject(error)
      );
    });
  });
};

export const deleteFAQ = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM faqs WHERE id = ?',
        [id],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

// --- Care Guide Functions ---

export const addCareGuide = (title: string, content: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO care_guides (title, content) VALUES (?, ?)',
        [title, content],
        (tx, results) => resolve(results.insertId || 0),
        (tx, error) => reject(error)
      );
    });
  });
};

export const getCareGuides = (): Promise<CareGuide[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM care_guides ORDER BY id DESC',
        [],
        (tx, results) => {
          let items: CareGuide[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => reject(error)
      );
    });
  });
};

export const deleteCareGuide = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM care_guides WHERE id = ?',
        [id],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

// --- Lead Functions ---

export const addLead = (name: string, phone: string, treatment_interest: string = 'General'): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO leads (name, phone, treatment_interest, status, created_at) VALUES (?, ?, ?, ?, ?)',
        [name, phone, treatment_interest, 'pending', new Date().toISOString()],
        (tx, results) => resolve(results.insertId || 0),
        (tx, error) => reject(error)
      );
    });
  });
};

export const updateLeadStatus = (id: number, status: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE leads SET status = ? WHERE id = ?',
        [status, id],
        () => resolve(),
        (tx, error) => reject(error)
      );
    });
  });
};

export const getLeads = (): Promise<Lead[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM leads ORDER BY created_at DESC',
        [],
        (tx, results) => {
          let items: Lead[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => reject(error)
      );
    });
  });
};
