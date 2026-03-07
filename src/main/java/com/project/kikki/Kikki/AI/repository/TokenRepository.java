package com.project.kikki.Kikki.AI.repository;


import com.project.kikki.Kikki.AI.entity.AiTokenUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<AiTokenUsage,Long> {

    //Repository to store the token metadata in the DB

}
