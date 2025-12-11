package com.hms.hms_user_service.errors;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


public class ApiError<T> {
    private LocalDateTime timeStamp;
    private String message;
    private HttpStatus statusCode;
    private T data;

    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }
    public ApiError(String message, HttpStatus statusCode) {}

    public ApiError(String message, HttpStatus statusCode, T data) {
        this();
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

}
