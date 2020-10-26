export const jwtConstants = {
  secret: "secretKey",
  expirationTime: "12h",
};

export enum AppRoles {
  INSTRUCTOR = 'Instructor',
  STUDENT = 'Student'
}

export enum TrainingTypes {
  PRIVATE = 'Private',
  PUBLIC = 'Public'
}

export enum SearchTrainingTypes {
  ALL = 'All',
  PRIVATE = 'Private',
  PUBLIC = 'Public'
}