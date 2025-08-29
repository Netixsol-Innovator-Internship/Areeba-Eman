# Comment System API Testing Guide

This guide explains how to use the Postman collection to test the Comment System API.

## Setup

1. **Import the Collection**
   - Open Postman
   - Click "Import" and select the `Comment-System-API.postman_collection.json` file
   - The collection will be imported with all endpoints and environment variables

2. **Configure Environment Variables**
   - The collection uses the following variables:
     - `baseUrl`: API base URL (default: http://localhost:5000/api)
     - `authToken`: JWT token (auto-set after login/register)
     - `userId`: Current user ID (auto-set after login/register)
     - `commentId`: Comment ID for testing (auto-set after creating a comment)

3. **Start the Backend Server**
   \`\`\`bash
   cd backend
   npm install
   npm run start:dev
   \`\`\`

## Testing Workflow

### 1. Authentication Flow
1. **Register User** - Creates a new user account
   - Automatically sets `authToken` and `userId` variables
   - Use unique username and email for each test

2. **Login User** - Authenticates existing user
   - Updates `authToken` and `userId` variables
   - Required for all protected endpoints

3. **Verify Token** - Validates current token
   - Tests token validity and expiration

### 2. User Management
1. **Get My Profile** - Retrieves current user's profile
2. **Update Profile** - Updates bio and other profile information
3. **Upload Profile Picture** - Uploads image file (requires form-data)
4. **Get User by Username** - Retrieves public user profile
5. **Get All Users** - Lists all registered users

### 3. Comments System
1. **Create Comment** - Posts a new top-level comment
   - Automatically sets `commentId` variable for testing
2. **Create Reply** - Posts a reply to existing comment
   - Uses `commentId` from previous step
3. **Get All Comments** - Retrieves all top-level comments
4. **Get Comment Replies** - Retrieves replies for specific comment
5. **Update Comment** - Modifies comment content (owner only)
6. **Delete Comment** - Removes comment (owner only)

### 4. Likes System
1. **Like Comment** - Adds like to a comment
2. **Unlike Comment** - Removes like from a comment
3. **Get Comment Likes** - Lists all users who liked a comment
4. **Check If Comment Liked** - Checks if current user liked a comment
5. **Get My Likes** - Lists all comments liked by current user

### 5. Followers System
1. **Follow User** - Follow another user
2. **Unfollow User** - Unfollow a user
3. **Get User Followers** - List user's followers
4. **Get User Following** - List users that a user follows
5. **Check If Following** - Check follow status
6. **Get Follow Stats** - Get follower/following counts

### 6. Notifications
1. **Get My Notifications** - Retrieve all notifications
2. **Get Unread Count** - Get count of unread notifications
3. **Mark Notification as Read** - Mark specific notification as read
4. **Mark All as Read** - Mark all notifications as read
5. **Delete Notification** - Remove a notification

## Testing Tips

### Authentication
- Always run "Register User" or "Login User" first
- The token is automatically added to subsequent requests
- Token expires after 7 days (configurable in backend)

### Error Handling
- Test with invalid data to verify validation
- Test unauthorized access (without token)
- Test forbidden actions (e.g., editing others' comments)

### File Uploads
- Use actual image files for profile picture uploads
- Supported formats: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB

### Real-time Features
- WebSocket notifications won't be visible in Postman
- Use the frontend application to test real-time features
- API endpoints will still trigger WebSocket events

## Common Test Scenarios

### 1. Complete User Journey
1. Register new user
2. Update profile with bio
3. Upload profile picture
4. Create a comment
5. Like own comment (should fail)
6. Create another user and like the comment
7. Reply to the comment
8. Check notifications

### 2. Permission Testing
1. Create comment with User A
2. Try to edit comment with User B (should fail)
3. Try to delete comment with User B (should fail)
4. Verify only owner can modify comments

### 3. Follow System Testing
1. Create two users (A and B)
2. User A follows User B
3. Check follower/following counts
4. User A unfollows User B
5. Verify counts are updated

## Environment Variables Reference

| Variable | Description | Auto-set |
|----------|-------------|----------|
| `baseUrl` | API base URL | No |
| `authToken` | JWT authentication token | Yes |
| `userId` | Current user's ID | Yes |
| `commentId` | Last created comment ID | Yes |

## Response Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Troubleshooting

### Common Issues
1. **401 Unauthorized**: Token expired or missing - run login again
2. **404 Not Found**: Check if the resource ID exists
3. **400 Bad Request**: Verify request body format and required fields
4. **CORS Errors**: Ensure backend CORS is configured for your domain

### Debug Tips
- Check the Console tab in Postman for script errors
- Verify environment variables are set correctly
- Use the Network tab to inspect raw requests/responses
- Enable Postman Console for detailed logging
