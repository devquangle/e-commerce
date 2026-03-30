package com.dev.backend.service;


public interface SendEmailService {
    
    void sendEmailRegister(String toEmail, String subject, String token);

}
