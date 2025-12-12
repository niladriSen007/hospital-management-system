package com.hms.hms_user_service.services;

import com.hms.hms_user_service.model.Session;
import com.hms.hms_user_service.model.User;
import com.hms.hms_user_service.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {
    private final SessionRepository sessionRepository;
    private final int MAX_SESSIONS_PER_USER = 2;

    public void generateNewSession(String email,String refreshToken){
        List<Session> sessionsByUser = sessionRepository.findByUserEmail(email);
        if(sessionsByUser.size() == MAX_SESSIONS_PER_USER){
            sessionsByUser.sort(Comparator.comparing(Session::getLastUsedAt));
            Session oldestSession = sessionsByUser.get(0);
            sessionRepository.delete(oldestSession);
        }
        Session build = Session.builder().userEmail(email).refreshToken(refreshToken).build();
        sessionRepository.save(build);
    }

    public boolean validateSession(String refreshToken){
        Session session = sessionRepository.findByRefreshToken(refreshToken).orElseThrow(
                () -> new SessionAuthenticationException("Invalid session")
        );
        session.setLastUsedAt(LocalDateTime.now());
        sessionRepository.save(session);
        return session != null;
    }
}
