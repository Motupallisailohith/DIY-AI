// src/main/java/com/marketplace/catalog/web/RestExceptionAdvice.java
package com.marketplace.catalog_service.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class RestExceptionAdvice {
  @ExceptionHandler(IllegalArgumentException.class)
  ResponseEntity<?> badReq(IllegalArgumentException ex){
    return ResponseEntity.badRequest().body(ex.getMessage());
  }
}
