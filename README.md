# Upper English - English School Attendance System

Upper English is an attendance system designed for English schools, offering authentication functionalities and integration with FaunaDB. Developed using Tailwind CSS and Next.js, the project aims to simplify student attendance tracking and class management for English educational institutions.

## Key Features

- **Secure Authentication**: Integrated authentication system to ensure access only to authorized users.
- **Attendance Management**: Allows the recording and monitoring of student attendance in specific classes.
- **FaunaDB Integration**: Utilizes FaunaDB for secure and efficient data storage.
- **Intuitive Interface**: Developed using Tailwind CSS, providing a clean and responsive interface.

## Technologies Used

- **Next.js**: React framework for server-side rendering and web application development.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent styling.
- **FaunaDB**: Distributed and secure database for data storage.

## Environment Variables

Before starting the project, you need to set the following environment variables:

- **FAUNADB_KEY**: FaunaDB access key for connecting to the database.
- **NEXT_URL**: URL for redirection after authentication.
- **SECRET_COOKIE_PASSWORD**: Password for signing session cookies.

Create a `.env.local` file at the root of the project and add the variables as shown below:

```plaintext
FAUNADB_KEY=YourFaunaDBKeyHere
NEXT_URL=https://your-url.com
SECRET_COOKIE_PASSWORD=YourSecretPasswordHere
```

Ensure to protect this confidential information and avoid sharing it publicly to maintain the security of your application.

## Getting Started

1. Setting Up Environment

Configure the environment variables as described above.

2. Installing Dependencies

Run the following command to install all required dependencies

```
npm install
```

3. Running the Project

Start the project locally with the following command:
```
npm run dev
```

The project will be available at http://localhost:3000.

## FaunaDB Collections

To replicate the project successfully, please reach out via email at endersonluciog@gmail.com to obtain the necessary FaunaDB collections. We'll provide the required collections to set up your FaunaDB instance for this project.

Feel free to contact us for any assistance or queries regarding the setup process.


## Contribution
Contributions are welcome! Feel free to send pull requests for improvements, bug fixes, or adding new features.
