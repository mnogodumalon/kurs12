// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Instructors {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
  };
}

export interface Rooms {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    building?: string;
    capacity?: number;
  };
}

export interface Participants {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    name?: string;
    email?: string;
    phone?: string;
    birthdate?: string; // Format: YYYY-MM-DD oder ISO String
  };
}

export interface Courses {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    title?: string;
    description?: string;
    start_date?: string; // Format: YYYY-MM-DD oder ISO String
    end_date?: string; // Format: YYYY-MM-DD oder ISO String
    max_participants?: number;
    price?: number;
    instructor?: string; // applookup -> URL zu 'Instructors' Record
    room?: string; // applookup -> URL zu 'Rooms' Record
  };
}

export interface Registrations {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    participant?: string; // applookup -> URL zu 'Participants' Record
    course?: string; // applookup -> URL zu 'Courses' Record
    registration_date?: string; // Format: YYYY-MM-DD oder ISO String
    paid?: boolean;
  };
}

export const APP_IDS = {
  INSTRUCTORS: '6985ddef937525d57ec2b423',
  ROOMS: '6985ddf065483230e2934218',
  PARTICIPANTS: '6985ddf0b7349ef1d2228c79',
  COURSES: '6985ddf1167d7f6a5fd6486d',
  REGISTRATIONS: '6985ddf17e1431398a50dce9',
} as const;

// Helper Types for creating new records
export type CreateInstructors = Instructors['fields'];
export type CreateRooms = Rooms['fields'];
export type CreateParticipants = Participants['fields'];
export type CreateCourses = Courses['fields'];
export type CreateRegistrations = Registrations['fields'];