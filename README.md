# UniPay - Unified Payment Management System

UniPay is a modern, full-stack payment management application designed to handle invoices and payment processing with ease. Built with Next.js for the frontend and Node.js/Express for the backend, it provides a seamless experience for managing payments and generating invoices.

## Features

- **Invoice Management**: Create, view, and manage invoices
- **Payment Processing**: Handle payments securely
- **User Authentication**: Secure user accounts with JWT authentication
- **Responsive Design**: Works on desktop and mobile devices
- **PDF Generation**: Generate professional PDF invoices
- **Email Notifications**: Send invoices and payment reminders via email

## Tech Stack

### Frontend
- Next.js with TypeScript
- React with Hooks
- Tailwind CSS for styling
- Radix UI components
- React Hook Form for form handling
- Zod for schema validation

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for email notifications
- Puppeteer for PDF generation
- Rate limiting and security middleware

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose (for containerized development)
- MongoDB (or use the Docker setup)

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/msagr/unipay.git
   cd unipay
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Update the environment variables with your configuration

3. **Start the development environment**
   ```bash
   # Using Docker (recommended)
   npm run docker:up
   
   # Or manually
   cd backend && npm install && npm run dev
   cd ../frontend && npm install && npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:5000

### Production Deployment

1. **Build the application**
   ```bash
   docker-compose -f prod.yml build
   ```

2. **Start the services**
   ```bash
   docker-compose -f prod.yml up -d
   ```

## Project Structure

```
unipay/
├── backend/           # Backend API server
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── server.js      # Main server file
├── frontend/          # Next.js frontend
│   ├── app/           # App router pages
│   ├── components/    # Reusable components
│   └── lib/           # Utility functions
├── docker/            # Docker configuration
│   ├── prod/          # Production Docker files
│   └── local/         # Local development Docker files
└── docs/              # Documentation
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `NODE_ENV`: Environment (development/production)
- `EMAIL_*`: Email configuration for notifications

### Frontend
- `NEXT_PUBLIC_API_URL`: URL of the backend API
- `NEXT_PUBLIC_ENV`: Environment (development/production)

## API Documentation

API documentation is available at `/api-docs` when running the backend in development mode.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the [GitHub repository](https://github.com/msagr/unipay/issues).
