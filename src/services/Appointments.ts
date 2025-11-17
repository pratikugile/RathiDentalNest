import { AppointmentModel } from '../types/database';
import SQLite from 'react-native-sqlite-storage';

// Use the same database instance
const db = SQLite.openDatabase(
  {
    name: 'RathiDental.db',
    location: 'default',
  },
  () => { console.log('Database opened for appointments'); },
  error => { console.error('Database error: ', error); }
);

/**
 * Initialize appointments table
 */
export const initAppointmentsTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        patientName TEXT NOT NULL,
        patientPhone TEXT NOT NULL,
        patientEmail TEXT,
        patientAge INTEGER,
        appointmentDate TEXT NOT NULL,
        appointmentTime TEXT NOT NULL,
        treatmentType TEXT NOT NULL,
        doctorId INTEGER,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );`
    );
  });
};

/**
 * Create a new appointment
 */
export const createAppointment = (appointmentData: Omit<AppointmentModel, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    const {
      userId,
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      appointmentDate,
      appointmentTime,
      treatmentType,
      doctorId,
      notes,
      status = 'pending',
    } = appointmentData;

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO appointments 
        (userId, patientName, patientPhone, patientEmail, patientAge, appointmentDate, appointmentTime, treatmentType, doctorId, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId || null, patientName, patientPhone, patientEmail || null, patientAge || null, appointmentDate, appointmentTime, treatmentType, doctorId || null, notes || null, status],
        (tx, results) => {
          resolve(results.insertId!);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

/**
 * Get all appointments
 */
export const getAllAppointments = (): Promise<AppointmentModel[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM appointments ORDER BY appointmentDate DESC, appointmentTime DESC',
        [],
        (tx, results) => {
          const appointments: AppointmentModel[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            appointments.push(results.rows.item(i));
          }
          resolve(appointments);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

/**
 * Get appointments by user ID
 */
export const getAppointmentsByUserId = (userId: number): Promise<AppointmentModel[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM appointments WHERE userId = ? ORDER BY appointmentDate DESC, appointmentTime DESC',
        [userId],
        (tx, results) => {
          const appointments: AppointmentModel[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            appointments.push(results.rows.item(i));
          }
          resolve(appointments);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

/**
 * Get appointments by status
 */
export const getAppointmentsByStatus = (status: string): Promise<AppointmentModel[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM appointments WHERE status = ? ORDER BY appointmentDate DESC, appointmentTime DESC',
        [status],
        (tx, results) => {
          const appointments: AppointmentModel[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            appointments.push(results.rows.item(i));
          }
          resolve(appointments);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = (id: number, status: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE appointments SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
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

/**
 * Delete appointment
 */
export const deleteAppointment = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM appointments WHERE id = ?',
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

/**
 * Get appointment by ID
 */
export const getAppointmentById = (id: number): Promise<AppointmentModel | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM appointments WHERE id = ?',
        [id],
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
