package com.orineatovhakale.portfolio.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactEmailService {

    private final JavaMailSender mailSender;
    private final String senderAddress;
    private final String notificationRecipient;
    private final boolean smtpConfigured;

    public ContactEmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String senderAddress,
            @Value("${spring.mail.password}") String senderPassword,
            @Value("${portfolio.contact.notification-recipient}") String notificationRecipient
    ) {
        this.mailSender = mailSender;
        this.senderAddress = senderAddress;
        this.notificationRecipient = notificationRecipient;
        this.smtpConfigured = !senderAddress.isBlank() && !senderPassword.isBlank();
    }

    public void sendContactEmails(ContactRequest request) {
        if (!smtpConfigured) {
            throw new MailSendException("Gmail SMTP is not configured. Set MAIL_USERNAME and MAIL_PASSWORD.");
        }

        SimpleMailMessage notification = new SimpleMailMessage();
        notification.setFrom(senderAddress);
        notification.setTo(notificationRecipient);
        notification.setReplyTo(request.email());
        notification.setSubject("New portfolio message from " + request.name());
        notification.setText("""
                You received a new message through your portfolio contact form.

                Name: %s
                Email: %s

                Message:
                %s
                """.formatted(request.name(), request.email(), request.message()));
        mailSender.send(notification);

        SimpleMailMessage confirmation = new SimpleMailMessage();
        confirmation.setFrom(senderAddress);
        confirmation.setTo(request.email());
        confirmation.setSubject("Thanks for reaching out");
        confirmation.setText("""
                Hi %s,

                Thanks for reaching out through my portfolio. I’ve received your message and will be in touch.

                Orinea Tovhakale
                """.formatted(request.name()));
        mailSender.send(confirmation);
    }
}
