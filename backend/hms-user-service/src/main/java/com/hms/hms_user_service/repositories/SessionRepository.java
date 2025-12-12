package com.hms.hms_user_service.repositories;

import com.hms.hms_user_service.model.Session;
import com.hms.hms_user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
    List<Session> findByUserEmail(String email);

    Optional<Session> findByRefreshToken(String refreshToken);
}
