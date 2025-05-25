// Not Found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // Error handler
  const errorHandler = (err, req, res, next) => {
    // Set status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for server side debugging
    console.error(`Error: ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
    
    // Send error response
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  };
  
  module.exports = { notFound, errorHandler };