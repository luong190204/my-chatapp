package com.chat.chatapp.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dz3maumbu",
                "api_key", "591931968553712",
                "api_secret", "wISA6wPKzPaM8aLgGjVaTExc4sE"
        ));
    }
}
