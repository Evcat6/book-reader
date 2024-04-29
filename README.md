# BookReader: A Platform for Sharing and Discovering Books

BookReader is a dynamic web application designed to revolutionize the way users share and discover books online. With BookReader, users can upload their favorite books for free, making them accessible to a wider audience. Whether you're an avid reader, a book enthusiast, or an author looking to share your work, BookReader provides a seamless platform for connecting with like-minded individuals.

## Key Features
- **Upload and Share**: Easily upload your books to the platform and choose whether to make them public or private.
- **Discover New Reads**: Explore a vast library of books shared by other users, ranging from fiction to non-fiction, classics to contemporary.
- **Comfortable Reading Experience**: Enjoy a user-friendly interface for viewing and reading books, making your reading experience smooth and enjoyable.
- **Search Functionality**: Effortlessly search for books based on genre, author, title, or keywords, making it convenient to find the books you're interested in.

BookReader aims to foster a community of book lovers, providing a platform where individuals can connect, share their literary passions, and discover new reads. Join us on BookReader and embark on a journey of literary exploration and connection.


Database Structure

![database-structure](./db-diagram.png)


## Technologies Used

### Frontend
- **Framework**: Vue.js
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Library**: Vuetify
- **Form Validation**: Vee Validate

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **File Upload**: Minio (for uploading PDF files)
- **CDN Service**: Cloudinary (for storing and retrieving book preview images quickly)
- **Image Processing**: ImageMagick + pdftopic (for extracting images from PDF files)
- **API Documentation**: Swagger
