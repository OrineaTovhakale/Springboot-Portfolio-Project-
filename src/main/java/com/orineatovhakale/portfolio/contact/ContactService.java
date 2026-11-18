package com.orineatovhakale.portfolio.contact;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final ContactEmailService emailService;

    public ContactService(ContactMessageRepository repository, ContactEmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @Transactional
    public ContactResponse submit(ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.name(),
                request.email(),
                request.message()
        );
        ContactMessage savedMessage = repository.save(message);
        emailService.sendContactEmails(request);
        return new ContactResponse(savedMessage.getId(), savedMessage.getCreatedAt());
    }
}
