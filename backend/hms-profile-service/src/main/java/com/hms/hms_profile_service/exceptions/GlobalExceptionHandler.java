package com.hms.hms_profile_service.exceptions;

import com.hms.hms_profile_service.errors.ApiError;
import org.springframework.beans.MethodInvocationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

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

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError<?>> handleAccessDeniedException(AccessDeniedException ex) {
        ApiError<Object> apiError = new ApiError<>("FORBIDDEN", HttpStatus.FORBIDDEN, null);
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }


}
