---
sidebar_position: 1
---

# Tests

## Test Cases

| Test # | Test Name         | Test Purpose                                                                                   | Test Data                                                          | Expected Result                                                        |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 001    | User Registration | Test if a new user can create an account by registering themselves                             | First name, Last name, Username, email, password, confirm password | User is able to register and receives a confirmation message           |
| 002    | User Login        | Test if a registered user can log in to the application                                        | Registered user credentials (username/email and password)          | User is able to log in and is redirected to the home page              |
| 003    | User Sign-out     | Test if a logged-in user can sign-out of the application                                       | N/A                                                                | User is successfully signed out and redirected to the login page       |
| 004    | User Details      | Test if the user details page is displayed correctly for a logged-in user                      | N/A                                                                | User is able to view their own details                                 |
| 005    | Admin Users       | Test if the application correctly identifies admin users based on their username               | Admin user credentials (username and password)                     | Admin user is correctly identified and given appropriate access        |
| 006    | Authentication    | Test if the application redirects users to the login page if they are not signed in            | N/A                                                                | User is redirected to the login page if they are not signed in         |
| 007    | Goal Creation     | Test if a logged-in user can create a new goal for themselves                                  | Goal name, target and description                                  | User is able to create a new goal and receives a confirmation message  |
| 008    | Validation        | Test if the application correctly enforces validation rules for goal creation                  | Goal name and target are missing                                   | Appropriate error message is displayed and user cannot create the goal |
| 009    | Goal Listing      | Test if a logged-in user can view a list of their own goals and create new ones for themselves | N/A                                                                | User is able to view a list of their own goals and create new ones     |
| 010    | Goal Check-in     | Test if a logged-in user can check-in to provide a progress update on a specific goal          | Goal progress and comment                                          | User is able to complete a progress check-in and comment are recorded  |
| 011    | Goal Deletion     | Test if a logged-in user can delete their own goals and admin users can delete any goal        | Goal to be deleted and user/admin credentials                      | Goal is deleted and appropriate confirmation message is displayed      |
| 012    | Goal Details      | Test if the goal details page is displayed correctly for a logged-in user                      | Goal ID and user credentials                                       | User is able to view the details of the specific goal                  |

## Test Runs

### Test Run 1

| Test # | Test Date  | Tester Name   | Expected Result                                                        | Actual Result                                                          | Pass ✅ / Fail ❌ | Notes |
| ------ | ---------- | ------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------- | ----- |
| 001    | 2023-04-03 | Marley Powell | User is able to register and receives a confirmation message           | User was able to register and recieved a confirmation message          | ✅               |       |
| 002    | 2023-04-03 | Marley Powell | User is able to log in and is redirected to the home page              | User was able to log in and was redirected to the home page            | ✅               |       |
| 003    | 2023-04-03 | Marley Powell | User is successfully signed out and redirected to the login page       | User was successfully signed out and redirected to the login page      | ✅               |       |
| 004    | 2023-04-03 | Marley Powell | User is able to view their own details                                 | User was able to view their own details                                | ✅               |       |
| 005    | 2023-04-03 | Marley Powell | Admin user is correctly identified and given appropriate access        | Admin user was correctly identified and given appropriate access       | ✅               |       |
| 006    | 2023-04-03 | Marley Powell | User is redirected to the login page if they are not signed in         | User was successfully redirected to login page when not signed in      | ✅               |       |
| 007    | 2023-04-03 | Marley Powell | User is able to create a new goal and receives a confirmation message  | User was able to create a new goal and received a confirmation message | ✅               |       |
| 008    | 2023-04-03 | Marley Powell | Appropriate error message is displayed and user cannot create the goal | An error message was displayed and user was unable to create the goal  | ✅               |       |
| 009    | 2023-04-03 | Marley Powell | User is able to view a list of their own goals and create new ones     | User was able to view a list of their own goals and create new ones    | ✅               |       |
| 010    | 2023-04-03 | Marley Powell | User is able to complete a progress check-in and comment are recorded  | User was able to complete a progress check-in                          | ✅               |       |
| 011    | 2023-04-03 | Marley Powell | Goal is deleted and appropriate confirmation message is displayed      | Goal was deleted and appropriate confirmation message was displayed    | ✅               |       |
| 012    | 2023-04-03 | Marley Powell | User is able to view the details of the specific goal                  | User was able to view the details of the specific goal                 | ✅               |       |
