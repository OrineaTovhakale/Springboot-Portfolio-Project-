package com.orineatovhakale.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Email
        @Size(max = 254)
        String email,

        @NotBlank
        @Size(min = 10, max = 5000)
        String message
) {
    public ContactRequest {
        if (name != null) {
            name = name.trim();
        }
        if (email != null) {
            email = email.trim();
        }
        if (message != null) {
            message = message.trim();
        }
    }
}
