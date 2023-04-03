---
slug: /
sidebar_position: 1
---

# Introduction

**Goalie** is a goal tracking tool that allows users to create and track their own goals.

## Features

The application has the following key features:
- **User Registration**: Users are able to create an account by registering themselves.
- **User login and sign-out**: Users are able to login to the application to view their own goals and sign-out when they are done.
- **User Details**: A page is provided for users to view their own details after signing in.
- **Admin Users**: The application recognizes admin users based on their username.
- **Authentication**: The application redirects users to the login page if they are not signed in.
- **Goal creation**: Users are able to create new goals for themselves, including an initial name, target and description.
- **Validation**: Validation is implemented to check that an initial name and target are provided when creating a new goal. When validation rules are broken, appropriate error messages are displayed.
- **Goal Listing**: Users are able to view a list of their own goals and create new ones for themselves.
- **Goal check-in**: Users are able to check in to provide a progress update on a specific goal. This includes updating the current progress and adding a comment.
- **Goal deletion**: Users are able to delete their own goals, and admin users are able to delete any goal.
- **Goal Details**: Users can view the details of a specific goal they have permissions to access. The page allows them to delete the goal, view progress, view change activity, and check in to provide a progress update.
- **Admin Goal Viewing**: Admin users are able to view all goals for any user. This page also allows them to delete goals.

These features provide the core functionality of the application, allowing users to track their goals and progress. The authentication and permission system ensures that users can only access the goals they are authorized to view or edit, while admins have additional access to view and manage all goals. Users can create, view, update, and delete their own goals, and track their progress over time.

#### Nice to have features

Based on the given requirements, the following nice-to-have features **may not be included** in the minimum viable product (MVP) due to time restrictions:
- **User interface design**: While the application should include a simple user interface, there may not be time to fully design and customize the user interface to be aesthetically pleasing and user-friendly.
-	**Advanced validation rules**: While the application should include validation rules to prevent invalid operations and data entry errors, advanced validation rules such as conditional formatting may not be included.
-	**Advanced analytics and reporting**: While the application should include basic analytics and reporting features, more advanced features such as data visualization or machine learning-based analytics may not be included.
-	**User details**: the ability for users to edit their own details may not be included in the minimum viable product, but they will still be able to view their details.


## Context
### Exclaimer

Exclaimer Ltd. is a software company that specializes in email signature management solutions for businesses of all sizes. The company was founded in 2001 and is based in Farnborough, Hampshire, UK.

Exclaimer's flagship product is called Exclaimer Cloud - Signatures for Office 365, which allows organizations to centrally manage and control their employees' email signatures in Microsoft Office 365. The software offers a range of customization options, including the ability to add promotional banners, social media links, and legal disclaimers to signatures.

Exclaimer is known for its agile approach to software development, which emphasizes iterative development, collaboration between teams, and frequent releases of new features and updates. This approach allows the company to stay responsive to customer needs and to quickly adapt to changing market conditions.

### Use case

Exclaimer currently uses spreadsheets to track OKRs. This Goal tracking application would significantly improve the current process by creating a centralized database for storing OKRs, the application would make it easier for users to manage and find OKRs, while also reducing the risk of errors or inconsistencies.

With real-time updates and automated reminders, the application would save time and reduce the risk of forgotten or delayed updates. By implementing user permissions, there would be improved security and it could be ensured that only authorized users can view, edit, or delete OKRs.

Finally, the application could provide analytics and reporting features that could help users better understand progress towards their OKRs, while also providing insights for managers to track the progress of their team. Overall, the Goal tracking application would provide a more efficient and streamlined process for tracking OKRs at Exclaimer and would help them to achieve their goals more effectively. 
