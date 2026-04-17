package com.project.kikki.Kikki.security.config;

import com.project.kikki.Kikki.security.dto.UserDto;
import com.project.kikki.Kikki.security.entity.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        mapper.addMappings(new PropertyMap<User, UserDto>() {
            @Override
            protected void configure() {
                map().setFullName(source.getName());
            }
        });

        return mapper;
    }
}
