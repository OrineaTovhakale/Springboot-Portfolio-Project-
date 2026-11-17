package com.orineatovhakale.portfolio.contact;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactMessageRepository repository;

    public ContactService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ContactResponse submit(ContactRequest request) {
        ContactMessage message = new ContactMessage(
                request.name(),
                request.email(),
                request.message()
        );
        ContactMessage savedMessage = repository.save(message);
        return new ContactResponse(savedMessage.getId(), savedMessage.getCreatedAt());
    }
}
