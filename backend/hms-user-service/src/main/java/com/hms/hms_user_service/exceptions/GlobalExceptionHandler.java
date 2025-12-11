package com.hms.hms_user_service.exceptions;

import com.hms.hms_user_service.errors.ApiError;
import com.hms.hms_user_service.errors.UserAlreadyExistsException;
import com.hms.hms_user_service.errors.UserNotFoundException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.MethodInvocationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError<?>> handleAuthenticationException(AuthenticationException ex) {
        ApiError<Object> apiError = new ApiError<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED, null);
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiError<?>> handleJwtException(JwtException ex) {
        ApiError<Object> apiError = new ApiError<>("INVALID_TOKEN", HttpStatus.UNAUTHORIZED, null);
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiError<?>> handleUserNotFoundException(UserNotFoundException ex) {
        ApiError<Object> apiError = new ApiError<>("USER_NOT_FOUND", HttpStatus.NOT_FOUND, null);
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError<?>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        ApiError<Object> apiError = new ApiError<>("USER_ALREADY_EXISTS", HttpStatus.CONFLICT, null);
        return new ResponseEntity<>(apiError, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError<?>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        ApiError<Object> apiError = new ApiError<>(errorMessage, HttpStatus.BAD_REQUEST, null);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodInvocationException.class)
    public ResponseEntity<ApiError<?>> handleMethodInvocationException(MethodInvocationException ex) {
        ApiError<Object> apiError = new ApiError<>("METHOD_INVOCATION_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, null);
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
