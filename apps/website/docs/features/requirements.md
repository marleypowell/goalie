---
sidebar_position: 1
---

# Requirements

## Functional Requirements:
1.	**User Registration**: Users should be able to create an account by providing their details like name, email, password, etc.
2.	**User Login and Sign-out**: Users should be able to login to the application with their registered email and password and sign out when they are done.
3.	**User Details**: Users should be able to view their own details like name, email, etc. after signing in.
4.	**Admin Users**: The application should recognize admin users based on their username and provide them with additional privileges like viewing all goals.
5.	**Authentication**: The application should redirect users to the login page if they are not signed in to prevent unauthorized access.
6.	**Goal Creation**: Users should be able to create new goals for themselves by providing an initial name, target, and description.
7.	**Validation**: Validation should be implemented to check that an initial name and target are provided when creating a new goal, and appropriate error messages should be displayed if validation rules are broken.
8.	**Goal Listing**: Users should be able to view a list of their own goals and create new ones for themselves.
9.	**Goal Check-in**: Users should be able to check in to provide a progress update on a specific goal. This includes updating the current progress and adding a comment.
10.	**Goal Deletion**: Users should be able to delete their own goals, and admin users should be able to delete any goal.
11.	**Goal Details**: Users should be able to view the details of a specific goal they have permissions to access. The page should allow them to delete the goal, view progress, view change activity, and check in to provide a progress update.
12.	**Admin Goal Viewing**: Admin users should be able to view all goals for any user. This page should also allow them to delete goals.

## Non-functional Requirements:
1.	**Performance**: The application should be responsive and performant even under heavy load and traffic.
2.	**Security**: The application should implement appropriate security measures like encryption, authentication, and authorization to prevent unauthorized access and data breaches.
3.	**Usability**: The application should be user-friendly, with a clear and intuitive user interface that is easy to navigate and use.
4.	**Scalability**: The application should be designed in a way that allows it to scale easily to accommodate future growth and increased traffic.
5.	**Availability**: The application should be available, with minimal downtime and maintenance windows.
6.	**Accessibility**: The application should be accessible to users with disabilities and comply with accessibility standards and guidelines.
