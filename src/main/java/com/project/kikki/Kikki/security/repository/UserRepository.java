package com.project.kikki.Kikki.security.repository;

import com.project.kikki.Kikki.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);


}
