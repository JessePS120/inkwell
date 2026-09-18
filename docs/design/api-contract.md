# Inkwell API Contract — v1

## Types
UserPublic: { id: string, displayName: string, email: string, isVerified: boolean, createdAt: DateTime }
  Never includes passwordHash. The User entity itself is never returned by an endpoint.

## POST /api/auth/register
Request: { email: string, displayName: string, password: string }
Success: 201 { user: UserPublic, accessToken: string, refreshToken: string }
Errors:
  400 EMAIL_ALREADY_REGISTERED  — "This email is already registered."
  400 WEAK_PASSWORD             — "Password does not meet strength requirements."

## POST /api/auth/login
Request: { email: string, password: string }
Success: 200 { user: UserPublic, accessToken: string, refreshToken: string }
Errors:
  401 INVALID_CREDENTIALS       — "Invalid email or password."

## POST /:id/comments 
Request: { comment_txt: string } 
Success: 201 { comment : CommentPublic } 
Errors: 
  400 EMPTY_COMMENT           - "Comment may not be empty"
  401 UNAUTHENTICATED         - "User must be logged in to make a comment" 
  404 POST_NOT_FOUND          - "The requested post does not exist"  
  

## GET /api/posts?page=n
Success: 200 { posts: PostPublic[], page: number, hasMore: boolean }