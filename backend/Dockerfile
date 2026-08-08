FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Ensure upload/encrypted directories exist and have proper permissions
RUN mkdir -p uploads encrypted decrypted && chmod 777 uploads encrypted decrypted

# Expose the API port
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
