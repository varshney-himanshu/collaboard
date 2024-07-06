# Collaboard

Collaboard is a real-time whiteboard collaboration application designed to enable seamless teamwork and creativity.

## Features

- **Real-Time Collaboration**: Multiple users can draw, write, and interact on the same board simultaneously.
- **User-Friendly Interface**: An intuitive UI designed to enhance the user experience and minimize the learning curve.
- **Cross-Platform[PENDING]**: Works on desktop and mobile browsers, allowing you to collaborate from anywhere.
- **Persistent Storage**: Boards are saved and can be accessed and modified at any time.
- **Role-Based Access Control**: Manage who can view and edit your boards with different access levels.
- **Drawing Tools[PENDING]**: Various drawing tools including pen, eraser, shapes, and colors to enhance creativity.
- **Undo/Redo [PENDING]**: Easily undo and redo actions to correct mistakes or changes.
- **Chat Integration [PENDING]**: In-app chat to communicate with collaborators in real-time.
- **Socket.IO**: Uses Socket.IO for real-time, bidirectional, and event-based communication.

## Usage

- **Sign Up/Log In**: Create an account or log in to an existing one.
- **Create a Board:** Click on 'Create New Board' to start a new collaboration.
- **Invite Collaborators**: Share the board link with your team to invite them.

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Clone the Repository

```sh
git clone https://github.com/varshney-himanshu/collaboard.git
cd collaboard
```

### Install Dependencies

Move to respective directories for both backend and frontend client and execute the following command:

```sh
npm install
```

### Environment Variables

Create a .env file in the root directory of the backend and add the necessary environment variables:

```sh
MONGO_URI=<your mongo uri>
JWT_SECRET=<your jwt secret>
```

### Start the servers in dev environment

Client

```sh
npm run dev
```

Backend

```sh
npm start
```
