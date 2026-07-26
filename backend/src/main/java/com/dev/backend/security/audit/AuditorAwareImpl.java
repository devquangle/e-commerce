package com.dev.backend.security.audit;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.dev.backend.security.CustomUserDetails;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<Integer> {
    @Override
    public Optional<Integer> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        if (!(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return Optional.empty();
        }

        return userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"))
                        ? Optional.empty()
                        : Optional.ofNullable(userDetails.getId());
    }
}
